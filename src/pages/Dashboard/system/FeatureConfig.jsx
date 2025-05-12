import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaEdit, FaRegTrashAlt, FaPlus } from "react-icons/fa";
import { 
  getAllFeatureContents, 
  getFeatureContent, 
  addFeatureContent, 
  updateFeatureContent, 
  deleteFeatureContent } from "@/api/featureContentApi";
import { toast } from "react-toastify";
import AddFeatureConfigModal from "./AddFeatureConfigModal";  
import EditFeatureConfigModal from "./EditFeatureConfigModal";
import DetailFeatureConfigModal from "./DetailFeatureConfigModal";

const FeatureConfig = () => {
  const [services, setServices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleView = async (row) => {
    try {
      const data = await getFeatureContent(row.id);
      setIsEditModalOpen(false);
      setCurrentItem(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đặc sắc:", error);
      toast.error("Không thể lấy chi tiết đặc sắc");
    }
  };

  const handleEdit = async (row) => {
    try {
      const data = await getFeatureContent(row.id);
      setIsDetailModalOpen(false);
      setCurrentItem(data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đặc sắc:", error);
      toast.error("Không thể lấy chi tiết đặc sắc");
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (formData) => {
    try {
      await updateFeatureContent(formData.id, formData);
      await fetchServices();
      setIsEditModalOpen(false);
      toast.success("Cập nhật đặc sắc thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật đặc sắc:", error);
      toast.error("Không thể cập nhật đặc sắc");
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await addFeatureContent(formData);
      await fetchServices();
      setIsAddModalOpen(false);
      toast.success("Thêm mới đặc sắc thành công");
    } catch (error) {
      console.error("Lỗi khi thêm mới đặc sắc:", error);
      toast.error("Không thể thêm mới đặc sắc");
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặc sắc này?')) {
      try {
        await deleteFeatureContent(row.id);
        await fetchServices();
        toast.success("Xóa đặc sắc thành công");
      } catch (error) {
        console.error("Lỗi khi xóa đặc sắc:", error);
        toast.error("Không thể xóa đặc sắc");
      }
    }
  };

  const displayColumns = [
    { key: "id", label: "Mã" },
    { key: "title", label: "Tiêu đề", width: "150px" },
    { key: "description", label: "Mô tả", width: "600px" },
    { key: "icon", label: "Biểu tượng", width: "150px" },
    { key: "action", label: "Hành động", width: "80px" }
  ];

  const fetchServices = async () => {
    try {
      const response = await getAllFeatureContents(currentPage - 1, itemsPerPage, "id", "asc");
      const { content, totalElements, totalPages } = response.data;
      setServices(content);
      setFilteredData(content);
      setTotalElements(totalElements);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đặc sắc:", error);
      toast.error("Không thể tải danh sách đặc sắc");
    }
  };

  useEffect(() => {
    fetchServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchValue(searchText);
    setCurrentPage(1); // Reset về trang 1 khi search
    
    const filtered = services.filter((item) => 
      item.title?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return {
      pages,
      showFirst: startPage > 1,
      showLast: endPage < totalPages,
    };
  };

  const { pages, showFirst, showLast } = getPageNumbers();

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden mt-4">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cấu hình nội dung đặc sắc</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaSearch className="h-4 w-4" />
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="h-4 w-4" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {displayColumns.map((col) => (
                  <th
                    key={col.key}
                    className="py-3 px-4 font-semibold whitespace-nowrap text-left"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    {displayColumns.map((col) => (
                      <td
                        key={col.key}
                        style={{ 
                          maxWidth: col.width,
                          minWidth: col.width
                        }}
                        className="py-3 px-4 text-sm text-gray-600 text-left"
                      >
                        {col.key === "action" ? (
                          <div className="flex space-x-3">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleView(row)}
                              title="Xem chi tiết"
                            >
                              <FaEye className="h-5 w-5" />
                            </button>
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleEdit(row)}
                              title="Chỉnh sửa"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(row)}
                              title="Xóa"
                            >
                              <FaRegTrashAlt className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {row[col.key]}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={displayColumns.length} className="py-8 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, totalElements)} của{" "}
            {totalElements} bản ghi
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Trước
            </button>
            <div className="flex items-center space-x-2">
              {showFirst && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    1
                  </button>
                  {pages[0] > 2 && <span className="text-gray-600">...</span>}
                </>
              )}
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
              {showLast && (
                <>
                  {pages[pages.length - 1] < totalPages - 1 && (
                    <span className="text-gray-600">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
      
      <AddFeatureConfigModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <DetailFeatureConfigModal
        isOpen={isDetailModalOpen}
        currentItem={currentItem}
        formattedColumns={[
          { key: "id", label: "Mã" },
          { key: "title", label: "Tiêu đề" },
          { key: "description", label: "Mô tả" },
          { key: "thumbnail", label: "Hình ảnh" }
        ]}
        handleCloseDetailModal={handleCloseDetailModal}
      />

      <EditFeatureConfigModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmit}
        currentItem={currentItem}
      />
    </div>
  );
};

export default FeatureConfig;
