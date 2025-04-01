import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const EditPostModal = ({ isOpen, onClose, post, onSubmit }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    console.log("Post data received in EditPostModal:", post);

    if (post) {
      setFormData({
        id: post.id,
        title: post.title || "",
        content: post.content || "",
        thumbnail: post.thumbnail || "",
        posted_at: post.posted_at || "",
        updated_at: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      });
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Sửa bài đăng</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Nhập tiêu đề bài đăng"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh/Video
                </label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail || ""}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đăng bài
                </label>
                <input
                  type="text"
                  name="posted_at"
                  value={formData.posted_at || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="DD-MM-YYYY (ví dụ: 25-03-2025)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày cập nhật
                </label>
                <input
                  type="text"
                  name="updated_at"
                  value={formData.updated_at || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="DD-MM-YYYY (ví dụ: 25-03-2025)"
                  required
                />
              </div>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <textarea
                  name="content"
                  value={formData.content || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 h-[250px] resize-none"
                  placeholder="Nhập nội dung bài đăng"
                  required
                />
              </div>
            </div>
          </div>
        </form>

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
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
