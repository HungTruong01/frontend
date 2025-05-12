import React, { useState, useEffect } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const EditServiceConfigModal = ({ isOpen, onClose, onSubmit, currentItem }) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    thumbnail: ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (currentItem) {
      setFormData({
        id: currentItem.id || "",
        title: currentItem.title || "",
        description: currentItem.description || "",
        thumbnail: currentItem.thumbnail || ""
      });
    }
  }, [currentItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Chỉ chấp nhận file ảnh");
        return;
      }
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        thumbnail: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    await onSubmit({ ...formData, file: selectedFile });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Chỉnh sửa dịch vụ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tiêu đề"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <FaUpload className="mr-2" />
                <span>Chọn ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {formData.thumbnail && (
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceConfigModal;