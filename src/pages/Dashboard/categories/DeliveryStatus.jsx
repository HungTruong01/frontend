import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllDeliveryStatus,
  createDeliveryStatus,
  updateDeliveryStatus,
  deleteDeliveryStatus,
} from "@/api/deliveryStatusApi";
import { toast } from "react-toastify";
const DeliveryStatus = () => {
  const [delivery, setDelivery] = useState([]);
  const addDeliveryStatusFields = [
    {
      key: "name",
      label: "Trạng thái vận chuyển",
      type: "text",
      required: true,
      placeholder: "Nhập Trạng thái vận chuyển",
    },
  ];
  const columns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Trạng thái vận chuyển" },
  ];

  const fetchData = async () => {
    try {
      const response = await getAllDeliveryStatus(0, 100, "id", "asc");
      setDelivery(response.data.content);
    } catch (error) {
      console.error("Error fetching delivery status:", error);
    }
  };

  const handleAdd = async (data) => {
    try {
      await createDeliveryStatus(data);
      toast.success("Thêm trạng thái vận chuyển thành công!");
      fetchData();
    } catch (error) {
      console.error("Error adding delivery status:", error);
      toast.error("Lỗi khi thêm trạng thái vận chuyển!");
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateDeliveryStatus(data.id, data);
      toast.success("Cập nhật trạng thái vận chuyển thành công!");
      fetchData();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Lỗi khi cập nhật trạng thái vận chuyển!");
    }
  };

  const handleDelete = async (data) => {
    try {
      await deleteDeliveryStatus(data.id);
      fetchData();
    } catch (error) {
      console.error("Error deleting delivery status:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <Table
        title={"Trạng thái vận chuyển"}
        subtitle={"trạng thái vận chuyển"}
        data={delivery}
        addFields={addDeliveryStatusFields}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DeliveryStatus;
