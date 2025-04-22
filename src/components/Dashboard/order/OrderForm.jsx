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
import { getAllProducts } from "@/api/productApi";
import { toast } from "react-toastify";

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

  const isEdit = mode === "edit" && id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnerRes, typeRes, productRes] = await Promise.all([
          partnerApi.getAllPartners(0, 100, "id", "asc"),
          getAllOrderTypes(),
          getAllProducts(0, 100, "id", "asc"),
        ]);
        setPartners(partnerRes.content || []);
        setOrderTypes(typeRes.content || []);
        setProducts(productRes.data?.content || []);
      } catch (err) {
        toast.error("Lỗi tải dữ liệu cơ bản");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit && products.length) fetchOrder();
  }, [products]);

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
          price: detail.price ?? product?.price ?? 0,
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
    orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartner || !selectedOrderType || orderItems.length === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin và thêm sản phẩm");
      return;
    }
    const totalMoney = calculateTotal();

    try {
      if (isEdit) {
        if (selectedPartner !== originalPartner) {
          await partnerApi.updateDebt(originalPartner, -totalMoney);
          await partnerApi.updateDebt(selectedPartner, totalMoney);
        }
        await updateOrderDetailsByOrderId(
          id,
          orderItems.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          }))
        );
        await updateOrder(id, {
          partnerId: selectedPartner,
          orderTypeId: selectedOrderType,
          orderStatusId: selectedStatus,
          totalMoney,
          paidMoney: currentPaidMoney,
        });
        toast.success("Đã cập nhật đơn hàng");
      } else {
        const res = await createOrder({
          partnerId: selectedPartner,
          orderTypeId: selectedOrderType,
          totalMoney,
        });
        await createOrderDetails(
          orderItems.map((i) => ({
            orderId: res.id,
            productId: i.id,
            quantity: i.quantity,
          }))
        );
        toast.success("Đã tạo đơn hàng thành công");
      }
      navigate("/dashboard/business/order-management");
    } catch {
      toast.error("Có lỗi xảy ra khi lưu đơn hàng");
    }
  };

  const handleAddPartner = async (newPartner) => {
    try {
      await partnerApi.addPartner(newPartner);
      await setIsPartnerModalOpen(false);
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
    setOrderItems([
      ...orderItems,
      {
        id: product.id,
        product: product.name,
        quantity: 1,
        price: product.price,
      },
    ]);
    setIsProductModalOpen(false);
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter((i) => i.id !== id));
  };

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleAddItem = () => {
    setIsProductModalOpen(true);
  };

  if (isEdit && isLoading)
    return <div className="p-6">Đang tải dữ liệu...</div>;

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
            className="flex items-center text-gray-600 border border-gray-300 rounded-md p-1 hover:text-gray-800 mr-2"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Thành tiền
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.map((item) => (
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
                          {item.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-blue-600 text-sm">
                          {(item.price * item.quantity).toLocaleString()}
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
                    ))}
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
