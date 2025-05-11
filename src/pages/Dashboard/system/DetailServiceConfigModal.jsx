import React from "react";
import { FaTimes } from "react-icons/fa";

const DetailServiceConfigModal = ({ isOpen, currentItem, handleCloseDetailModal }) => {
  if (!isOpen || !currentItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết dịch vụ
          </h2>
          <button
            onClick={handleCloseDetailModal}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-base text-gray-600">
              Mã:
            </label>
            <p className="col-span-2 text-base font-normal">
              {currentItem.id || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-base text-gray-600">
              Tiêu đề:
            </label>
            <p className="col-span-2 text-base font-normal">
              {currentItem.title || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-base text-gray-600">
              Mô tả:
            </label>
            <p className="col-span-2 text-base font-normal whitespace-pre-wrap max-h-[50vh] overflow-y-auto pr-2 text-justify">
              {currentItem.description || "Không có thông tin"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-base text-gray-600">
              Hình ảnh:
            </label>
            <div className="col-span-2">
              {currentItem.thumbnail ? (
                <img 
                  src={currentItem.thumbnail} 
                  alt="Service thumbnail" 
                  className="w-64 h-64 object-cover rounded-lg"
                />
              ) : (
                <p className="text-base font-normal text-gray-500">
                  Không có hình ảnh
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-3">
          <button
            onClick={handleCloseDetailModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailServiceConfigModal;