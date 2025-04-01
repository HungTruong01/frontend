import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useQuill } from "react-quilljs";

import "quill/dist/quill.snow.css";

const AddPostModal = ({ isOpen, onClose, onSubmit }) => {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["clean"],
      ],
    },
    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
    ],
  });

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail: "",
    posted_at: new Date().toLocaleDateString("en-GB").split("/").join("-"),
    updated_at: new Date().toLocaleDateString("en-GB").split("/").join("-"),
  });

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setFormData((prev) => ({
          ...prev,
          content: quill.root.innerHTML, // Lấy nội dung đã nhập vào
        }));
      });
    }
  }, [quill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Thêm bài đăng mới
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Cột trái */}
            <div className="space-y-3">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Nhập tiêu đề bài đăng"
                  required
                />
              </div>

              {/* Ảnh/Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh/Video
                </label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Nhập URL ảnh hoặc video"
                  required
                />
                {formData.thumbnail && (
                  <div className="mt-1">
                    <div className="relative w-full h-[150px] rounded-lg overflow-hidden">
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Ngày đăng bài */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đăng bài
                </label>
                <input
                  type="text"
                  name="posted_at"
                  value={formData.posted_at}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="DD-MM-YYYY (ví dụ: 25-03-2025)"
                  required
                />
              </div>

              {/* Ngày cập nhật */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày cập nhật
                </label>
                <input
                  type="text"
                  name="updated_at"
                  value={formData.updated_at}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="DD-MM-YYYY (ví dụ: 25-03-2025)"
                  required
                />
              </div>
            </div>

            {/* Cột phải */}
            <div>
              {/* Nội dung */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <div className="h-[250px] border-2 border-gray-300 rounded-lg overflow-hidden">
                  <div ref={quillRef} className="h-[200px]" />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostModal;
