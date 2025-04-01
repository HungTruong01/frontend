import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const EditPartnerModal = ({ isOpen, onClose, onSubmit, partner }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    type: "Khách hàng", // Giá trị mặc định
    debt: "",
  });

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name || "",
        phone: partner.phone || "",
        email: partner.email || "",
        address: partner.address || "",
        type: partner.partnerTypeId === 1 ? "Khách hàng" : "Nhà cung cấp",
        debt: partner.debt || 0,
      });
    }
  }, [partner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPartner = {
      id: partner.id,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      email: formData.email, // Sửa lỗi: dùng formData.email thay vì partnerData.email
      type: formData.type === "Khách hàng" ? 1 : 2,
      debt: parseFloat(formData.debt) || 0,
    };
    console.log("Dữ liệu gửi đi từ EditPartnerModal:", updatedPartner);
    onSubmit(updatedPartner);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold mb-6">Chỉnh sửa đối tác</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đối tác
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email" // Thêm name="email" để handleChange hoạt động
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại đối tác
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Khách hàng">Khách hàng</option>
              <option value="Nhà cung cấp">Nhà cung cấp</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Công nợ
            </label>
            <input
              type="number"
              name="debt"
              value={formData.debt}
              step="100000"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPartnerModal;
