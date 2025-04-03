import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import { orderTypesTableData, orderTypeColumns } from "@/data";
const TypeOrder = () => {
  const [orderType, setOrderType] = useState(orderTypesTableData);
  const addAccountFields = [
    {
      key: "orderType",
      label: "Loại đơn hàng",
      type: "text",
      required: true,
      placeholder: "Nhập loại đơn hàng",
    },
  ];
  const formattedColumns = orderTypeColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Loại đơn hàng"}
        subtitle={"loại đơn hàng"}
        addFields={addAccountFields}
        data={orderType}
        columns={formattedColumns}
      />
    </div>
  );
};

export default TypeOrder;
