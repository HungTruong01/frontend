import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import AddPartnerModal from "@/components/Dashboard/AddPartnerModal";

const AddOrder = () => {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([
    { id: 1, product: "", quantity: 1, price: 0 },
  ]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      { id: orderItems.length + 1, product: "", quantity: 1, price: 0 },
    ]);
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đơn hàng:", orderItems);
    navigate("/dashboard/business/order-management");
  };

  const handleAddPartner = (partnerData) => {
    console.log("Đối tác mới:", partnerData);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard/business/order-management")}
            className="flex items-center text-gray-600 border border-gray-300 rounded-md p-1 hover:text-gray-800 mr-2"
          >
            <FaArrowLeft className="" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Thêm đơn hàng mới
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã đơn hàng
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mã đơn hàng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày tạo đơn
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đối tác
              </label>
              <div className="flex flex-col space-y-2">
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tìm kiếm đối tác"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                  >
                    <FaSearch />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  <FaPlus className="mr-1" />
                  Thêm mới đối tác
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại đơn hàng
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="import">Đơn hàng nhập</option>
                <option value="export">Đơn hàng xuất</option>
              </select>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách sản phẩm
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Thêm sản phẩm
              </button>
            </div>

            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tìm kiếm sản phẩm"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Số lượng"
                    />
                  </div>
                  <div className="w-40">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Đơn giá"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền và nút lưu */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-lg font-semibold">
              Tổng tiền: <span className="text-blue-600">0 VNĐ</span>
            </div>
            <div className="space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/business/order-management")}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Lưu đơn hàng
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal thêm đối tác */}
      <AddPartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        onSubmit={handleAddPartner}
      />
    </div>
  );
};

export default AddOrder;
