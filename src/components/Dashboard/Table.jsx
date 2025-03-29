import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { FaSearch, FaRegEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import AddModal from "./AddModal";
import EditModal from "./EditModal";

const Table = ({
  title,
  columns,
  visibleColumns,
  data,
  addFields,
  onView,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  const displayColumns = visibleColumns
    ? columns.filter((col) => visibleColumns.includes(col.key))
    : columns;

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      columns.some((col) => {
        const value = item[col.key]?.toString().toLowerCase() || "";
        return value.includes(searchValue.toLowerCase());
      })
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleAddNew = (newItem) => {
    if (onAddNew) {
      onAddNew(newItem);
    }
    setIsAddModalOpen(false);
  };

  const handleEditClick = (item) => {
    setCurrentEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedItem) => {
    if (onEdit) {
      onEdit(updatedItem);
    }

    if (!onEdit) {
      const updatedData = filteredData.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      setFilteredData(updatedData);
    }

    setIsEditModalOpen(false);
    setCurrentEditItem(null);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {addFields && (
        <AddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddNew}
          fields={addFields}
          title={`Thêm mới ${title}`}
        />
      )}

      {currentEditItem && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentEditItem(null);
          }}
          onSubmit={handleEditSubmit}
          fields={columns.map((col) => ({
            id: col.key,
            label: col.label,
            type: isNumeric(currentEditItem[col.key]) ? "number" : "text",
          }))}
          initialData={currentEditItem}
          title={`Chỉnh sửa ${title}`}
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow w-64">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <GoPlus className="h-5 w-5 mr-2" />
              Thêm mới
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                {displayColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3 px-4 font-semibold whitespace-nowrap text-center`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 font-semibold text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {displayColumns.map((col) => (
                    <td
                      key={col.key}
                      className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center"
                    >
                      {row[col.key]}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => onView && onView(row)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Xem chi tiết"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(row)}
                        className="text-green-500 hover:text-green-700 transition-colors"
                        title="Sửa"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(row)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Xóa"
                      >
                        <FaRegTrashAlt className="h-5 w-5" />
                      </button>
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
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Trước
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`
                    w-8 h-8 rounded-md text-sm 
                    ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                    transition-colors
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
