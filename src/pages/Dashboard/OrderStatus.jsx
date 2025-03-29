import React from "react";
import tableConfig from "@/configs/tableConfig";
import Table from "@/components/Dashboard/Table";
const OrderStatus = () => {
  const { title, tableData, columns } = tableConfig["order-status"];

  const formattedColumns = columns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table title={title} data={tableData} columns={formattedColumns} />
    </div>
  );
};

export default OrderStatus;
