import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const AddModal = ({ isOpen, onClose, onSubmit, fields, title }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialData = fields.reduce((acc, field) => {
        acc[field.key] = field.defaultValue || "";
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [isOpen, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra tất cả các trường bắt buộc
    for (const field of fields) {
      if (
        field.required &&
        (!formData[field.key] || !formData[field.key].toString().trim())
      ) {
        toast.error(`Trường ${field.label} không được để trống`);
        return;
      }
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {fields.map((field) => (
            <div key={field.key} className="mb-4">
              <label
                htmlFor={field.key}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required={field.required}
                >
                  <option value="">{`Chọn ${field.label}`}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder || `Nhập ${field.label}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required={field.required}
                  min={field.type === "number" ? field.min : undefined}
                  max={field.type === "number" ? field.max : undefined}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Thêm mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
