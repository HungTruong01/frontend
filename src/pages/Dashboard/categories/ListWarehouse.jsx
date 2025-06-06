import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/api/warehouseApi";
import { toast } from "react-toastify";
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
    { key: "id", label: "Mã" },
    { key: "address", label: "Địa chỉ" },
    { key: "name", label: "Tên kho" },
  ];

  const fetchData = async () => {
    try {
      const response = await getAllWarehouse(0, 100, "id", "asc");
      setWarehouse(response.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho bãi:", error);
    }
  };

  const handleAdd = async (data) => {
    try {
      await createWarehouse(data);
      toast.success("Thêm kho bãi thành công!");
      fetchData();
    } catch (error) {
      console.error("Lỗi khi thêm kho bãi:", error);
      toast.error("Lỗi khi thêm kho bãi!");
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateWarehouse(data.id, data);
      toast.success("Sửa kho bãi thành công!");
      fetchData();
    } catch (error) {
      console.error("Lỗi khi sửa kho bãi:", error);
      toast.error("Lỗi khi sửa kho bãi!");
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
