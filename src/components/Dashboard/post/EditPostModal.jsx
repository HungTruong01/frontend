import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaIdCard,
  FaImage,
  FaRegFileAlt,
} from "react-icons/fa";
import { getPostById } from "@/api/postApi";
import imagenotfound from "@/assets/imagenotfound.jpg";

const PostDetailModal = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && postId) {
      setLoading(true);
      fetchPostDetail(postId);
    }
    return () => {
      setPost(null);
      setImageError(false);
    };
  }, [isOpen, postId]);

  const fetchPostDetail = async (id) => {
    try {
      const postData = await getPostById(id);
      console.log("Fetched post detail:", postData);
      setPost(postData);
    } catch (error) {
      console.error("Error fetching post detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <p className="text-gray-700">Đang tải thông tin bài đăng...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <p className="text-gray-700">Không thể tải thông tin bài đăng...</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

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
    console.log("Image failed to load, using fallback");
    setImageError(true);
  };

  const getThumbnailUrl = () => {
    if (imageError || !post.thumbnail) {
      return imagenotfound;
    }
    return post.thumbnail;
  };

  const toggleFullscreen = () => {
    setFullscreenImage(!fullscreenImage);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4 md:p-6">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-fadeIn">
          <div className="px-6 md:px-8 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide">
                Chi tiết bài đăng
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {post.title || "-"}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaIdCard className="mr-2" />
                  <span>ID: #{post.id}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>Đăng: {formatDate(post.postedAt)}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>Cập nhật: {formatDate(post.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaImage className="text-blue-500 mr-2" />
                  <h3 className="font-semibold text-gray-700">Hình ảnh</h3>
                </div>
                <div className="bg-gray-50 p-2 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div
                    className="relative w-full h-[320px] md:h-[400px] rounded-xl overflow-hidden cursor-pointer group"
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
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300">
                      <span className="text-white bg-black bg-opacity-60 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Xem đầy đủ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaRegFileAlt className="text-blue-500 mr-2" />
                  <h3 className="font-semibold text-gray-700">Nội dung</h3>
                </div>
                <div
                  className="prose prose-indigo max-w-none bg-gray-50 p-6 rounded-2xl shadow-inner min-h-[320px] md:min-h-[400px] overflow-y-auto custom-scrollbar"
                  dangerouslySetInnerHTML={createMarkup(post.content)}
                />
              </div>
            </div>
          </div>

          <div className="px-6 md:px-8 py-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-white font-medium rounded-xl bg-blue-500"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] cursor-zoom-out animate-fadeIn"
          onClick={toggleFullscreen}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={getThumbnailUrl()}
              alt={post.title || "Full image"}
              className="max-w-full max-h-[90vh] object-contain"
              onError={handleImageError}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
              onClick={toggleFullscreen}
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetailModal;
