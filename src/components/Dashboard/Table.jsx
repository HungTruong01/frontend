import React, { useState, useEffect } from "react";
import { GoPlus } from "react-icons/go";
import { FaSearch, FaEdit } from "react-icons/fa";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { Pagination } from "@/utils/pagination";

const Table = ({
  title,
  subtitle,
  columns,
  data,
  addFields,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [itemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const displayColumns = columns || [];

  const handleEditClick = (item) => {
    setCurrentEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && itemToDelete) {
      onDelete(itemToDelete);
      setFilteredData((prev) =>
        prev.filter((item) => item.id !== itemToDelete.id)
      );
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        Object.keys(item).some((key) =>
          String(item[key]).toLowerCase().includes(term)
        )
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {addFields && (
        <AddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          fields={addFields}
          title={`Thêm mới ${subtitle}`}
          onSubmit={onAdd}
        />
      )}

      {currentEditItem && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentEditItem(null);
          }}
          fields={columns.map((col) => ({
            id: col.key,
            key: col.key,
            label: col.label,
            required: col.required || false,
            type: col.type || "text",
          }))}
          initialData={currentEditItem}
          title={`Chỉnh sửa ${subtitle}`}
          onSubmit={(editedData) => {
            if (onEdit) {
              onEdit(editedData);
            }
            setIsEditModalOpen(false);
          }}
        />
      )}

      {itemToDelete && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          itemToDelete={itemToDelete}
        />
      )}

      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
            {addFields && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
              >
                <GoPlus className="h-5 w-5 mr-2" />
                Thêm mới
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {displayColumns.map((col, index) => (
                  <th
                    key={col.key}
                    className={`py-3 px-4 font-semibold text-left ${
                      displayColumns.length <= 3
                        ? index === 0
                          ? "w-1/4"
                          : "w-1/2"
                        : ""
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
                <th
                  className={`py-3 px-4 font-semibold text-center ${
                    displayColumns.length <= 3 ? "w-1/4" : ""
                  }`}
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    {displayColumns.map((col, colIndex) => (
                      <td
                        key={`${row.id}-${col.key}`}
                        className={`py-3 px-4 text-sm ${
                          displayColumns.length <= 3 && colIndex === 1
                            ? "w-1/2"
                            : ""
                        }`}
                      >
                        {row[col.key]}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleEditClick(row)}
                          className={
                            "text-blue-500 hover:text-blue-700 transition-colors"
                          }
                          title="Chỉnh sửa"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={displayColumns.length + 1}
                    className="py-6 text-center text-gray-500"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <p className="text-sm text-gray-600">
            Hiển thị{" "}
            {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
            đến {Math.min(currentPage * itemsPerPage, filteredData.length)} của{" "}
            {filteredData.length} bản ghi
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
