import React, { useState, useEffect } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllOrderTypes,
  createOrderType,
  updateOrderType,
  deleteOrderType,
} from "@/api/orderTypeApi";
import { toast } from "react-toastify";
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
    { key: "id", label: "Mã" },
    { key: "name", label: "Tên loại đơn hàng" },
  ];
  const fetchOrderType = async () => {
    try {
      const response = await getAllOrderTypes(0, 100, "id", "asc");
      setOrderType(response.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại đơn hàng:", error);
    }
  };

  const handleAddOrderType = async (newOrderType) => {
    try {
      await createOrderType(newOrderType);
      toast.success("Thêm loại đơn hàng thành công!");
      fetchOrderType();
    } catch (error) {
      console.error("Lỗi khi thêm loại đơn hàng:", error);
      toast.error("Lỗi khi thêm loại đơn hàng!");
    }
  };

  const handleEditOrderType = async (updatedOrderType) => {
    try {
      await updateOrderType(updatedOrderType.id, updatedOrderType);
      toast.success("Cập nhật loại đơn hàng thành công!");
      fetchOrderType();
    } catch (error) {
      console.error("Lỗi khi sửa loại đơn hàng:", error);
      toast.error("Lỗi khi sửa loại đơn hàng!");
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
