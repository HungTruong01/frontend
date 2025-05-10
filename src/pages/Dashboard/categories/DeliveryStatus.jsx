import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllDeliveryStatus,
  createDeliveryStatus,
  updateDeliveryStatus,
  deleteDeliveryStatus,
} from "@/api/deliveryStatusApi";
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
    { key: "id", label: "ID", required: false },
    { key: "name", label: "Trạng thái vận chuyển", required: true },
  ];

  const fetchData = async () => {
    try {
      const response = await getAllDeliveryStatus();
      setDelivery(response.content);
    } catch (error) {
      console.error("Error fetching delivery status:", error);
    }
  };

  const handleAdd = async (data) => {
    try {
      await createDeliveryStatus(data);
      fetchData();
    } catch (error) {
      console.error("Error adding delivery status:", error);
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateDeliveryStatus(data.id, data);
      fetchData();
    } catch (error) {
      console.error("Error updating delivery status:", error);
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
