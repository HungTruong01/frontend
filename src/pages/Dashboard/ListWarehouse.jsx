import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/api/warehouseApi";
const ListWarehouse = () => {
  const [warehouse, setWarehouse] = useState([]);
  const addWarehouseFields = [
    {
      key: "name",
      label: "Kho bãi",
      type: "text",
      required: true,
      placeholder: "Nhập kho bãi",
    },
    {
      key: "address",
      label: "Địa chỉ",
      type: "text",
      required: true,
      placeholder: "Nhập địa chỉ",
    },
  ];
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Kho bãi" },
    { key: "address", label: "Địa chỉ" },
  ];

  const fetchData = async () => {
    try {
      const response = await getAllWarehouse();
      setWarehouse(response.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho bãi:", error);
    }
  };

  const handleAdd = async (data) => {
    try {
      await createWarehouse(data);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi thêm kho bãi:", error);
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateWarehouse(data.id, data);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi sửa kho bãi:", error);
    }
  };

  const handleDelete = async (data) => {
    try {
      await deleteWarehouse(data.id);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa kho bãi:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table
        title={"Danh sách kho bãi"}
        subtitle={"kho bãi"}
        data={warehouse}
        addFields={addWarehouseFields}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ListWarehouse;
