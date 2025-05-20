import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import TogglePartnerModal from "@/components/Dashboard/partner/TogglePartnerModal";
import ProductSelectionModal from "@/components/Dashboard/product/ProductSelectionModal";
import { partnerApi } from "@/api/partnerApi";
import { getAllOrderTypes } from "@/api/orderTypeApi";
import { createOrder, getOrderById, updateOrder } from "@/api/orderApi";
import {
  createOrderDetails,
  updateOrderDetailsByOrderId,
} from "@/api/orderDetailApi";
import { getAllProducts, updateProduct } from "@/api/productApi";
import { toast } from "react-toastify";
import { getAllImportBatches } from "@/api/importBatch";

const OrderForm = ({ mode = "add" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [partners, setPartners] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPaidMoney, setCurrentPaidMoney] = useState(0);
  const [originalPartner, setOriginalPartner] = useState("");
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [importBatches, setImportBatches] = useState([]);

  const isEdit = mode === "edit" && id;
  const isPurchaseOrder = selectedOrderType === "1";
  const isSalesOrder = selectedOrderType === "2";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnerRes, typeRes, productRes, batchesRes] = await Promise.all(
          [
            partnerApi.getAllPartners(0, 100, "id", "asc"),
            getAllOrderTypes(),
            getAllProducts(0, 100, "id", "asc"),
            getAllImportBatches(0, 1000, "importDate", "desc"),
          ]
        );
        setPartners(partnerRes.content || []);
        setOrderTypes(typeRes.content || []);
        setProducts(productRes.data?.content || []);
        setImportBatches(batchesRes.data?.content || []);
      } catch {
        toast.error("Lỗi tải dữ liệu cơ bản");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit && products.length) fetchOrder();
  }, [products]);

  useEffect(() => {
    if (orderItems.length > 0) {
      const updatedItems = orderItems.map((item) => ({
        ...item,
        expireDate: isPurchaseOrder ? item.expireDate || "" : "",
      }));
      setOrderItems(updatedItems);
    }
  }, [selectedOrderType]);

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id);
      setSelectedPartner(res.partnerId);
      setOriginalPartner(res.partnerId);
      setSelectedOrderType(res.orderTypeId);
      setSelectedStatus(res.orderStatusId);
      setCurrentPaidMoney(res.paidMoney || 0);
      const items = res.orderDetails.map((detail) => {
        const product = products.find((p) => p.id === detail.productId);
        return {
          detailId: detail.id,
          id: detail.productId,
          product: product?.name || `SP #${detail.productId}`,
          quantity: detail.quantity,
          unit_price: detail.unit_price,
          exportPrice:
            detail.unit_price ??
            detail.exportPrice ??
            product?.exportPrice ??
            0,
          importPrice: product?.importPrice ?? 0,
          expireDate: detail.expireDate
            ? new Date(detail.expireDate).toISOString().split("T")[0]
            : "",
          profit:
            (detail.unit_price ??
              detail.exportPrice ??
              product?.exportPrice ??
              0 - (product?.importPrice ?? 0)) * detail.quantity,
        };
      });
      setOrderItems(items);
    } catch {
      toast.error("Không thể tải dữ liệu đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () =>
    orderItems.reduce((sum, i) => {
      const quantity = i.quantity || 1;
      const price = i.unit_price || 0;
      return sum + quantity * price;
    }, 0);

  const calculateTotalProfit = () =>
    orderItems.reduce((sum, i) => sum + (i.profit || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartner || !selectedOrderType || orderItems.length === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin và thêm sản phẩm");
      return;
    }

    if (isPurchaseOrder) {
      const missingExpireDates = orderItems.some((item) => !item.expireDate);
      if (missingExpireDates) {
        toast.error(
          "Vui lòng nhập ngày hết hạn cho tất cả sản phẩm trong đơn mua"
        );
        return;
      }
    }

    const missingPrices = orderItems.some(
      (item) => !item.unit_price || item.unit_price <= 0
    );
    if (missingPrices) {
      toast.error("Vui lòng nhập đơn giá hợp lệ cho sản phẩm");
      return;
    }

    const validatedItems = orderItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      unit_price: parseFloat(item.unit_price) || 0,
      exportPrice: parseFloat(item.unit_price) || 0,
      profit:
        (parseFloat(item.unit_price) || 0 - item.importPrice) *
        (item.quantity || 1),
    }));
    const totalMoney = calculateTotal();
    const totalProfit = calculateTotalProfit();

    try {
      if (isEdit) {
        if (selectedPartner !== originalPartner) {
          await partnerApi.updateDebt(originalPartner, -totalMoney);
          await partnerApi.updateDebt(selectedPartner, totalMoney);
        }
        await updateOrderDetailsByOrderId(
          id,
          validatedItems.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            unit_price: i.unit_price,
            expireDate: i.expireDate
              ? new Date(i.expireDate).toISOString()
              : null,
          }))
        );
        await updateOrder(id, {
          partnerId: selectedPartner,
          orderTypeId: selectedOrderType,
          orderStatusId: selectedStatus,
          totalMoney,
          paidMoney: currentPaidMoney,
          profitMoney: totalProfit,
        });

        toast.success("Đã cập nhật đơn hàng");
      } else {
        const res = await createOrder({
          partnerId: selectedPartner,
          orderTypeId: selectedOrderType,
          profitMoney: totalProfit,
          totalMoney,
        });
        await createOrderDetails(
          validatedItems.map((i) => ({
            orderId: res.id,
            productId: i.id,
            quantity: i.quantity,
            unit_price: i.unit_price,
            expireDate: i.expireDate
              ? new Date(i.expireDate).toISOString()
              : null,
          }))
        );

        toast.success("Đã tạo đơn hàng thành công");
      }
      navigate("/dashboard/business/order-management");
    } catch (error) {
      console.error(
        "Lỗi khi lưu đơn hàng:",
        error.response?.data || error.message
      );
      toast.error("Có lỗi xảy ra khi lưu đơn hàng");
    }
  };

  const handleAddPartner = async (newPartner) => {
    try {
      await partnerApi.addPartner(newPartner);
      setIsPartnerModalOpen(false);
      toast.success("Đã thêm đối tác");
      const res = await partnerApi.getAllPartners(0, 100, "id", "asc");
      setPartners(res.content);
    } catch {
      toast.error("Không thể thêm đối tác");
    }
  };

  const handleProductSelect = (product) => {
    if (orderItems.find((i) => i.id === product.id)) {
      toast.info("Sản phẩm đã tồn tại");
      return;
    }

    // Tìm lô hàng mới nhất của sản phẩm
    const latestBatch = importBatches
      .filter((batch) => batch.productId === product.id)
      .sort((a, b) => new Date(b.importDate) - new Date(a.importDate))[0];

    const importPrice = latestBatch?.unitCost ?? 0;
    const exportPrice =
      selectedOrderType === "1" ? importPrice : product.exportPrice ?? 0;

    const newItem = {
      id: product.id,
      product: product.name,
      quantity: 1,
      unit_price: exportPrice,
      exportPrice: exportPrice,
      importPrice: importPrice,
      expireDate: "",
      profit: 0,
    };
    setOrderItems([...orderItems, newItem]);
    setIsProductModalOpen(false);
  };

  const handlePriceChange = (id, value) => {
    if (value === "") {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id
            ? {
                ...item,
                unit_price: "",
                exportPrice: "",
                profit: 0,
              }
            : item
        )
      );
      return;
    }
    const price = parseFloat(value);
    if (!isNaN(price) && price >= 0) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id
            ? {
                ...item,
                unit_price: price,
                exportPrice: price,
                profit:
                  selectedOrderType === "2"
                    ? (price - item.importPrice) * (item.quantity || 1)
                    : 0,
              }
            : item
        )
      );
    }
  };

  const handleExpireDateChange = (id, value) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id
          ? {
              ...item,
              expireDate: value,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter((i) => i.id !== id));
  };

  const handleQuantityChange = (id, value) => {
    if (value === "") {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: "",
                profit: 0,
              }
            : item
        )
      );
      return;
    }
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity,
                profit:
                  selectedOrderType === "2"
                    ? (item.unit_price - item.importPrice) * quantity
                    : 0,
              }
            : item
        )
      );
    }
  };

  const handleAddItem = () => {
    setIsProductModalOpen(true);
  };

  if (isEdit && isLoading)
    return (
      <div className="bg-gray-50 min-h-screen w-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      {!isEdit && (
        <TogglePartnerModal
          isOpen={isPartnerModalOpen}
          onClose={() => setIsPartnerModalOpen(false)}
          onSubmit={handleAddPartner}
          mode="add"
        />
      )}
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelect={handleProductSelect}
        selectedProducts={orderItems}
      />

      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard/business/order-management")}
            className="flex items-center justify-center text-gray-600 border border-gray-300 rounded-md p-2 hover:text-gray-800 mr-2 h-8 w-8"
          >
            <FaArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center leading-tight">
            {isEdit ? `Chỉnh sửa đơn hàng #${id}` : "Thêm đơn hàng mới"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đối tác
              </label>
              <div className="flex flex-col space-y-2">
                <select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50"
                  disabled={isEdit}
                >
                  <option value="">Chọn đối tác</option>
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name} - {partner.phone || "Không có SĐT"}
                    </option>
                  ))}
                </select>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setIsPartnerModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <FaPlus className="mr-1" /> Thêm mới đối tác
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại đơn hàng
              </label>
              <select
                value={selectedOrderType}
                onChange={(e) => setSelectedOrderType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn loại đơn hàng</option>
                {orderTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách sản phẩm
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaPlus className="mr-2" /> Thêm sản phẩm
              </button>
            </div>

            {orderItems.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Số lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Đơn giá
                      </th>
                      {(isPurchaseOrder || isEdit) && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ngày hết hạn{" "}
                          {isPurchaseOrder && (
                            <span className="text-red-500">*</span>
                          )}
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Thành tiền
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.product}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              min="1"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 text-blue-600 text-sm">
                            {isPurchaseOrder || isSalesOrder ? (
                              <input
                                type="number"
                                value={item.unit_price}
                                onChange={(e) =>
                                  handlePriceChange(item.id, e.target.value)
                                }
                                min="0"
                                className="w-32 px-2 py-1 border border-gray-300 rounded-md"
                              />
                            ) : (
                              item.unit_price?.toLocaleString()
                            )}
                          </td>
                          {(isPurchaseOrder || isEdit) && (
                            <td className="px-6 py-4">
                              <input
                                type="date"
                                value={item.expireDate}
                                onChange={(e) =>
                                  handleExpireDateChange(
                                    item.id,
                                    e.target.value
                                  )
                                }
                                className="w-40 px-2 py-1 border border-gray-300 rounded-md"
                                required={isPurchaseOrder}
                              />
                            </td>
                          )}
                          <td className="px-6 py-4 text-blue-600 text-sm">
                            {(
                              (item.unit_price || 0) * (item.quantity || 1)
                            ).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FaPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Chưa có sản phẩm nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bấm nút "Thêm sản phẩm" để bắt đầu
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-lg font-semibold">
              Tổng tiền:{" "}
              <span className="text-blue-600">
                {calculateTotal().toLocaleString()} VNĐ
              </span>
              {isEdit && (
                <div className="text-sm text-gray-600 mt-1">
                  Đã thanh toán:{" "}
                  <span className="text-green-600">
                    {currentPaidMoney.toLocaleString()} VNĐ
                  </span>
                </div>
              )}
            </div>
            <div className="space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/business/order-management")}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEdit ? "Cập nhật đơn hàng" : "Lưu đơn hàng"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
