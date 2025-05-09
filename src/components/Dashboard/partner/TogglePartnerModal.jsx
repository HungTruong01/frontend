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
    organization: "",
    taxCode: "",
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
        organization: partner?.organization,
        taxCode: partner?.taxCode,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        type: "Khách hàng",
        debt: "",
        organization: "",
        taxCode: "",
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
          organization: "",
          taxCode: "",
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
          organization: formData.organization,
          taxCode: formData.taxCode,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === "add" ? "Thêm đối tác mới" : "Chỉnh sửa đối tác"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đối tác
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã số thuế
            </label>
            <input
              type="text"
              name="taxCode"
              value={formData.taxCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đơn vị
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại đối tác
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Khách hàng">Khách hàng</option>
              <option value="Nhà cung cấp">Nhà cung cấp</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-end space-x-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
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
