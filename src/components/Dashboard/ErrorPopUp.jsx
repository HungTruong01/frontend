import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

const ErrorPopup = ({ onClose, errorMessage }) => {
  const message =
    errorMessage ||
    "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.";

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-[1000] animate-fadeIn"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all animate-slideIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Đăng nhập thất bại
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="mb-4 text-gray-700">{message}</div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Nếu bạn quên mật khẩu, vui lòng sử dụng chức năng "Quên mật
                  khẩu" bên dưới form đăng nhập.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Quên mật khẩu
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
