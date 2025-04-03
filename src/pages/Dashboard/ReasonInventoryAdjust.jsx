import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  inventoryAdjustmentReasonsTableData,
  inventoryAdjustmentReasonColumns,
} from "@/data";
const ReasonInventoryAdjust = () => {
  const [reason, setReason] = useState(inventoryAdjustmentReasonsTableData);
  const addAccountFields = [
    {
      key: "reason",
      label: "Lý do điều chỉnh kho",
      type: "text",
      required: true,
      placeholder: "Nhập lý do điều chỉnh kho",
    },
  ];
  const formattedColumns = inventoryAdjustmentReasonColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Lý do điều chỉnh kho"}
        subtitle={"lý do điều chỉnh kho"}
        data={reason}
        addFields={addAccountFields}
        columns={formattedColumns}
      />
    </div>
  );
};

export default ReasonInventoryAdjust;
