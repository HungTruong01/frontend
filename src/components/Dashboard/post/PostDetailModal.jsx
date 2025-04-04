import React from "react";
import { FaTimes } from "react-icons/fa";
import service2 from "@/assets/service2.jpg";
const PostDetailModal = ({ isOpen, onClose, post }) => {
  if (!isOpen || !post) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent || "" };
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/280x280.png?text=Không+tìm+thấy+hình+ảnh";
    e.target.classList.add("object-contain");
    e.target.classList.remove("object-cover");
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-200/50 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
              Chi tiết bài đăng
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-50">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mã bài đăng
            </label>
            <div className="px-4 py-2 bg-gray-100 rounded-xl text-black font-mono text-sm shadow-inner">
              #{post.id}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề
            </label>
            <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-900 text-base shadow-inner">
              {post.title || "-"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ảnh/Video
                </label>
                <div className="mt-2 border-2 border-indigo-100 rounded-2xl p-3 shadow-lg bg-white">
                  <div className="relative w-full h-[280px] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={service2}
                      alt="Ảnh dịch vụ"
                      className="w-full h-full object-contain"
                      onError={handleImageError}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nội dung
              </label>
              <div
                className="px-5 py-4 bg-gray-100 rounded-xl text-gray-900 h-[280px] overflow-y-auto shadow-inner scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-indigo-50"
                dangerouslySetInnerHTML={createMarkup(post.content)}
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-5 bg-gradient-to-br from-indigo-50 to-white rounded-b-3xl border-t border-gray-200/50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-md"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
