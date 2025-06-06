import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllOrderStatus,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
} from "@/api/orderStatusApi";
import { toast } from "react-toastify";
const OrderStatus = () => {
  const [orderStatus, setOrderStatus] = useState([]);
  const addOrderStatusFields = [
    {
      key: "name",
      label: "Trạng thái đơn hàng",
      type: "text",
      required: true,
      placeholder: "Nhập trạng thái đơn hàng",
    },
  ];
  const orderStatusColumns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Trạng thái đơn hàng" },
  ];
  const fetchOrderStatus = async () => {
    try {
      const response = await getAllOrderStatus(0, 100, "id", "asc");
      setOrderStatus(response.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách trạng thái đơn hàng:", error);
    }
  };
  const handleCreateOrderStatus = async (newOrderStatus) => {
    try {
      await createOrderStatus(newOrderStatus);
      toast.success("Thêm trạng thái đơn hàng thành công!");
      fetchOrderStatus();
    } catch (error) {
      console.log("Error creating order status:", error);
      toast.error("Lỗi khi thêm trạng thái đơn hàng!");
    }
  };
  const handleUpdateOrderStatus = async (updatedOrderStatus) => {
    try {
      await updateOrderStatus(updatedOrderStatus.id, updatedOrderStatus);
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      fetchOrderStatus();
    } catch (error) {
      console.log("Error updating order status:", error);
      toast.error("Lỗi khi cập nhật trạng thái đơn hàng!");
    }
  };

  const handleDeleteOrderStatus = async (orderStatusId) => {
    try {
      await deleteOrderStatus(orderStatusId.id);
      fetchOrderStatus();
    } catch (error) {
      console.log("Error deleting order status:", error);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
  }, []);
  return (
    <div>
      <Table
        title={"Trạng thái đơn hàng"}
        subtitle={"trạng thái đơn hàng"}
        data={orderStatus}
        addFields={addOrderStatusFields}
        columns={orderStatusColumns}
        onAdd={handleCreateOrderStatus}
        onEdit={handleUpdateOrderStatus}
        onDelete={handleDeleteOrderStatus}
      />
    </div>
  );
};

export default OrderStatus;
