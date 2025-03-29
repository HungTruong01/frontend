import React from "react";
import tableConfig from "@/configs/tableConfig";
import Table from "@/components/Dashboard/Table";
const TypeProduct = () => {
  const { title, tableData, columns } = tableConfig["type-products"];

  const formattedColumns = columns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table title={title} columns={formattedColumns} data={tableData} />
    </div>
  );
};

export default TypeProduct;
