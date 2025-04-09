import React, { useEffect, useState, useRef } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import imagenotfound from "@/assets/imagenotfound.jpg";

const EditPostModal = ({ isOpen, onClose, post, onSubmit }) => {
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
  const [formData, setFormData] = useState({});
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (post) {
      setFormData({
        id: post.id,
        title: post.title || "",
        content: post.content || "",
        thumbnail: post.thumbnail || "",
        posted_at: post.posted_at || post.postedAt || "",
        updated_at: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      });
      setFilePreview(post.thumbnail || null);
    }
  }, [post]);

  useEffect(() => {
    if (quill && post) {
      quill.root.innerHTML = post.content || "";
      quill.on("text-change", () => {
        setFormData((prev) => ({
          ...prev,
          content: quill.root.innerHTML,
        }));
      });
    }
  }, [quill, post]);

  if (!isOpen || !post) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "thumbnail" && !e.target.files) {
      setFilePreview(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
        setFormData((prev) => ({ ...prev, thumbnail: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      thumbnailFile: fileInputRef.current?.files[0] || null,
    };
    onSubmit(submitData);
  };

  const handleImageError = (e) => {
    e.target.src = imagenotfound;
    e.target.classList.add("object-contain");
    e.target.classList.remove("object-cover");
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-6 ">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-200/50 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
              Sửa bài đăng
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 "
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-50"
        >
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mã bài đăng
            </label>
            <div className="px-4 py-2 bg-gray-100 rounded-xl text-black font-mono text-sm shadow-inner">
              #{formData.id}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 text-base shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-300"
              placeholder="Nhập tiêu đề bài đăng"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ảnh/Video
                </label>
                <div className="flex mb-4">
                  <input
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail || ""}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-l-xl text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-300"
                    placeholder="Nhập URL ảnh hoặc video"
                  />
                  <button
                    type="button"
                    onClick={triggerFileUpload}
                    className="px-4 py-3 bg-indigo-100 rounded-r-xl hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-300 flex items-center"
                  >
                    <FaUpload className="mr-2 h-5 w-5" /> Tải lên
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <div className="relative w-full h-[280px] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <span className="text-gray-500">Chưa có ảnh được chọn</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nội dung
              </label>
              <div className="border-2 border-indigo-100 rounded-xl overflow-hidden shadow-inner bg-gray-100">
                <div
                  ref={quillRef}
                  className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-indigo-50"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="px-8 py-5 bg-gradient-to-br from-indigo-50 to-white rounded-b-3xl border-t border-gray-200/50">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl cursor-pointer"
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
