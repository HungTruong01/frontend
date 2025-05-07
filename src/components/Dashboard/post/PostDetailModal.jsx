import React, { useState, useEffect } from "react";
import { getPostById } from "@/api/postApi";
import imagenotfound from "@/assets/imagenotfound.jpg";

const PostDetailModal = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && postId) {
      setLoading(true);
      setError(null);
      fetchPostDetail(postId);
    }
    return () => {
      setPost(null);
      setImageError(false);
      setLoading(true);
      setError(null);
    };
  }, [isOpen, postId]);

  const fetchPostDetail = async (id) => {
    try {
      const postData = await getPostById(id);

      if (!postData) {
        throw new Error("Không nhận được dữ liệu bài đăng");
      }

      setPost(postData);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching post detail:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Không thể tải thông tin bài đăng"
      );
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent || "" };
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getThumbnailUrl = () => {
    if (!post?.thumbnail || imageError) {
      return imagenotfound;
    }
    return post.thumbnail;
  };

  const toggleFullscreen = () => {
    setFullscreenImage(!fullscreenImage);
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/90 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-700 font-medium">
              Đang tải thông tin bài đăng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/90 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-700 mb-4">
              {error || "Không thể tải thông tin bài đăng"}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 bg-black/50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden border border-gray-200 animate-fadeIn">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết bài đăng
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {post.title || "-"}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1"
                    />
                  </svg>
                  <span>ID: #{post.id}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Đăng: {formatDate(post.postedAt)}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Cập nhật: {formatDate(post.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="font-medium text-gray-700">Hình ảnh</h3>
                </div>
                <div className="bg-white border border-gray-200 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div
                    className="relative w-full h-[320px] rounded-md overflow-hidden cursor-pointer"
                    onClick={toggleFullscreen}
                  >
                    <img
                      src={getThumbnailUrl()}
                      alt={post.title || "Thumbnail"}
                      className={`w-full h-full ${
                        imageError ? "object-contain" : "object-cover"
                      }`}
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 flex items-end justify-center pb-4 transition-opacity duration-300">
                      <span className="text-white bg-black/60 px-3 py-1 rounded-md text-sm">
                        Phóng to
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="font-medium text-gray-700">Nội dung</h3>
                </div>
                <div
                  className="prose prose-blue max-w-none bg-white border border-gray-200 p-5 rounded-lg shadow-inner min-h-[320px] overflow-y-auto"
                  dangerouslySetInnerHTML={createMarkup(post.content)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer with Light Background */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-60 cursor-zoom-out animate-fadeIn"
          onClick={toggleFullscreen}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={getThumbnailUrl()}
              alt={post.title || "Full image"}
              className="max-w-full max-h-[90vh] object-contain border border-gray-100 shadow-xl rounded-lg"
              onError={handleImageError}
            />
            <button
              className="absolute top-4 right-4 text-gray-700 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetailModal;
