import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getInventoryAdjustmentById } from "@/api/inventoryAdjustmentApi";
import { getWarehouseById } from "@/api/warehouseApi";
import { getProductById } from "@/api/productApi";
import { getInventoryAdjustmentTypeById } from "@/api/inventoryAdjustmentTypesApi";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/formatter";

const AdjustInventoryDetail = () => {
  const { adjustmentId } = useParams();
  const navigate = useNavigate();
  const [adjustment, setAdjustment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedDataLoading, setRelatedDataLoading] = useState(false);

  useEffect(() => {
    const fetchAdjustmentDetails = async () => {
      if (!adjustmentId) {
        setError("ID điều chỉnh không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const adjustmentData = await getInventoryAdjustmentById(adjustmentId);

        if (!adjustmentData) {
          throw new Error("Không tìm thấy dữ liệu điều chỉnh");
        }

        setAdjustment(adjustmentData);
        setLoading(false);

        setRelatedDataLoading(true);

        try {
          const [warehouse, product, adjustmentType] = await Promise.all([
            getWarehouseById(adjustmentData.warehouseId),
            getProductById(adjustmentData.productId),
            getInventoryAdjustmentTypeById(
              adjustmentData.inventoryAdjustmentTypeId
            ),
          ]);

          setAdjustment((prev) => ({
            ...prev,
            warehouseName: warehouse?.name || "Kho không rõ",
            productName: product?.name || "Sản phẩm không rõ",
            productCode: product?.code || "Mã không rõ",
            adjustmentTypeName: adjustmentType?.name || "Loại không rõ",
          }));
        } catch (relatedError) {
          console.error("Lỗi khi tải dữ liệu liên quan:", relatedError);
          toast.warning(
            "Một số thông tin liên quan không thể tải. Hiển thị dữ liệu một phần."
          );
        } finally {
          setRelatedDataLoading(false);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết điều chỉnh:", err);
        setError(err.message || "Không thể tải thông tin điều chỉnh tồn kho");
        toast.error("Không thể tải thông tin điều chỉnh tồn kho");
        setLoading(false);
      }
    };

    fetchAdjustmentDetails();
  }, [adjustmentId]);

  const handleGoBack = () => {
    navigate("/dashboard/warehouse/adjust-inventory");
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-gray-500">Đang tải dữ liệu điều chỉnh...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate("/dashboard/warehouse/adjust-inventory")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!adjustment) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">
          Không tìm thấy dữ liệu điều chỉnh
        </div>
        <button
          onClick={() => navigate("/dashboard/warehouse/adjust-inventory")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {relatedDataLoading && (
        <div className="bg-blue-50 text-blue-700 p-2 rounded text-center">
          Đang tải thông tin bổ sung...
        </div>
      )}

      <div className="flex justify-between items-center my-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800 leading-none px-2">
            Chi tiết điều chỉnh tồn kho #{adjustment.id}
          </h1>
        </div>
        <button
          onClick={handleGoBack}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors bg-white"
        >
          Quay lại
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông tin điều chỉnh
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Mã điều chỉnh</p>
              <p className="text-gray-800">{adjustment.id || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                Loại điều chỉnh
              </p>
              <p className="text-gray-800">
                {adjustment.adjustmentTypeName || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Ngày tạo</p>
              <p className="text-gray-800">
                {formatDate(adjustment.createdAt)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Kho bãi</p>
              <p className="text-gray-800">
                {adjustment.warehouseName || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Tên sản phẩm</p>
              <p className="text-gray-800">{adjustment.productName || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Số lượng</p>
              <p className="text-gray-800">{adjustment.quantity || "0"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustInventoryDetail;
