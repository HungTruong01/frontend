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
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl transform transition-all animate-slideIn">
        <div className="flex justify-between items-center mb-2">
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

          <div className="flex justify-center space-x-3 mt-4">
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
