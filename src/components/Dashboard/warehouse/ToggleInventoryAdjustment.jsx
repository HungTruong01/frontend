import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllProducts, getProductById } from "@/api/productApi";
import { getAllInventoryAdjustmentType } from "@/api/inventoryAdjustmentTypesApi";
import { getAllWarehouse } from "@/api/warehouseApi";
import {
  createInventoryAdjustment,
  updateInventoryAdjustment,
} from "@/api/inventoryAdjustmentApi";

const ToggleInventoryAdjustment = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) => {
  const [adjustmentData, setAdjustmentData] = useState({
    id: "",
    productId: "",
    warehouseId: "",
    inventoryAdjustmentTypeId: "",
    quantity: "",
  });

  const [products, setProducts] = useState([]);
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && isEditing && initialData) {
      setAdjustmentData({
        id: initialData.id,
        productId: initialData.productId,
        warehouseId: initialData.warehouseId,
        inventoryAdjustmentTypeId: initialData.inventoryAdjustmentTypeId,
        quantity: initialData.quantity,
      });
    } else if (isOpen && !isEditing) {
      formData();
    }
  }, [isOpen, initialData, isEditing]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, typesRes, warehousesRes] = await Promise.all([
          getAllProducts(0, 1000, "id", "asc"),
          getAllInventoryAdjustmentType(0, 1000, "id", "asc"),
          getAllWarehouse(),
        ]);

        setProducts(productsRes.data?.content || []);
        setAdjustmentTypes(typesRes.content || typesRes || []);
        setWarehouses(warehousesRes.content || warehousesRes || []);

        if (isEditing && initialData?.productId) {
          const productData = await getProductById(initialData.productId);
          setSelectedProduct(productData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể tải dữ liệu");
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, isEditing, initialData?.productId]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!adjustmentData.productId) {
        setSelectedProduct(null);
        return;
      }

      try {
        const productData = await getProductById(adjustmentData.productId);
        setSelectedProduct(productData);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      }
    };

    fetchProductDetails();
  }, [adjustmentData.productId]);

  const formData = () => {
    setAdjustmentData({
      id: "",
      productId: "",
      warehouseId: "",
      inventoryAdjustmentTypeId: "",
      quantity: "",
    });
    setSelectedProduct(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!adjustmentData.productId)
      newErrors.productId = "Vui lòng chọn sản phẩm";
    if (!adjustmentData.warehouseId)
      newErrors.warehouseId = "Vui lòng chọn kho";
    if (!adjustmentData.inventoryAdjustmentTypeId)
      newErrors.inventoryAdjustmentTypeId = "Vui lòng chọn loại điều chỉnh";
    if (!adjustmentData.quantity || adjustmentData.quantity <= 0)
      newErrors.quantity = "Số lượng phải lớn hơn 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const submitData = {
        ...adjustmentData,
        productId: Number(adjustmentData.productId),
        warehouseId: Number(adjustmentData.warehouseId),
        inventoryAdjustmentTypeId: Number(
          adjustmentData.inventoryAdjustmentTypeId
        ),
        quantity: Number(adjustmentData.quantity),
      };

      if (isEditing) {
        await updateInventoryAdjustment(adjustmentData.id, submitData);
      } else {
        await createInventoryAdjustment(submitData);
      }

      await onSubmit();
      onClose();
    } catch (error) {
      console.error(
        `Lỗi khi ${isEditing ? "cập nhật" : "thêm"} điều chỉnh:`,
        error
      );
      toast.error(
        `Lỗi khi ${isEditing ? "cập nhật" : "thêm"} điều chỉnh tồn kho`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const formatCurrency = (amount) => {
    return `${new Intl.NumberFormat("vi-VN").format(amount)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing
              ? "Chỉnh sửa điều chỉnh tồn kho"
              : "Thêm mới điều chỉnh tồn kho"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sản phẩm <span className="text-red-500">*</span>
              </label>
              <select
                name="productId"
                value={adjustmentData.productId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.productId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="mt-1 text-sm text-red-500">{errors.productId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kho <span className="text-red-500">*</span>
              </label>
              <select
                name="warehouseId"
                value={adjustmentData.warehouseId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.warehouseId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chọn kho</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.warehouseId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.warehouseId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại điều chỉnh <span className="text-red-500">*</span>
              </label>
              <select
                name="inventoryAdjustmentTypeId"
                value={adjustmentData.inventoryAdjustmentTypeId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.inventoryAdjustmentTypeId
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Chọn loại điều chỉnh</option>
                {adjustmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.inventoryAdjustmentTypeId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.inventoryAdjustmentTypeId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={adjustmentData.quantity}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
                min="1"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Product details section */}
          {selectedProduct && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Thông tin sản phẩm
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã sản phẩm</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedProduct.id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tên sản phẩm</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedProduct.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số lượng</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(selectedProduct.quantity)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giá tiền</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(selectedProduct.exportPrice)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToggleInventoryAdjustment;
