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
    console.log("Dữ liệu gửi đi:", data);
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              {isEdit && (
                <p className="text-white/80 text-sm mt-1">
                  Mã sản phẩm: {product?.id}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh sản phẩm
              </label>
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 border border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Xem trước sản phẩm"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm text-center p-2">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex flex-col items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 border border-blue-300">
                    <div className="flex items-center">
                      {isUploading ? (
                        <FaSpinner className="mr-2 animate-spin" />
                      ) : (
                        <FaUpload className="mr-2" />
                      )}
                      <span>
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
                    <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Định dạng: JPG, PNG, WEBP. Tối đa 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                placeholder="Nhập mô tả sản phẩm"
                required
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá vốn <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="importPrice"
                  value={formData.importPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá vốn"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="exportPrice"
                  value={formData.exportPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá bán"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại sản phẩm <span className="text-red-500">*</span>
                </label>
                <select
                  name="productTypeId"
                  value={formData.productTypeId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tính <span className="text-red-500">*</span>
                </label>
                <select
                  name="productUnitId"
                  value={formData.productUnitId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
              disabled={isUploading}
            >
              {isUploading
                ? "Đang tải lên..."
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
