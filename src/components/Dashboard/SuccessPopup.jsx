import React from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const SuccessPopup = ({ onClose, successMessage }) => {
  const message =
    successMessage || "Đăng nhập thành công! Chào mừng bạn trở lại.";

  return (
    <motion.div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-[1000]"
      style={{ backdropFilter: "blur(2px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600 flex items-center">
            <FaCheckCircle className="mr-2" />
            Đăng nhập thành công
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

          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Bạn đã đăng nhập thành công. Hãy tiếp tục sử dụng hệ thống!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessPopup;
