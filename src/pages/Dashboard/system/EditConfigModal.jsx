import React, { useState, useEffect, memo } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { uploadImageToCloudinary } from '../../../utils/uploadFile';

// Component QuillWrapper
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
      {/* Thêm min-height và style container cho Quill */}
      <div className="min-h-[300px] relative">
        {/* Container cho toolbar */}
        <div className="ql-toolbar ql-snow border-b border-gray-300 sticky top-0 bg-white z-10" />
        {/* Container cho editor với style cụ thể */}
        <div className="h-[250px] overflow-y-auto">
          <div ref={quillRef} className="!h-full" />
        </div>
      </div>
    </div>
  );
});

const EditConfigModal = ({ isOpen, onClose, onSubmit, currentItem }) => {
  const [formData, setFormData] = useState({
    field: "",
    value: "",
    type: "text",
  });

  // Lưu trữ nội dung tạm thời khi chuyển đổi type
  const [tempContent, setTempContent] = useState({
    text: "",
    link: "",
    image: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // Fill data khi mở modal
  useEffect(() => {
    if (isOpen && currentItem) {
      const type = currentItem.type || "text";
      setFormData({
        field: currentItem.field,
        value: currentItem.value || "",
        type: type
      });
      
      // Lưu nội dung vào state tạm thời tương ứng
      setTempContent({
        text: type === "text" ? currentItem.value || "" : "",
        link: type === "link" ? currentItem.value || "" : "",
        image: type === "image" ? currentItem.value || "" : ""
      });
    }
  }, [isOpen, currentItem]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const oldType = formData.type;
    
    // Lưu nội dung hiện tại vào state tạm thời
    setTempContent(prev => ({
      ...prev,
      [oldType]: formData.value
    }));

    // Set formData với nội dung tương ứng từ state tạm thời
    setFormData(prev => ({
      ...prev,
      type: newType,
      value: tempContent[newType] || ""
    }));
  };

  const handleQuillChange = (content) => {
  setFormData((prev) => ({
    ...prev,
    value: content
  }));

  setTempContent((prev) => ({
    ...prev,
    text: content
  }));
};

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      value: URL.createObjectURL(file) // Tạm thời hiển thị ảnh local
    }));

    // Lưu file để xử lý khi submit
    setSelectedFile(file);
  };

  // Reset cả form data và temp content khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        field: "",
        value: "",
        type: "text",
      });
      setTempContent({
        text: "",
        link: "",
        image: ""
      });
    }
  }, [isOpen]);

  // Đã rút gọn, chỉ hiển thị phần handleSubmit đã sửa
const handleSubmit = async (e) => {
  e?.preventDefault();

  if (!formData.value.trim()) {
    toast.error("Vui lòng nhập nội dung");
    return;
  }

  try {
    let finalValue = formData.value;

    // Xử lý upload ảnh nếu là type image và có file mới
    if (formData.type === "image" && selectedFile) {
      const result = await uploadImageToCloudinary(selectedFile);
      finalValue = result.secure_url;
    }

    // Validate URL nếu là type link
    if (formData.type === "link") {
      try {
        new URL(finalValue);
      } catch {
        toast.error("Liên kết không hợp lệ");
        return;
      }
    }

    // Gọi API cập nhật config với giá trị cuối cùng
    await onSubmit({
      field: formData.field,
      value: finalValue.trim()
    });

    onClose();
  } catch (error) {
    toast.error(error.message || "Có lỗi xảy ra khi cập nhật");
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Chỉnh sửa cấu hình
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên
            </label>
            <input
              type="text"
              value={formData.field}
              disabled
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại nội dung
            </label>
            <select
              value={formData.type}
              onChange={handleTypeChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Văn bản</option>
              <option value="link">Liên kết</option>
              <option value="image">Ảnh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            {formData.type === "link" ? (
              <input
                type="url"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                placeholder="https://example.com"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : formData.type === "image" ? (
              <div className="flex items-center space-x-2">
                <label className="flex items-center px-4 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <FaUpload className="mr-2" />
                  <span>Chọn ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {formData.value && (
                  <span className="text-sm text-gray-600">
                    Đã chọn ảnh
                  </span>
                )}
              </div>
            ) : (
              <QuillWrapper
                key={formData.field} // reset Quill editor mỗi khi field khác nhau
                onChange={handleQuillChange}
                initialContent={formData.value}
              />
            )}
          </div>
        </form>

        <div className="flex justify-end mt-6 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConfigModal;
