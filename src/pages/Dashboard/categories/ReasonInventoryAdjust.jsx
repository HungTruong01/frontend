import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllInventoryAdjustmentType,
  createInventoryAdjustmentType,
  updateInventoryAdjustmentType,
  deleteInventoryAdjustmentType,
} from "@/api/inventoryAdjustmentTypesApi";
import { toast } from "react-toastify";

const ReasonInventoryAdjust = () => {
  const [reason, setReason] = useState([]);
  const addInventoryAdjustmentTypeFields = [
    {
      key: "name",
      label: "Lý do điều chỉnh kho",
      type: "text",
      required: true,
      placeholder: "Nhập lý do điều chỉnh kho",
    },
  ];
  const columns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Lý do điều chỉnh kho" },
  ];
  const fetchData = async () => {
    try {
      const response = await getAllInventoryAdjustmentType(0, 100, "id", "asc");
      setReason(response.content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddReason = async (reason) => {
    try {
      await createInventoryAdjustmentType(reason);
      toast.success("Thêm lý do điều chỉnh kho thành công!");
      fetchData();
    } catch (error) {
      console.error("Error adding reason:", error);
      toast.error("Lỗi khi thêm lý do điều chỉnh kho!");
    }
  };

  const handleEditReason = async (reason) => {
    try {
      await updateInventoryAdjustmentType(reason.id, reason);
      toast.success("Cập nhật lý do điều chỉnh kho thành công!");
      fetchData();
    } catch (error) {
      console.error("Error editing reason:", error);
      toast.error("Lỗi khi cập nhật lý do điều chỉnh kho!");
    }
  };

  const handleDeleteReason = async (reasonId) => {
    try {
      await deleteInventoryAdjustmentType(reasonId.id);
      fetchData();
    } catch (error) {
      console.error("Error deleting reason:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <Table
        title={"Lý do điều chỉnh kho"}
        subtitle={"lý do điều chỉnh kho"}
        data={reason}
        addFields={addInventoryAdjustmentTypeFields}
        columns={columns}
        onAdd={handleAddReason}
        onEdit={handleEditReason}
        onDelete={handleDeleteReason}
      />
    </div>
  );
};

export default ReasonInventoryAdjust;
