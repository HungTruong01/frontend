import React, { useEffect, useState } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { getAllProductTypes } from "@/api/productTypeApi";
import { getAllProductUnits } from "@/api/productUnitApi";
import { uploadImageToCloudinary } from "@/utils/uploadFile";

const ToggleProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  mode = "add",
}) => {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    importPrice: "",
    exportPrice: "",
    price: "",
    quantity: "",
    productTypeId: "",
    productUnitId: "",
    thumbnail: "",
  });

  const [productTypes, setProductTypes] = useState([]);
  const [productUnits, setProductUnits] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const fetchData = async () => {
    try {
      const [typesRes, unitsRes] = await Promise.all([
        getAllProductTypes(),
        getAllProductUnits(),
      ]);
      setProductTypes(typesRes.content);
      setProductUnits(unitsRes.content);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setUploadError("Không thể tải loại sản phẩm hoặc đơn vị tính");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (isEdit && product) {
        setFormData({
          id: product.id || "",
          name: product.name || "",
          description: product.description || "",
          importPrice: product.importPrice || "",
          exportPrice: product.exportPrice || "",
          price: product.price || product.exportPrice || "",
          quantity: product.quantity || "",
          productTypeId: product.productTypeId || "",
          productUnitId: product.productUnitId || "",
          thumbnail: product.thumbnail || "",
        });
        setPreviewImage(product.thumbnail || null);
      } else {
        setFormData({
          id: "",
          name: "",
          description: "",
          importPrice: "",
          exportPrice: "",
          price: "",
          quantity: "",
          productTypeId: "",
          productUnitId: "",
          thumbnail: "",
        });
        setPreviewImage(null);
      }
      setUploadError("");
    }
  }, [isOpen, product, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUploading) {
      setUploadError("Vui lòng đợi cho đến khi quá trình tải ảnh hoàn tất");
      return;
    }

    const data = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      importPrice: Number(formData.importPrice),
      exportPrice: Number(formData.exportPrice),
      price: Number(formData.exportPrice),
      quantity: formData.quantity ? Number(formData.quantity) : 0,
      productTypeId: Number(formData.productTypeId),
      productUnitId: Number(formData.productUnitId),
      thumbnail: formData.thumbnail || "",
      warehouseProducts: [],
    };
    // console.log("Dữ liệu gửi đi:", data);
    onSubmit(data);
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
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none shadow-sm"
                placeholder="Nhập mô tả sản phẩm"
                required
              />
            </div>

            {/* Price Section */}
            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Giá vốn <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="importPrice"
                    value={formData.importPrice}
                    onChange={handleChange}
                    className="w-full pl-3.5 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="Nhập giá vốn"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    VND
                  </span>
                </div>
              </div>

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
                    className="w-full pl-3.5 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="Nhập giá bán"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    VND
                  </span>
                </div>
              </div>
            </div>

            {/* Product Type & Unit Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Loại sản phẩm <span className="text-red-500">*</span>
                </label>
                <select
                  name="productTypeId"
                  value={formData.productTypeId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
                  required
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">Chọn loại sản phẩm</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Đơn vị tính <span className="text-red-500">*</span>
                </label>
                <select
                  name="productUnitId"
                  value={formData.productUnitId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
                  required
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">Chọn đơn vị tính</option>
                  {productUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
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
