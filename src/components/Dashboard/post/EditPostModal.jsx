import React, { useState, useEffect, useRef, memo } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { uploadImageToCloudinary } from "@/utils/uploadFile";
import { toast } from "react-toastify";

// Tách QuillWrapper thành component riêng
const QuillWrapper = memo(({ onChange, initialContent }) => {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    },
    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "indent",
      "link",
    ],
  });

  useEffect(() => {
    if (quill) {
      // Chỉ set content lần đầu khi initialContent thay đổi
      if (quill.root.innerHTML !== initialContent) {
        quill.root.innerHTML = initialContent || "";
      }

      const handleTextChange = () => {
        const content = quill.root.innerHTML;
        // Chỉ trigger onChange khi nội dung thực sự thay đổi
        if (content !== initialContent) {
          onChange(content);
        }
      };

      quill.on("text-change", handleTextChange);
      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, initialContent, onChange]);

  return (
    <div className="border-2 border-gray-300 rounded-lg">
      <div className="min-h-[300px] relative">
        <div className="ql-toolbar ql-snow border-b border-gray-300 sticky top-0 bg-white z-10" />
        <div className="h-[250px] overflow-y-auto">
          <div ref={quillRef} className="!h-full" />
        </div>
      </div>
    </div>
  );
});

const EditPostModal = ({ isOpen, onClose, onSubmit, post }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    posted_at: "",
    thumbnail: "",
    thumbnailFile: null,
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (isOpen && post) {
      setFormData({
        id: post.id || "",
        title: post.title || "",
        content: post.content || "",
        posted_at: post.postedAt || "",
        thumbnail: post.thumbnail || "",
        thumbnailFile: null,
      });
      // Set preview với URL hiện tại
      setFilePreview(post.thumbnail || null);
      setErrors({});
      setUploadError("");
    }
  }, [isOpen, post]);

  // Thêm cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup file preview URL khi component unmount
      if (filePreview && filePreview !== post?.thumbnail) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview, post]);

  // Thêm handler cho Quill
  const handleQuillChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));
    setErrors((prev) => ({
      ...prev,
      content: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Cải thiện handleFileUpload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setUploadError("Chỉ chấp nhận định dạng ảnh JPG, PNG hoặc WEBP");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Kích thước file không được vượt quá 5MB");
        return;
      }

      try {
        // Xóa preview URL cũ nếu có
        if (filePreview && filePreview !== post?.thumbnail) {
          URL.revokeObjectURL(filePreview);
        }

        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
        setFormData((prev) => ({
          ...prev,
          thumbnailFile: file,
          thumbnail: "", // Reset thumbnail URL khi có file mới
        }));
        setUploadError("");
      } catch (error) {
        console.error("File handling error:", error);
        setUploadError("Không thể xử lý file");
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }

    const contentWithoutTags = formData.content
      .replace(/<[^>]*>/g, "") // Loại bỏ tất cả thẻ HTML
      .trim();

    if (!contentWithoutTags || formData.content === "<p><br></p>") {
      newErrors.content = "Vui lòng nhập nội dung";
    }

    // Kiểm tra kích thước nội dung
    if (formData.content.length > 100000) {
      // Giới hạn ví dụ 100KB
      newErrors.content = "Nội dung quá dài, vui lòng giảm kích thước";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Cải thiện handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      let thumbnailUrl = formData.thumbnail;

      if (formData.thumbnailFile) {
        setIsUploading(true);
        const result = await uploadImageToCloudinary(formData.thumbnailFile);
        if (!result?.secure_url) {
          throw new Error("Không nhận được URL từ server");
        }
        thumbnailUrl = result.secure_url;
        setIsUploading(false);
      }

      const updatedPost = {
        id: formData.id, // Make sure ID is included
        title: formData.title.trim(),
        content: formData.content,
        thumbnail: thumbnailUrl,
        postedAt: formData.posted_at, // Include original posted date
        thumbnailFile: formData.thumbnailFile // Include if there's a new file
      };

      await onSubmit(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 403
          ? "Bạn không có quyền thực hiện thao tác này"
          : "Không thể cập nhật bài đăng");

      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
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

        {/* Modify the form to handle submission */}
        <form
          onSubmit={handleSubmit}
          className="p-6 flex-1 overflow-y-auto"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border-2 ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Nhập tiêu đề bài đăng"
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh Thumbnail
              </label>
              <div className="flex mb-2">
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  className="px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 flex items-center"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <FaSpinner className="mr-2 animate-spin" />
                  ) : (
                    <FaUpload className="mr-2" />
                  )}
                  {isUploading ? "Đang tải lên..." : "Chọn file"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              {uploadError && (
                <p className="mt-1 text-sm text-red-500">{uploadError}</p>
              )}
              {filePreview && (
                <div className="mt-2 border-2 border-gray-200 rounded-lg p-2">
                  <img
                    src={filePreview}
                    alt="Thumbnail preview"
                    className="w-full h-[200px] object-cover rounded-lg"
                  />
                </div>
              )}
              {!filePreview && (
                <div className="mt-2 border-2 border-gray-200 rounded-lg p-2 h-[200px] flex items-center justify-center text-gray-400">
                  Chưa có hình ảnh thumbnail
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <div className={errors.content ? "border-red-500" : ""}>
              <QuillWrapper
                onChange={handleQuillChange}
                initialContent={formData.content}
              />
            </div>
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Move the buttons inside the form */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting || isUploading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
