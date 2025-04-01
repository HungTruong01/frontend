import React from "react";
import { FaTimes } from "react-icons/fa";

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Chi tiết sản phẩm
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Mã sản phẩm: {product.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors duration-200 focus:outline-none p-2 hover:bg-white/10 rounded-full"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên sản phẩm
              </label>
              <p className="text-gray-800 font-medium">{product.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Mô tả
              </label>
              <p className="text-gray-800 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Giá tiền
                </label>
                <p className="text-gray-800 font-medium text-blue-600">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tồn kho
                </label>
                <p className="text-gray-800 font-medium">{product.stock}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Loại sản phẩm
                </label>
                <p className="text-gray-800 font-medium">{product.type}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Đơn vị tính
                </label>
                <p className="text-gray-800 font-medium">{product.unit}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Trạng thái
              </label>
              <p
                className={`font-medium ${
                  product.status === "Còn hàng"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.status}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
