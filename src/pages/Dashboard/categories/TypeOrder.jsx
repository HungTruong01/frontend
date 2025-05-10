import React, { useState, useEffect } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllOrderTypes,
  createOrderType,
  updateOrderType,
  deleteOrderType,
} from "@/api/orderTypeApi";
const TypeOrder = () => {
  const [orderType, setOrderType] = useState([]);
  const addOrderFields = [
    {
      key: "name",
      label: "Loại đơn hàng",
      type: "text",
      required: true,
      placeholder: "Nhập loại đơn hàng",
    },
  ];
  const orderTypeColumns = [
    { key: "id", label: "ID", required: false },
    { key: "name", label: "Tên loại đơn hàng", required: true },
  ];
  const fetchOrderType = async () => {
    try {
      const response = await getAllOrderTypes();
      setOrderType(response.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại đơn hàng:", error);
    }
  };

  const handleAddOrderType = async (newOrderType) => {
    try {
      await createOrderType(newOrderType);
      fetchOrderType();
    } catch (error) {
      console.error("Lỗi khi thêm loại đơn hàng:", error);
    }
  };

  const handleEditOrderType = async (updatedOrderType) => {
    try {
      await updateOrderType(updatedOrderType.id, updatedOrderType);
      fetchOrderType();
    } catch (error) {
      console.error("Lỗi khi sửa loại đơn hàng:", error);
    }
  };

  const handleDeleteOrderType = async (orderTypeId) => {
    try {
      await deleteOrderType(orderTypeId.id);
      fetchOrderType();
    } catch (error) {
      console.log("Xóa loại đơn hàng không thành công:", error);
    }
  };
  useEffect(() => {
    fetchOrderType();
  }, []);
  return (
    <div>
      <Table
        title={"Loại đơn hàng"}
        subtitle={"loại đơn hàng"}
        addFields={addOrderFields}
        data={orderType}
        columns={orderTypeColumns}
        onAdd={handleAddOrderType}
        onEdit={handleEditOrderType}
        onDelete={handleDeleteOrderType}
      />
    </div>
  );
};

export default TypeOrder;
