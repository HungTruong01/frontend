import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditModal = ({
  isOpen,
  onClose,
  fields,
  initialData,
  title,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({ ...initialData });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    for (const field of fields) {
      const key = field.id || field.key;
      // Bỏ qua trường id
      if (key === "id") continue;

      // Kiểm tra trường bắt buộc
      if (field.required && (!formData[key] || !formData[key].trim())) {
        toast.error(`Trường ${field.label} không được để trống`);
        return;
      }
    }

    // Gửi dữ liệu nếu hợp lệ
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.id || field.key} className="mb-4">
              <label
                htmlFor={field.id || field.key}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.id || field.key}
                  name={field.id || field.key}
                  value={formData[field.id || field.key] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.id === "id" || field.key === "id" ? (
                <input
                  type="text"
                  id={field.id || field.key}
                  name={field.id || field.key}
                  value={formData[field.id || field.key] || ""}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  id={field.id || field.key}
                  name={field.id || field.key}
                  value={formData[field.id || field.key] || ""}
                  onChange={handleChange}
                  disabled={field.disabled}
                  placeholder={field.placeholder || `Nhập ${field.label}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
