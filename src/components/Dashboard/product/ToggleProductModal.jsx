import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getAllProductTypes } from "@/api/productTypeApi";
import { getAllProductUnits } from "@/api/productUnitApi";

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
    price: "",
    quantity: "",
    productTypeId: "",
    productUnitId: "",
  });

  const [productTypes, setProductTypes] = useState([]);
  const [productUnits, setProductUnits] = useState([]);

  const fetchData = async () => {
    try {
      const [typesRes, unitsRes] = await Promise.all([
        getAllProductTypes(),
        getAllProductUnits(),
      ]);
      setProductTypes(typesRes.content);
      setProductUnits(unitsRes.content);
    } catch (error) {
      console.error("Error fetching data:", error);
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
          price: product.price || "",
          quantity: product.quantity || "",
          productTypeId: product.productTypeId || "",
          productUnitId: product.productUnitId || "",
        });
      } else {
        setFormData({
          id: "",
          name: "",
          description: "",
          price: "",
          quantity: "",
          productTypeId: "",
          productUnitId: "",
        });
      }
    }
  }, [isOpen, product, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
      ...(formData.quantity && { quantity: Number(formData.quantity) }),
    };
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
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                placeholder="Nhập mô tả sản phẩm"
                required
              />
            </div>

            <div className={`grid gap-4 grid-cols-1`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập giá tiền"
                  min="0"
                  required
                />
              </div>

              {/* {isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
              )} */}
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
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
            >
              {isEdit ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToggleProductModal;
