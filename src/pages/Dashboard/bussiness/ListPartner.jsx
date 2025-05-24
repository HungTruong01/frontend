import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import {
  getAllPartners,
  addPartner,
  updatePartner,
  getPartnerById,
} from "@/api/partnerApi";
import PartnerDetailModal from "@/components/Dashboard/partner/PartnerDetailModal";
import TogglePartnerModal from "@/components/Dashboard/partner/TogglePartnerModal";
import { toast } from "react-toastify";
import { Pagination } from "@/utils/pagination";
import { getAllPartnerTypes } from "@/api/partnerTypeApi";

const ListPartner = () => {
  const [partners, setPartners] = useState([]);
  const [partnerTypes, setPartnerTypes] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);

  const columns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Họ và tên" },
    { key: "address", label: "Địa chỉ" },
    { key: "partnerTypeId", label: "Loại đối tác" },
    { key: "debt", label: "Công nợ" },
  ];

  const fetchPartners = async () => {
    try {
      const [partnerRes, partnerTypeRes] = await Promise.all([
        getAllPartners(0, 100, "id", "asc"),
        getAllPartnerTypes(0, 100, "id", "asc"),
      ]);
      setPartners(partnerRes.data.content);
      setPartnerTypes(partnerTypeRes.data.content);
    } catch (error) {
      toast.error("Không thể tải danh sách đối tác");
      setPartners([]);
      setPartnerTypes([]);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const filterPartners = () => {
    return partners.filter((partner) => {
      const matchName = partner.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchType =
        searchType === "" || partner.partnerTypeId === parseInt(searchType);
      return matchName && matchType;
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNew = async (newPartner) => {
    try {
      const partnerData = {
        name: newPartner.name,
        phone: newPartner.phone,
        email: newPartner.email,
        address: newPartner.address,
        partnerTypeId: parseInt(newPartner.type),
        organization: newPartner.organization,
        taxCode: newPartner.taxCode,
      };
      console.log(partnerData);
      await addPartner(partnerData);
      toast.success("Thêm đối tác thành công");
      await fetchPartners();
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error("Không thể thêm đối tác");
      console.error("Error adding partner:", error);
    }
  };

  const handleEditClick = (partner) => {
    setCurrentPartner(partner);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedPartner) => {
    try {
      const partnerData = {
        name: updatedPartner.name,
        phone: updatedPartner.phone,
        email: updatedPartner.email,
        address: updatedPartner.address,
        partnerTypeId: parseInt(updatedPartner.type),
        organization: updatedPartner.organization || "",
        taxCode: updatedPartner.taxCode || "",
      };
      await updatePartner(currentPartner.id, partnerData);
      toast.success("Cập nhật đối tác thành công");
      await fetchPartners();
      setIsEditModalOpen(false);
      setCurrentPartner(null);
    } catch (error) {
      toast.error("Không thể cập nhật đối tác");
      console.error("Error updating partner:", error.response?.data || error);
    }
  };

  const handleViewDetail = (partner) => {
    setCurrentPartner(partner);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (partner) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa đối tác "${partner.name}"?`)
    ) {
      try {
        await partnerApi.deletePartner(partner.id);
        toast.success("Xóa đối tác thành công");
        fetchPartners();
      } catch (error) {
        toast.error("Không thể xóa đối tác");
        console.error("Error deleting partner:", error);
      }
    }
  };

  const filteredData = filterPartners();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getPartnerTypeName = (partnerTypeId) => {
    const type = partnerTypes.find((type) => type.id === partnerTypeId);
    return type ? type.name : "Unknown";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <TogglePartnerModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setCurrentPartner(null);
        }}
        onSubmit={isAddModalOpen ? handleAddNew : handleEditSubmit}
        mode={isAddModalOpen ? "add" : "edit"}
        partner={currentPartner}
      />
      {currentPartner && (
        <PartnerDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setCurrentPartner(null);
          }}
          partner={currentPartner}
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách đối tác
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  value={searchName}
                  onChange={handleSearchNameChange}
                  className="w-64 px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FaSearch className="h-4 w-4" />
                </button>
              </div>
              <div className="relative">
                <select
                  value={searchType}
                  onChange={handleSearchTypeChange}
                  className="w-48 px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Lọc theo loại đối tác</option>
                  {partnerTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Thêm mới
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="py-3 px-4 font-semibold text-sm text-left min-w-[100px]"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 font-semibold text-sm text-center min-w-[120px]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((partner) => (
                <tr
                  key={partner.id}
                  className="border-b border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="py-3 px-4 text-sm text-gray-600 text-left truncate max-w-[200px]"
                    >
                      {col.key === "debt" ? (
                        <span>{formatCurrency(partner[col.key])}</span>
                      ) : col.key === "partnerTypeId" ? (
                        <span>{getPartnerTypeName(partner[col.key])}</span>
                      ) : (
                        <span title={partner[col.key] || "-"}>
                          {partner[col.key] || "-"}
                        </span>
                      )}
                    </td>
                  ))}

                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleViewDetail(partner)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Xem chi tiết"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(partner)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Sửa"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      {/* <button
                        onClick={() => handleDelete(partner)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        disabled
                        title="Xóa"
                      >
                        <FaRegTrashAlt className="h-5 w-5" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} của{" "}
            {filteredData.length} bản ghi
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxPagesToShow={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ListPartner;
