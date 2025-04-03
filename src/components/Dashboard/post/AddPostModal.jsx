import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
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

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail: "",
    posted_at: new Date().toLocaleDateString("en-GB").split("/").join("-"),
    updated_at: new Date().toLocaleDateString("en-GB").split("/").join("-"),
  });

  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (quill && isOpen) {
      quill.clipboard.dangerouslyPasteHTML(formData.content || "");
    }
  }, [quill, isOpen]);

  useEffect(() => {
    if (!isOpen && quill) {
      quill.setText(""); // Reset khi modal đóng
    }
  }, [isOpen, quill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For image files, create a preview URL
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
          setFormData((prev) => ({ ...prev, thumbnail: e.target.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
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
        <div className="px-6 py-4 border-b border-gray-200">
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

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
          {/* Title input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Nhập tiêu đề bài đăng"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Media section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh/Video
              </label>

              <div className="flex mb-2">
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Nhập URL ảnh hoặc video"
                />
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  className="px-4 py-2 bg-gray-100 border-2 border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center"
                >
                  <FaUpload className="mr-2" /> Import
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Image preview */}
              {(formData.thumbnail || filePreview) && (
                <div className="mt-2 border-2 border-gray-200 rounded-lg p-2">
                  <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                    <img
                      src={filePreview || formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Content editor */}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung
            </label>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden max-h-[1200px]">
              <div
                ref={quillRef}
                className="h-full min-h-[300px] max-h-[500px] overflow-y-auto"
              />
            </div>
          </div>
        </form>

        {/* Footer with buttons */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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
