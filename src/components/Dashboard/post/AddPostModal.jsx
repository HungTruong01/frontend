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
    thumbnailFile: null, // Lưu file ảnh thay vì URL
    posted_at: new Date().toISOString().split("T")[0], // Định dạng yyyy-mm-dd
    updated_at: new Date().toISOString().split("T")[0],
  });

  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (quill && isOpen) {
      quill.clipboard.dangerouslyPasteHTML(formData.content || "");
      quill.on("text-change", () => {
        setFormData((prev) => ({ ...prev, content: quill.root.innerHTML }));
      });
    }
  }, [quill, isOpen]);

  useEffect(() => {
    if (!isOpen && quill) {
      quill.setText(""); // Reset khi modal đóng
      setFormData({
        title: "",
        content: "",
        thumbnailFile: null,
        posted_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
      });
      setFilePreview(null);
    }
  }, [isOpen, quill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      title: formData.title,
      content: formData.content,
      thumbnailFile: formData.thumbnailFile,
      posted_at: formData.posted_at,
      updated_at: formData.updated_at,
    };
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tiêu đề bài đăng"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh/Video
              </label>
              <div className="flex mb-2">
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  className="px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 flex items-center"
                >
                  <FaUpload className="mr-2" /> Chọn file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              {filePreview && (
                <div className="mt-2 border-2 border-gray-200 rounded-lg p-2">
                  <img
                    src={filePreview}
                    alt="Thumbnail preview"
                    className="w-full h-[200px] object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung
            </label>
            <div className="border-2 border-gray-300 rounded-lg max-h-[500px] overflow-y-auto">
              <div ref={quillRef} className="min-h-[300px]" />
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
