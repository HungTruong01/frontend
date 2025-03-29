import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import tableConfig from "@/configs/tableConfig";
import { GoPlus } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { orderTableData, orderColumns } from "@/data/orderList";
import {
  FaSearch,
  FaRegEdit,
  FaRegTrashAlt,
  FaEye,
  FaTimes,
} from "react-icons/fa";

const ListOrder = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  // Hàm để mở modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Hàm để đóng modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Hàm xử lý khi thêm đơn hàng mới
  const handleAddOrder = (newOrder) => {
    // Xử lý logic thêm đơn hàng mới ở đây
    console.log("Đơn hàng mới:", newOrder);

    // Đóng modal sau khi thêm
    closeAddModal();
  };

  // Hàm xử lý khi click nút thêm mới
  const handleAddClick = () => {
    navigate("/dashboard/add-order");
  };

  // Hàm xử lý nút chỉnh sửa
  const handleEditClick = (row) => {
    console.log("Chỉnh sửa:", row);
    // Thêm logic xử lý chỉnh sửa ở đây
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách đơn hàng
          </h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              <FiUpload className="h-5 w-5 mr-2" />
              Xuất file
            </button>
            <button
              onClick={handleAddClick}
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
                <th className="py-3 px-4 font-semibold text-center">
                  Mã đơn hàng
                </th>
                <th className="py-3 px-4 font-semibold text-center">
                  Ngày tạo đơn
                </th>
                <th className="py-3 px-4 font-semibold text-center">
                  Tổng tiền
                </th>
                <th className="py-3 px-4 font-semibold text-center">Đối tác</th>
                <th className="py-3 px-4 font-semibold text-center">
                  Trạng thái đơn hàng
                </th>
                <th className="py-3 px-4 font-semibold text-center">
                  Loại đơn hàng
                </th>
                <th className="py-3 px-4 font-semibold text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  001
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  25-03-2025
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  1800000
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Nguyễn Văn A
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Hoàn thành
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Đơn hàng nhập
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick({ id: "001" })}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Sửa"
                    >
                      <FaRegEdit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Xóa"
                    >
                      <FaRegTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  002
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  26-03-2025
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  2000000
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Nguyễn Văn B
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Chờ xác nhận
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Đơn hàng xuất
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick({ id: "002" })}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Sửa"
                    >
                      <FaRegEdit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Xóa"
                    >
                      <FaRegTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  003
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  27-03-2025
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  1500000
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Nguyễn Văn C
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Chờ xác nhận
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Đơn hàng nhập
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick({ id: "003" })}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Sửa"
                    >
                      <FaRegEdit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Xóa"
                    >
                      <FaRegTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  004
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  25-03-2025
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  1100000
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Nguyễn Văn D
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Hoàn thành
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  Đơn hàng nhập
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick({ id: "004" })}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Sửa"
                    >
                      <FaRegEdit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Xóa"
                    >
                      <FaRegTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListOrder;
