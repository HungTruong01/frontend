import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import { orderStatusesTableData, orderStatusColumns } from "@/data";
const OrderStatus = () => {
  const [orderStatus, setOrderStatus] = useState(orderStatusesTableData);
  const addAccountFields = [
    {
      key: "orderStatus",
      label: "Trạng thái đơn hàng",
      type: "text",
      required: true,
      placeholder: "Nhập trạng thái đơn hàng",
    },
  ];
  const formattedColumns = orderStatusColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Trạng thái đơn hàng"}
        subtitle={"trạng thái đơn hàng"}
        data={orderStatus}
        addFields={addAccountFields}
        columns={formattedColumns}
      />
    </div>
  );
};

export default OrderStatus;
