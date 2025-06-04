import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const TogglePartnerModal = ({
  isOpen,
  onClose,
  onSubmit,
  partner = null,
  mode = "add",
  partnerTypes = [],
}) => {
  const initData = {
    name: "",
    phone: "",
    address: "",
    email: "",
    type: "",
    organization: "",
    taxCode: "",
  };
  const [formData, setFormData] = useState(initData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && partner) {
      setFormData({
        name: partner?.name || "",
        phone: partner?.phone || "",
        email: partner?.email || "",
        address: partner?.address || "",
        type: partner?.partnerTypeId || "",
        organization: partner?.organization || "",
        taxCode: partner?.taxCode || "",
      });
    } else if (mode === "add" && partnerTypes.length > 0) {
      setFormData({
        ...initData,
        type: partnerTypes[0].id,
      });
    } else {
      setFormData(initData);
    }
    setErrors({});
  }, [isOpen, mode, partner, partnerTypes.length]);

  const normalizeString = (str) => {
    return str.trim().replace(/\s+/g, " ");
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Tên đối tác không được để trống";
    }

    if (!data.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d+$/.test(data.phone)) {
      newErrors.phone = "Số điện thoại chỉ được chứa số";
    } else if (data.phone.length !== 10) {
      newErrors.phone = "Số điện thoại phải có đúng 10 chữ số";
    }

    if (data.taxCode && !/^\d+$/.test(data.taxCode)) {
      newErrors.taxCode = "Mã số thuế chỉ được chứa số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone" || name === "taxCode") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedData = {
      ...formData,
      name: normalizeString(formData.name),
      address: normalizeString(formData.address),
      organization: normalizeString(formData.organization),
    };

    if (!validateForm(normalizedData)) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit = {
        ...normalizedData,
        phone: formData.phone,
        email: formData.email,
        type: parseInt(formData.type),
        taxCode: formData.taxCode,
      };
      if (mode === "edit") dataToSubmit.id = partner.id;
      await onSubmit(dataToSubmit);
      setFormData(initData);
    } catch (error) {
      toast.error("Lỗi khi xử lý dữ liệu");
      console.error(error);
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
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
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
              maxLength={10}
              className={`w-full px-3 py-2 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
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
              className={`w-full px-3 py-2 border ${
                errors.taxCode ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.taxCode && (
              <p className="text-red-500 text-xs mt-1">{errors.taxCode}</p>
            )}
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
              className={`w-full px-3 py-2 border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
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
              {partnerTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
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
