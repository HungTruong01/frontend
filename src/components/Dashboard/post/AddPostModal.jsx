import React, { useState, useEffect, useRef, memo } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { uploadImageToCloudinary } from "@/utils/uploadFile";
import { createPost } from "@/api/postApi";

// Component Quill editor
const QuillWrapper = memo(({ onChange, initialContent }) => {
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
      "list",
      "bullet",
      "indent",
      "link",
      "image",
    ],
  });

  useEffect(() => {
    if (quill) {
      if (quill.root.innerHTML !== initialContent) {
        quill.root.innerHTML = initialContent || "";
      }

      const handleTextChange = () => {
        const content = quill.root.innerHTML;
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
        <div className="h-[400px] overflow-y-auto">
          <div ref={quillRef} className="!h-full" />
        </div>
      </div>
    </div>
  );
});

const AddPostModal = ({ isOpen, onClose, onSubmit }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail: "",
    thumbnailFile: null,
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // FIXED: was useState(false) only
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        content: "",
        thumbnail: "",
        thumbnailFile: null,
      });
      setFilePreview(null);
      setErrors({
        title: "",
        content: "",
      });
      setIsSubmitting(false);
      setUploadError("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileUpload = (e) => {
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

      setUploadError("");
      setFormData((prev) => ({
        ...prev,
        thumbnailFile: file,
      }));
      setFilePreview(URL.createObjectURL(file));
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

    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      newErrors.content = "Vui lòng nhập nội dung";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('=== Start Submit ===');
    console.log('isSubmitting before:', isSubmitting);
    
    if (!validateForm() || isSubmitting) {
      console.log('Validation failed or already submitting - Return early');
      return;
    }

    setIsSubmitting(true);
    console.log('isSubmitting after set:', true);

    try {
      let thumbnailUrl = formData.thumbnail;

      if (formData.thumbnailFile) {
        console.log('Starting file upload');
        try {
          setIsUploading(true);
          const uploadResult = await uploadImageToCloudinary(formData.thumbnailFile);
          console.log('Upload result:', uploadResult);
          
          if (!uploadResult || !uploadResult.secure_url) {
            throw new Error("Không nhận được URL từ Cloudinary");
          }
          thumbnailUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setUploadError("Không thể tải ảnh lên, vui lòng thử lại");
          setIsSubmitting(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const postData = {
        title: formData.title.trim(),
        content: formData.content,
        thumbnail: thumbnailUrl,
      };
      console.log('Preparing to send post data:', postData);

      const response = await createPost(postData);
      console.log('Create post response:', response);

      if (response) {
        console.log('Post created successfully, calling onSubmit');
        if (onSubmit) {
          onSubmit(response);
        }

        setFormData({
          title: "",
          content: "",
          thumbnail: "",
          thumbnailFile: null,
        });
        setFilePreview(null);
        setErrors({});
        onClose();
      }
    } catch (error) {
      console.error("Error full details:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.response?.data?.message || "Không thể tạo bài đăng mới",
      }));
    } finally {
      console.log('=== End Submit ===');
      setIsSubmitting(false);
    }
  };

  const renderSubmitError = () => {
    if (errors.submit) {
      return (
        <div className="px-6 pb-4">
          <p className="text-red-500 text-sm">{errors.submit}</p>
        </div>
      );
    }
    return null;
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Thêm bài đăng mới</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form className="p-6 flex-1 overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
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
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Thumbnail</label>
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
              {uploadError && <p className="mt-1 text-sm text-red-500">{uploadError}</p>}
              {filePreview ? (
                <div className="mt-2 border-2 border-gray-200 rounded-lg p-2">
                  <img src={filePreview} alt="Thumbnail preview" className="w-full h-[200px] object-cover rounded-lg" />
                </div>
              ) : (
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
              <QuillWrapper onChange={handleQuillChange} initialContent={formData.content} />
            </div>
            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
          </div>
        </form>

        {renderSubmitError()}

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
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting && <FaSpinner className="animate-spin" />}
              <span>{isSubmitting ? "Đang xử lý..." : "Thêm mới"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostModal;
