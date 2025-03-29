import React from "react";
import Table from "@/components/Dashboard/Table";
import tableConfig from "@/configs/tableConfig";
const AdjustInventory = () => {
  const { title, tableData, columns } = tableConfig["adjust-inventory"];

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

export default AdjustInventory;
