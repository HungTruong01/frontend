import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaWarehouse,
  FaBoxOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getWarehouseTransferById } from "@/api/warehouseTransferApi";
import { getProductById } from "@/api/productApi";
import { getWarehouseById } from "@/api/warehouseApi";
import { getInventoryAdjustmentTypeById } from "@/api/inventoryAdjustmentTypesApi";

const WarehouseTransferDetail = () => {
  const { transferId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adjustmentData, setAdjustmentData] = useState(null);
  const [product, setProduct] = useState(null);
  const [sourceWarehouse, setSourceWarehouse] = useState(null);
  const [destinationWarehouse, setDestinationWarehouse] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch warehouse transfer data
        const transferData = await getWarehouseTransferById(transferId);
        setAdjustmentData(transferData);

        // Fetch related data in parallel
        const [productData, sourceData, destinationData, typeData] =
          await Promise.all([
            getProductById(transferData.productId),
            transferData.sourceWarehouseId
              ? getWarehouseById(transferData.sourceWarehouseId)
              : null,
            transferData.destinationWarehouseId
              ? getWarehouseById(transferData.destinationWarehouseId)
              : null,
            getInventoryAdjustmentTypeById(transferData.statusId),
          ]);

        setProduct(productData);
        setSourceWarehouse(sourceData);
        setDestinationWarehouse(destinationData);
        setAdjustmentType(typeData);
      } catch (err) {
        console.error("Error fetching adjustment details:", err);
        setError("Không thể tải thông tin chi tiết điều chỉnh tồn kho");
        toast.error("Không thể tải thông tin chi tiết điều chỉnh tồn kho");
      } finally {
        setLoading(false);
      }
    };

    if (transferId) {
      fetchData();
    }
  }, [transferId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleGoBack = () => {
    navigate("/dashboard/warehouse/warehouse-transfer");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết điều chỉnh tồn kho
          </h1>
          <button
            onClick={handleGoBack}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </button>
        </div>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!adjustmentData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết điều chỉnh tồn kho
          </h1>
          <button
            onClick={handleGoBack}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </button>
        </div>
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          <p>Không tìm thấy thông tin điều chỉnh tồn kho</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết chuyển kho #{transferId}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Thông tin cơ bản */}
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" /> Thông tin chuyển
              kho
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 font-medium">
                  Mã chuyển kho:
                </span>
                <span className="ml-2 text-gray-800">{adjustmentData.id}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Ngày tạo:</span>
                <span className="ml-2 text-gray-800">
                  {formatDate(adjustmentData.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">
                  Trạng thái vận chuyển:
                </span>
                <span className="ml-2 text-gray-800 font-semibold">
                  {adjustmentType?.name || "Không rõ"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Số lượng:</span>
                <span className="ml-2 text-blue-600 font-bold">
                  {adjustmentData.quantity}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBoxOpen className="mr-2 text-blue-600" /> Thông tin sản phẩm
            </h2>
            {product ? (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 font-medium">
                    Mã sản phẩm:
                  </span>
                  <span className="ml-2 text-gray-800">{product.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">
                    Tên sản phẩm:
                  </span>
                  <span className="ml-2 text-gray-800 font-medium">
                    {product.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Giá:</span>
                  <span className="ml-2 text-blue-600 font-medium">
                    {formatCurrency(product.price || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">
                    Tồn kho hiện tại:
                  </span>
                  <span className="ml-2 text-green-600 font-medium">
                    {product.quantity || 0} sản phẩm
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Không có thông tin sản phẩm</p>
            )}
          </div>
        </div>

        {/* Thông tin kho */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kho xuất */}
          <div className="bg-orange-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaWarehouse className="mr-2 text-orange-600" /> Kho xuất
            </h2>
            {sourceWarehouse ? (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 font-medium">Mã kho:</span>
                  <span className="ml-2 text-gray-800">
                    {sourceWarehouse.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Tên kho:</span>
                  <span className="ml-2 text-gray-800 font-medium">
                    {sourceWarehouse.name}
                  </span>
                </div>
                {sourceWarehouse.address && (
                  <div>
                    <span className="text-gray-500 font-medium">Địa chỉ:</span>
                    <span className="ml-2 text-gray-800">
                      {sourceWarehouse.address}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Không có thông tin kho xuất</p>
            )}
          </div>

          {/* Kho nhập */}
          <div className="bg-green-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaWarehouse className="mr-2 text-green-600" /> Kho nhập
            </h2>
            {destinationWarehouse ? (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 font-medium">Mã kho:</span>
                  <span className="ml-2 text-gray-800">
                    {destinationWarehouse.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Tên kho:</span>
                  <span className="ml-2 text-gray-800 font-medium">
                    {destinationWarehouse.name}
                  </span>
                </div>
                {destinationWarehouse.address && (
                  <div>
                    <span className="text-gray-500 font-medium">Địa chỉ:</span>
                    <span className="ml-2 text-gray-800">
                      {destinationWarehouse.address}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Không có thông tin kho nhập</p>
            )}
          </div>
        </div>

        {/* Nút hành động */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseTransferDetail;
