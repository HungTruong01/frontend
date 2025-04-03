import React from "react";
import { FaTimes } from "react-icons/fa";

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

  // Function to render HTML content safely
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent || "" };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Chi tiết bài đăng
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Post ID */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã bài đăng
            </label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
              #{post.id}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
              {post.title || "-"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            {/* <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh/Video
                </label>
                {post.thumbnail ? (
                  <div className="mt-2 border-2 border-gray-200 rounded-lg p-2">
                    <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-500">
                    Không có hình ảnh
                  </div>
                )}
              </div>
            </div> */}

            {/* Right column - Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung
              </label>
              <div
                className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 h-[300px] overflow-y-auto"
                dangerouslySetInnerHTML={createMarkup(post.content)}
              >
                {/* Content rendered via dangerouslySetInnerHTML */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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
