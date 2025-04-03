import React from "react";

const FormEditAccount = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Chỉnh sửa tài khoản
        </h2>
        <form>
          {/* Mã nguồn dùng */}
          <div className="mb-4">
            <label
              htmlFor="maNguonDung"
              className="block text-sm font-medium text-gray-700"
            >
              Mã người dùng
            </label>
            <input
              type="text"
              placeholder="001"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Tên đăng nhập */}
          <div className="mb-4">
            <label
              htmlFor="tenDangNhap"
              className="block text-sm font-medium text-gray-700"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Ngày tạo */}

          {/* Vai trò */}
          <div className="mb-6">
            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="Admin">Ban lãnh đạo</option>
              <option value="Nhân viên">Nhân viên kinh doanh</option>
              <option value="Kinh doanh">Nhân viên kế toán</option>
            </select>
          </div>

          {/* Nút Hủy và Lưu */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditAccount;
