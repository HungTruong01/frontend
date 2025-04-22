import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const TogglePartnerModal = ({
  isOpen,
  onClose,
  onSubmit,
  partner = null,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    type: "Khách hàng",
    debt: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && partner) {
      setFormData({
        name: partner?.name,
        phone: partner?.phone,
        email: partner?.email,
        address: partner?.address,
        type: partner?.partnerTypeId === 1 ? "Khách hàng" : "Nhà cung cấp",
        debt: partner?.debt,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        type: "Khách hàng",
        debt: "",
      });
    }
  }, [mode, partner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === "add") {
        const submittedData = {
          ...formData,
          debt: formData.debt === "" ? 0 : parseFloat(formData.debt),
        };
        await onSubmit(submittedData);
        setFormData({
          name: "",
          phone: "",
          address: "",
          email: "",
          type: "Khách hàng",
          debt: "",
        });
      } else {
        const updatedData = {
          id: partner.id,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          type: formData.type === "Khách hàng" ? 1 : 2,
          debt: parseFloat(formData.debt) || 0,
        };
        await onSubmit(updatedData);
      }
    } catch (error) {
      toast.error("Lỗi khi xử lý dữ liệu");
      console.log("Submit error: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {mode === "add" ? "Thêm đối tác mới" : "Chỉnh sửa đối tác"}
          </h2>
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
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
            >
              <option value="Khách hàng">Khách hàng</option>
              <option value="Nhà cung cấp">Nhà cung cấp</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang xử lý..." : mode === "add" ? "Lưu" : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TogglePartnerModal;
