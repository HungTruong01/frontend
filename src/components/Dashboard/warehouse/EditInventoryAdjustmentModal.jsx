import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllProducts } from "@/api/productApi";
import { getAllWarehouse } from "@/api/warehouseApi";
import { getAllInventoryAdjustmentType } from "@/api/inventoryAdjustmentTypesApi";
import { updateWarehouseTransfer } from "@/api/warehouseTransferApi";

const EditInventoryAdjustmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Chỉnh sửa điều chỉnh tồn kho",
}) => {
  const [adjustmentData, setAdjustmentData] = useState({
    id: initialData?.id || "",
    productId: initialData?.productId || "",
    quantity: initialData?.quantity || "",
    sourceWarehouseId: initialData?.sourceWarehouseId || "",
    destinationWarehouseId: initialData?.destinationWarehouseId || "",
    statusId: initialData?.statusId || "",
  });

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [productsRes, warehousesRes, typesRes] = await Promise.all([
          getAllProducts(0, 100, "id", "asc"), // Giả sử API hỗ trợ phân trang
          getAllWarehouse(),
          getAllInventoryAdjustmentType(),
        ]);

        setProducts(productsRes.data.content || productsRes.data || []);
        setWarehouses(warehousesRes.content || warehousesRes || []);
        setAdjustmentTypes(typesRes.content || typesRes || []);
        const initialProduct = productsRes.data.content.find(
          (p) => p.id === initialData?.productId
        );
        setSelectedProduct(initialProduct || null);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tùy chọn:", error);
        toast.error("Không thể tải dữ liệu tùy chọn");
      }
    };

    if (isOpen) {
      fetchOptions();
      setAdjustmentData({
        id: initialData?.id || "",
        productId: initialData?.productId || "",
        quantity: initialData?.quantity || "",
        sourceWarehouseId: initialData?.sourceWarehouseId || "",
        destinationWarehouseId: initialData?.destinationWarehouseId || "",
        statusId: initialData?.statusId || "",
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "productId") {
      setLoadingProduct(true);
      const product = products.find((p) => p.id === parseInt(value));
      setSelectedProduct(product || null);
      setLoadingProduct(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!adjustmentData.productId) {
      newErrors.productId = "Vui lòng chọn sản phẩm";
    }

    if (!adjustmentData.statusId) {
      newErrors.statusId = "Vui lòng chọn lý do điều chỉnh";
    }

    if (!adjustmentData.quantity || adjustmentData.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (
      adjustmentData.sourceWarehouseId &&
      adjustmentData.destinationWarehouseId &&
      adjustmentData.sourceWarehouseId === adjustmentData.destinationWarehouseId
    ) {
      newErrors.destinationWarehouseId = "Kho nhập phải khác kho xuất";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const submittedData = {
        productId: parseInt(adjustmentData.productId),
        quantity: parseInt(adjustmentData.quantity),
        sourceWarehouseId: adjustmentData.sourceWarehouseId
          ? parseInt(adjustmentData.sourceWarehouseId)
          : null,
        destinationWarehouseId: adjustmentData.destinationWarehouseId
          ? parseInt(adjustmentData.destinationWarehouseId)
          : null,
        statusId: parseInt(adjustmentData.statusId),
      };

      const response = await updateWarehouseTransfer(
        adjustmentData.id,
        submittedData
      );
      await onSubmit(response || submittedData);
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật điều chỉnh tồn kho:", error);
      toast.error(
        `Lỗi: ${
          error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật điều chỉnh tồn kho"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Sản phẩm */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sản phẩm <span className="text-red-500">*</span>
            </label>
            <select
              name="productId"
              value={adjustmentData.productId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.productId ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Chọn sản phẩm</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name || `Sản phẩm ${product.id}`}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="mt-1 text-sm text-red-500">{errors.productId}</p>
            )}
          </div>

          {/* Lý do điều chỉnh */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do điều chỉnh <span className="text-red-500">*</span>
            </label>
            <select
              name="statusId"
              value={adjustmentData.statusId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.statusId ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Chọn lý do</option>
              {adjustmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name || `Lý do ${type.id}`}
                </option>
              ))}
            </select>
            {errors.statusId && (
              <p className="mt-1 text-sm text-red-500">{errors.statusId}</p>
            )}
          </div>

          {/* Product Details Card */}
          {adjustmentData.productId && (
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {loadingProduct ? (
                <div className="flex justify-center items-center h-24">
                  <p className="text-gray-500">
                    Đang tải thông tin sản phẩm...
                  </p>
                </div>
              ) : selectedProduct ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sản phẩm:</p>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tồn kho:</p>
                    <p className="font-medium">
                      {selectedProduct.quantity || 0} sản phẩm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Giá:</p>
                    <p className="font-medium text-blue-600">
                      {formatCurrency(selectedProduct.price || 0)}
                    </p>
                  </div>
                  {selectedProduct.sku && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mã SKU:</p>
                      <p className="font-medium">{selectedProduct.sku}</p>
                    </div>
                  )}
                  {selectedProduct.barcode && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mã vạch:</p>
                      <p className="font-medium">{selectedProduct.barcode}</p>
                    </div>
                  )}
                  {selectedProduct.description && (
                    <div className="col-span-1 sm:col-span-3">
                      <p className="text-sm text-gray-500 mb-1">Mô tả:</p>
                      <p className="text-sm">{selectedProduct.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-3">
                  Không tìm thấy thông tin sản phẩm
                </p>
              )}
            </div>
          )}

          {/* Kho xuất */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kho xuất <span className="text-red-500">*</span>
            </label>
            <select
              name="sourceWarehouseId"
              value={adjustmentData.sourceWarehouseId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.sourceWarehouseId ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Chọn kho xuất</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name || `Kho ${warehouse.id}`}
                </option>
              ))}
            </select>
            {errors.sourceWarehouseId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.sourceWarehouseId}
              </p>
            )}
          </div>

          {/* Kho nhập */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kho nhập <span className="text-red-500">*</span>
            </label>
            <select
              name="destinationWarehouseId"
              value={adjustmentData.destinationWarehouseId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.destinationWarehouseId
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Chọn kho nhập</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name || `Kho ${warehouse.id}`}
                </option>
              ))}
            </select>
            {errors.destinationWarehouseId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.destinationWarehouseId}
              </p>
            )}
          </div>

          {/* Số lượng */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={adjustmentData.quantity}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-2 border ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Nhập số lượng..."
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>

          <div className="col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInventoryAdjustmentModal;
