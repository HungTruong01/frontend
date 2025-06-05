import React, { useEffect, useState } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { getAllProductTypes } from "@/api/productTypeApi";
import { getAllProductUnits } from "@/api/productUnitApi";
import { uploadImageToCloudinary } from "@/utils/uploadFile";
import { toast } from "react-toastify";
import Select from "react-select";

const ToggleProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  mode = "add",
}) => {
  const isEdit = mode === "edit";
  const initData = {
    id: "",
    name: "",
    description: "",
    exportPrice: "",
    quantity: "",
    productTypeId: "",
    productUnitId: "",
    thumbnail: "",
  };
  const [formData, setFormData] = useState(initData);

  const [productTypes, setProductTypes] = useState([]);
  const [productUnits, setProductUnits] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [errors, setErrors] = useState({});

  const options = productUnits.map((unit) => ({
    value: unit.id,
    label: unit.name,
  }));

  const typeOptions = productTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const fetchData = async () => {
    try {
      const [typesRes, unitsRes] = await Promise.all([
        getAllProductTypes(0, 100, "id", "asc"),
        getAllProductUnits(0, 100, "id", "asc"),
      ]);
      setProductTypes(typesRes.data?.content || []);
      setProductUnits(unitsRes.data?.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setProductTypes([]);
      setProductUnits([]);
      setUploadError("Không thể tải loại sản phẩm hoặc đơn vị tính");
    }
  };

  const normalizeString = (str) => {
    return str.trim().replace(/\s+/g, " ");
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    }

    if (!data.description.trim()) {
      newErrors.description = "Mô tả sản phẩm không được để trống";
    }

    if (!data.exportPrice) {
      newErrors.exportPrice = "Giá bán không được để trống";
    } else if (isNaN(data.exportPrice) || Number(data.exportPrice) <= 0) {
      newErrors.exportPrice = "Giá bán phải là số dương lớn hơn 0";
    }

    if (!data.productTypeId) {
      newErrors.productTypeId = "Loại sản phẩm không được để trống";
    }

    if (!data.productUnitId) {
      newErrors.productUnitId = "Đơn vị tính không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (isEdit && product) {
        setFormData({
          id: product.id || "",
          name: product.name || "",
          description: product.description || "",
          exportPrice: product.exportPrice || "",
          quantity: product.quantity || "",
          productTypeId: product.productTypeId || "",
          productUnitId: product.productUnitId || "",
          thumbnail: product.thumbnail || "",
        });
        setPreviewImage(product.thumbnail || null);
      } else {
        setFormData(initData);
        setPreviewImage(null);
      }
      setUploadError("");
      setErrors({});
    }
  }, [isOpen, product, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "exportPrice") {
      newValue = value.replace(/[^0-9]/g, "");
      if (newValue === "0") {
        newValue = "";
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError("Vui lòng chọn một file ảnh");
      return;
    }

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

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const result = await uploadImageToCloudinary(file);
      const secureUrl = result.secure_url;
      if (!secureUrl) {
        throw new Error("secure_url từ Cloudinary là undefined");
      }
      setFormData((prev) => ({ ...prev, thumbnail: secureUrl }));
      setIsUploading(false);
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error.message);
      setUploadError(`Không thể tải ảnh lên: ${error.message}`);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      toast.error("Vui lòng đợi cho đến khi quá trình tải ảnh hoàn tất");
      return;
    }

    // Chuẩn hóa dữ liệu trước khi validate
    const normalizedData = {
      ...formData,
      name: normalizeString(formData.name),
      description: normalizeString(formData.description),
    };

    if (!validateForm(normalizedData)) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    const data = {
      id: normalizedData.id,
      name: normalizedData.name,
      description: normalizedData.description,
      exportPrice: Number(normalizedData.exportPrice),
      quantity: normalizedData.quantity ? Number(normalizedData.quantity) : 0,
      productTypeId: Number(normalizedData.productTypeId),
      productUnitId: Number(normalizedData.productUnitId),
      thumbnail: normalizedData.thumbnail || "",
      warehouseProducts: [],
    };
    try {
      await onSubmit(data);
      setFormData(initData);
      setPreviewImage(null);
      setErrors({});
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  // Thêm styles chung cho cả 2 select
  const customSelectStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "200px",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "42px", // Để giữ chiều cao giống các input khác
    }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 border-b border-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              {isEdit && (
                <p className="text-blue-100 text-sm mt-0.5">
                  Mã sản phẩm: {product?.id}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-all"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-5">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh sản phẩm
              </label>
              <div className="flex items-start space-x-4">
                <div className="w-28 h-28 border border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Xem trước sản phẩm"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center p-2">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex justify-center px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 border border-blue-200 transition-colors">
                    <div className="flex items-center">
                      {isUploading ? (
                        <FaSpinner className="mr-2 animate-spin" />
                      ) : (
                        <FaUpload className="mr-2" />
                      )}
                      <span className="font-medium">
                        {isUploading ? "Đang tải lên..." : "Chọn ảnh"}
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                  {uploadError && (
                    <p className="text-xs text-red-500 mt-1.5">{uploadError}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Định dạng: JPG, PNG, WEBP. Tối đa 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 border ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                placeholder="Nhập tên sản phẩm"
                required
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 border ${
                  errors.description ? "border-red-500" : "border-gray-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none shadow-sm`}
                placeholder="Nhập mô tả sản phẩm"
                required
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Giá bán <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="exportPrice"
                    value={formData.exportPrice}
                    onChange={handleChange}
                    className={`w-full pl-3.5 pr-12 py-2.5 border ${
                      errors.exportPrice ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
                    placeholder="Nhập giá bán"
                    required
                    min="1" // Ngăn nhập số âm và 0 trong giao diện
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    VND
                  </span>
                </div>
                {errors.exportPrice && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.exportPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Loại sản phẩm <span className="text-red-500">*</span>
                </label>
                <Select
                  options={typeOptions}
                  value={typeOptions.find(
                    (o) => o.value === formData.productTypeId
                  )}
                  onChange={(selected) =>
                    handleChange({
                      target: { name: "productTypeId", value: selected.value },
                    })
                  }
                  placeholder="Chọn loại sản phẩm"
                  className="text-xm"
                  menuPlacement="top"
                  styles={customSelectStyles}
                  isClearable={true}
                />
                {errors.productTypeId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.productTypeId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Đơn vị tính <span className="text-red-500">*</span>
                </label>
                <Select
                  options={options}
                  value={options.find(
                    (o) => o.value === formData.productUnitId
                  )}
                  onChange={(selected) =>
                    handleChange({
                      target: { name: "productUnitId", value: selected.value },
                    })
                  }
                  placeholder="Chọn đơn vị tính"
                  className="text-xm"
                  menuPlacement="top"
                  styles={customSelectStyles}
                  isClearable={true}
                />
                {errors.productUnitId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.productUnitId}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors"
              disabled={isUploading}
            >
              {isUploading
                ? "Đang xử lý..."
                : isEdit
                ? "Lưu thay đổi"
                : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToggleProductModal;
