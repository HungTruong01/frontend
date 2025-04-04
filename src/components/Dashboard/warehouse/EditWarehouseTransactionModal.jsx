import React, { useState } from "react";
import { FaTimes, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";

const EditWarehouseTransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [transactionData, setTransactionData] = useState({
    transactionCode: "",
    date: "",
    productName: "",
    quantity: "",
    price: "",
    totalAmount: "",
    warehouseName: "",
    status: "Đang xử lý",
    note: "",
    ...initialData,
  });

  const [orderItems, setOrderItems] = useState({
    orderId: "001",
    orderDate: "25-03-2025",
    partner: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      email: "nguyenvana@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      type: "customer",
    },
    orderType: "Đơn hàng nhập",
    status: "Chưa thanh toán",
    items: [
      {
        id: 1,
        productName: "Sản phẩm A",
        quantity: 10,
        unitPrice: 180000,
        total: 1800000,
      },
      {
        id: 2,
        productName: "Sản phẩm B",
        quantity: 5,
        unitPrice: 250000,
        total: 1250000,
      },
    ],
    totalAmount: 3050000,
    paymentStatus: "Chưa thanh toán",
    paidAmount: 0,
  });

  const [loading, setLoading] = useState(false);

  const increaseQuantity = (itemId) => {
    const updatedItems = orderItems.items.map((item) => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + 1;
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.unitPrice,
        };
      }
      return item;
    });

    const newTotalAmount = updatedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    setOrderItems({
      ...orderItems,
      items: updatedItems,
      totalAmount: newTotalAmount,
    });
  };

  // Hàm giảm số lượng sản phẩm
  const decreaseQuantity = (itemId) => {
    const updatedItems = orderItems.items.map((item) => {
      if (item.id === itemId && item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.unitPrice,
        };
      }
      return item;
    });

    const newTotalAmount = updatedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    setOrderItems({
      ...orderItems,
      items: updatedItems,
      totalAmount: newTotalAmount,
    });
  };

  // Hàm trực tiếp cập nhật số lượng
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) newQuantity = 1;

    const updatedItems = orderItems.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.unitPrice,
        };
      }
      return item;
    });

    const newTotalAmount = updatedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    setOrderItems({
      ...orderItems,
      items: updatedItems,
      totalAmount: newTotalAmount,
    });
  };

  // Hàm xóa sản phẩm
  const removeItem = (itemId) => {
    if (orderItems.items.length <= 1) {
      toast.warning("Cần có ít nhất một sản phẩm trong đơn hàng");
      return;
    }

    const updatedItems = orderItems.items.filter((item) => item.id !== itemId);
    const newTotalAmount = updatedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    setOrderItems({
      ...orderItems,
      items: updatedItems,
      totalAmount: newTotalAmount,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submittedData = {
        ...transactionData,
        quantity:
          transactionData.quantity === ""
            ? 0
            : parseInt(transactionData.quantity),
        price:
          transactionData.price === "" ? 0 : parseFloat(transactionData.price),
        totalAmount:
          transactionData.totalAmount === ""
            ? 0
            : parseFloat(transactionData.totalAmount),
        date: transactionData.date || new Date().toISOString().split("T")[0],
        // Thêm dữ liệu sản phẩm đã được cập nhật
        orderItems: orderItems,
      };
      await onSubmit(submittedData);
      toast.success("Cập nhật giao dịch kho thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật giao dịch kho");
      console.error("Error submitting warehouse transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sửa giao dịch kho
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã đơn hàng
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={orderItems.orderId}
              onChange={(e) =>
                setOrderItems({ ...orderItems, orderId: e.target.value })
              }
            >
              <option value="001">DH001</option>
              <option value="002">DH002</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kho
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={transactionData.warehouseName || ""}
              onChange={(e) =>
                setTransactionData({
                  ...transactionData,
                  warehouseName: e.target.value,
                })
              }
            >
              <option value="Kho An Lão">Kho An Lão</option>
              <option value="Kho Cát Hải">Kho Cát Hải</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={transactionData.status || "Đang xử lý"}
              onChange={(e) =>
                setTransactionData({
                  ...transactionData,
                  status: e.target.value,
                })
              }
            >
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại giao dịch
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={orderItems.orderType || "Đơn hàng nhập"}
              onChange={(e) =>
                setOrderItems({ ...orderItems, orderType: e.target.value })
              }
            >
              <option value="Đơn hàng nhập">Nhập kho</option>
              <option value="Đơn hàng xuất">Xuất kho</option>
              <option value="Đơn hàng chuyển">Chuyển kho</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chi tiết đơn hàng
            </label>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Danh sách sản phẩm
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Sản phẩm
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                        Số lượng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.items.map((item) => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="px-4 py-3">{item.productName}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-2">
                            {/* <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center"
                            >
                              <FaMinus className="h-3 w-3" />
                            </button> */}
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {/* <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center"
                            >
                              <FaPlus className="h-3 w-3" />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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

export default EditWarehouseTransactionModal;
