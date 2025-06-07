import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import TogglePartnerModal from "@/components/Dashboard/partner/TogglePartnerModal";
import ProductSelectionModal from "@/components/Dashboard/product/ProductSelectionModal";
import { addPartner } from "@/api/partnerApi";
import { createOrder, getOrderById, updateOrder } from "@/api/orderApi";
import {
  createOrderDetails,
  updateOrderDetailsByOrderId,
} from "@/api/orderDetailApi";
import { updateProduct } from "@/api/productApi";
import { toast } from "react-toastify";
import { getAllImportBatches } from "@/api/importBatch";
import { getAllPartnerTypes } from "@/api/partnerTypeApi";
import { fetchPartners } from "@/redux/slices/partnerSlice";
import { fetchOrderTypes } from "@/redux/slices/orderSlice";
import { fetchProducts } from "@/redux/slices/productSlice";

const OrderForm = ({ mode = "add" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const partners = useSelector((state) => state.partner.partners);
  const orderTypes = useSelector((state) => state.order.orderTypes);
  const products = useSelector((state) => state.product.products);

  const [orderItems, setOrderItems] = useState([]);
  const [partnerTypes, setPartnerTypes] = useState([]);
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
  const isPurchaseOrder = selectedOrderType === 1;
  const isSalesOrder = selectedOrderType === 2;

  useEffect(() => {
    if (!partners.length) dispatch(fetchPartners());
    if (!orderTypes.length) dispatch(fetchOrderTypes());
    if (!products.length) dispatch(fetchProducts());
    getAllImportBatches(0, 100, "importDate", "desc").then((batchesRes) => {
      setImportBatches(batchesRes.data?.content || []);
    });
    getAllPartnerTypes(0, 100, "id", "asc").then((typesRes) => {
      setPartnerTypes(typesRes.data.content || []);
    });
  }, [dispatch, partners.length, orderTypes.length, products.length]);

  useEffect(() => {
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
          const expireDate =
            detail.expireDate && !isNaN(new Date(detail.expireDate).getTime())
              ? new Date(detail.expireDate).toISOString().split("T")[0]
              : "";
          return {
            detailId: detail.id,
            id: detail.productId,
            product: product?.name || `SP #${detail.productId}`,
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            exportPrice: detail.unit_price,
            expireDate,
          };
        });
        setOrderItems(items);
      } catch {
        toast.error("Không thể tải dữ liệu đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };
    if (isEdit && products.length) fetchOrder();
    if (!isEdit) setIsLoading(false);
  }, [products, isEdit, id]);

  const validateForm = () => {
    if (!selectedOrderType || !selectedPartner || orderItems.length === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin đơn hàng");
      return false;
    }
    if (isPurchaseOrder && orderItems.some((item) => !item.expireDate)) {
      toast.error(
        "Vui lòng nhập ngày hết hạn cho tất cả sản phẩm trong đơn mua"
      );
      return false;
    }
    if (orderItems.some((item) => !item.unit_price || item.unit_price <= 0)) {
      toast.error("Vui lòng nhập đơn giá hợp lệ cho sản phẩm");
      return false;
    }
    if (orderItems.some((item) => !item.quantity || item.quantity <= 0)) {
      toast.error("Vui lòng nhập số lượng hợp lệ cho sản phẩm");
      return false;
    }
    return true;
  };

  const updateProductPrices = async (validatedItems) => {
    const tempProduct = Object.fromEntries(products.map((p) => [p.id, p]));

    for (const item of validatedItems) {
      const product = tempProduct[item.id];
      const newExportPrice = parseFloat(item.unit_price);

      if (product && product.exportPrice !== newExportPrice) {
        try {
          await updateProduct(item.id, {
            ...product,
            exportPrice: newExportPrice,
            price: newExportPrice,
          });
        } catch (err) {
          console.warn(`Lỗi cập nhật giá SP #${item.id}:`, err);
        }
      }
    }
  };

  const OrderPayload = () => {
    const validatedItems = orderItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      unit_price: parseFloat(item.unit_price) || 0,
    }));
    return validatedItems;
  };

  const calculateTotal = () =>
    orderItems.reduce((sum, i) => i.quantity * i.unit_price + sum, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const validatedItems = OrderPayload();
    const totalMoney = calculateTotal();

    try {
      if (isSalesOrder) await updateProductPrices(validatedItems);
      if (isEdit) {
        await updateOrderDetailsByOrderId(
          id,
          validatedItems.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            unit_price: i.unit_price,
            expireDate:
              isPurchaseOrder && i.expireDate
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
        });
        toast.success("Đã cập nhật đơn hàng");
      } else {
        const res = await createOrder({
          partnerId: selectedPartner,
          orderTypeId: selectedOrderType,
          totalMoney,
        });

        await createOrderDetails(
          validatedItems.map((i) => ({
            orderId: res.id,
            productId: i.id,
            quantity: i.quantity,
            unit_price: i.unit_price,
            expireDate:
              isPurchaseOrder && i.expireDate
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
      const partnerData = {
        name: newPartner.name,
        phone: newPartner.phone,
        email: newPartner.email,
        address: newPartner.address,
        partnerTypeId: parseInt(newPartner.type),
        organization: newPartner.organization,
        taxCode: newPartner.taxCode,
      };
      await addPartner(partnerData);
      setIsPartnerModalOpen(false);
      toast.success("Đã thêm đối tác");
      dispatch(fetchPartners());
    } catch {
      toast.error("Không thể thêm đối tác");
    }
  };

  const handleProductSelect = (selectedProducts) => {
    // Xử lý chọn nhiều sản phẩm
    if (Array.isArray(selectedProducts)) {
      const newItems = selectedProducts
        .map((product) => {
          // Kiểm tra nếu sản phẩm đã tồn tại trong đơn hàng
          if (orderItems.find((item) => item.id === product.id)) {
            return null;
          }

          // Tìm lô hàng mới nhất của sản phẩm
          const latestBatch = importBatches
            .filter((batch) => batch.productId === product.id)
            .sort((a, b) => new Date(b.importDate) - new Date(a.importDate))[0];

          const importPrice = latestBatch?.unitCost ?? 0;
          const exportPrice =
            selectedOrderType === 1 ? importPrice : product.exportPrice ?? 0;

          return {
            id: product.id,
            product: product.name,
            quantity: 1,
            unit_price: exportPrice,
            exportPrice: exportPrice,
            importPrice: importPrice,
            expireDate: "",
          };
        })
        .filter((item) => item !== null);

      if (newItems.length > 0) {
        setOrderItems([...orderItems, ...newItems]);
      } else {
        toast.info("Không có sản phẩm mới nào được thêm");
      }
    } else {
      const product = selectedProducts;
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
        selectedOrderType === 1 ? importPrice : product.exportPrice ?? 0;

      const newItem = {
        id: product.id,
        product: product.name,
        quantity: 1,
        unit_price: exportPrice,
        exportPrice: exportPrice,
        importPrice: importPrice,
        expireDate: "",
      };
      setOrderItems([...orderItems, newItem]);
    }
    setIsProductModalOpen(false);
  };

  const handlePriceChange = (id, value) => {
    const price = parseFloat(value);
    if (!isNaN(price) && price >= 0) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === id
            ? {
                ...item,
                unit_price: price,
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
    setOrderItems(
      orderItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: value === "" ? "" : parseInt(value),
            }
          : item
      )
    );
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
          partnerTypes={partnerTypes}
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
            className="flex items-center justify-center text-gray-600 border border-gray-300 rounded-md p-2 hover:text-gray-800 mr-2 h-8 w-8 mb-4"
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
                onChange={(e) => setSelectedOrderType(parseInt(e.target.value))}
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
                      {isPurchaseOrder && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ngày hết hạn <span className="text-red-500">*</span>
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
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) =>
                              handlePriceChange(item.id, e.target.value)
                            }
                            min="0"
                            step="1000"
                            className="w-32 px-2 py-1 border border-gray-300 rounded-md"
                          />
                        </td>
                        {isPurchaseOrder && (
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={item.expireDate}
                              onChange={(e) =>
                                handleExpireDateChange(item.id, e.target.value)
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
