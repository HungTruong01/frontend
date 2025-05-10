import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllOrderStatus,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
} from "@/api/orderStatusApi";
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
    { key: "id", label: "ID", required: false },
    { key: "name", label: "Trạng thái đơn hàng", required: true },
  ];
  const fetchOrderStatus = async () => {
    try {
      const response = await getAllOrderStatus();
      setOrderStatus(response.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách trạng thái đơn hàng:", error);
    }
  };
  const handleCreateOrderStatus = async (newOrderStatus) => {
    try {
      await createOrderStatus(newOrderStatus);
      fetchOrderStatus();
    } catch (error) {
      console.log("Error creating order status:", error);
    }
  };
  const handleUpdateOrderStatus = async (updatedOrderStatus) => {
    try {
      await updateOrderStatus(updatedOrderStatus.id, updatedOrderStatus);
      fetchOrderStatus();
    } catch (error) {
      console.log("Error updating order status:", error);
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
