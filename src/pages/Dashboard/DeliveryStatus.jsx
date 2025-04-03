import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import { deliveryStatusData, deliveryColumns } from "@/data/DeliveryStatus";
const DeliveryStatus = () => {
  const [delivery, setDelivery] = useState(deliveryStatusData);
  const addAccountFields = [
    {
      key: "deliveryStatus",
      label: "Trạng thái vận chuyển",
      type: "text",
      required: true,
      placeholder: "Nhập Trạng thái vận chuyển",
    },
  ];
  const formattedColumns = deliveryColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Trạng thái vận chuyển"}
        subtitle={"trạng thái vận chuyển"}
        data={delivery}
        addFields={addAccountFields}
        columns={formattedColumns}
      />
    </div>
  );
};

export default DeliveryStatus;
