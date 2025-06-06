import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllWarehouseTransactionType,
  createWarehouseTransactionType,
  updateWarehouseTransactionType,
  deleteWarehouseTransactionType,
} from "@/api/warehouseTransactionTypeApi";
import { toast } from "react-toastify";
const TypeTransactionWareHouse = () => {
  const [warehouseTransactionType, setWarehouseTransactionType] = useState([]);
  const addWarehouseTransactionTypeFields = [
    {
      key: "name",
      label: "Loại giao dịch kho",
      type: "text",
      required: true,
      placeholder: "Nhập loại giao dịch kho",
    },
  ];
  const columns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Loại giao dịch kho" },
  ];
  const fetchData = async () => {
    try {
      const response = await getAllWarehouseTransactionType(
        0,
        100,
        "id",
        "asc"
      );
      setWarehouseTransactionType(response.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại giao dịch kho:", error);
    }
  };

  const handleAdd = async (data) => {
    try {
      await createWarehouseTransactionType(data);
      toast.success("Thêm loại giao dịch kho thành công!");
      fetchData();
    } catch (error) {
      console.error("Lỗi khi thêm loại giao dịch kho:", error);
      toast.error("Lỗi khi thêm loại giao dịch kho!");
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateWarehouseTransactionType(data.id, data);
      toast.success("Cập nhật loại giao dịch kho thành công!");
      fetchData();
    } catch (error) {
      console.error("Lỗi khi sửa loại giao dịch kho:", error);
      toast.error("Lỗi khi sửa loại giao dịch kho!");
    }
  };

  const handleDelete = async (data) => {
    try {
      await deleteWarehouseTransactionType(data.id);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa loại giao dịch kho:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <Table
        title={"Loại giao dịch kho"}
        subtitle={"loại giao dịch kho"}
        addFields={addWarehouseTransactionTypeFields}
        data={warehouseTransactionType}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TypeTransactionWareHouse;
