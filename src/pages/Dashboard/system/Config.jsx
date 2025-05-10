import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaEdit } from "react-icons/fa";
import { getAllConfigs, updateConfig, getConfig } from "@/api/configApi";
import { toast } from "react-toastify";
import DetailModal from "@/components/Dashboard/DetailModal";
import EditConfigModal from "./EditConfigModal";  // Thay đổi import

const Config = () => {
  const [configs, setConfigs] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleView = async (row) => {
    try {
      const data = await getConfig(row.field);
      setIsEditModalOpen(false);   // Đóng edit trước
      setCurrentItem(data);        // Set data sau
      setIsDetailModalOpen(true);  // Mở detail modal cuối cùng
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết cấu hình:", error);
      toast.error("Không thể lấy chi tiết cấu hình");
    }
  };

  const handleEdit = async (row) => {
    try {
      const data = await getConfig(row.field);
      setIsDetailModalOpen(false); // Đóng detail trước
      setCurrentItem(data);        // Set data sau
      setIsEditModalOpen(true);    // Mở edit modal cuối cùng
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết cấu hình:", error);
      toast.error("Không thể lấy chi tiết cấu hình");
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (formData) => {
  try {
    await updateConfig(formData.field, { value: formData.value.trim() });

    // ✅ Đảm bảo reload lại dữ liệu mới từ server
    await fetchConfigs();

    setIsEditModalOpen(false);
    toast.success("Cập nhật cấu hình thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật cấu hình:", error);
    toast.error("Không thể cập nhật cấu hình");
  }
};

  const displayColumns = [
    { key: "index", label: "STT" },
    { key: "field", label: "Tên", width: "150px" },
    { key: "value", label: "Nội dung", width: "800px" },
    { key: "action", label: "Hành động"}
  ];

  const fetchConfigs = async () => {
  try {
    const response = await getAllConfigs(0, 100, "field", "asc");
    const configs = response.data.content.map(item => ({
      field: item.field, // field sẽ được dùng làm key
      value: item.value
    }));

    setConfigs(configs);
    setFilteredData(configs);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cấu hình:", error);
    toast.error("Không thể tải danh sách cấu hình");
  }
};

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchValue(searchText);
    
    const filtered = configs.filter((item) => 
      item.field.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm tạo danh sách các nút trang hiển thị
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
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cấu hình nội dung chung</h1>
          <div className="relative w-64 ml-auto">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaSearch className="h-4 w-4" />
            </div>
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
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.field}  // Thay đổi từ row.id thành row.field
                    className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    {displayColumns.map((col) => (
                      <td
                        key={col.key}
                        style={{ 
                          maxWidth: col.width,
                          minWidth: col.width
                        }}
                        className={`py-3 px-4 text-sm text-gray-600 text-left ${
                          col.key === "value" ? "truncate" : ""
                        }`}
                      >
                        {col.key === "action" ? (
                          <div className="flex space-x-3 text-center">
                            <button
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              onClick={() => handleView(row)}
                              title="Xem chi tiết"
                            >
                              <FaEye className="h-5 w-5" />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                              onClick={() => handleEdit(row)}
                              title="Chỉnh sửa"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                          </div>
                        ) : col.key === "index" ? (
                          (currentPage - 1) * itemsPerPage + index + 1
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={displayColumns.length}
                    className="py-8 text-center text-gray-500"
                  >
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
            {Math.min(currentPage * itemsPerPage, filteredData.length)} của{" "}
            {filteredData.length} bản ghi
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
      
      <DetailModal
        isOpen={isDetailModalOpen}
        currentItem={currentItem}
        formattedColumns={[
          { key: "field", label: "Tên" },
          { key: "value", label: "Nội dung" }
        ]}
        handleCloseDetailModal={handleCloseDetailModal}
      />

      <EditConfigModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmit}
        currentItem={currentItem}
      />
    </div>
  );
};

export default Config;
