import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import { warehousesTableData, warehouseColumns } from "@/data";
const ListWarehouse = () => {
  const [warehouse, setWarehouse] = useState(warehousesTableData);
  const addAccountFields = [
    {
      key: "warehouse",
      label: "Kho bãi",
      type: "text",
      required: true,
      placeholder: "Nhập Kho bãi",
    },
  ];
  const formattedColumns = warehouseColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Danh sách kho bãi"}
        subtitle={"kho bãi"}
        data={warehouse}
        addFields={addAccountFields}
        columns={formattedColumns}
      />
    </div>
  );
};

export default ListWarehouse;
