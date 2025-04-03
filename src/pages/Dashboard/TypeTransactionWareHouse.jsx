import React, { useState } from "react";
import {
  warehouseTransactionTypesTableData,
  warehouseTransactionTypeColumns,
} from "@/data";
import Table from "@/components/Dashboard/Table";
const TypeTransactionWareHouse = () => {
  const [warehouseTransactionType, setWarehouseTransactionType] = useState(
    warehouseTransactionTypesTableData
  );
  const addAccountFields = [
    {
      key: "warehouseTransactionType",
      label: "Loại giao dịch kho",
      type: "text",
      required: true,
      placeholder: "Nhập loại giao dịch kho",
    },
  ];
  const formattedColumns = warehouseTransactionTypeColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Loại giao dịch kho"}
        subtitle={"loại giao dịch kho"}
        addFields={addAccountFields}
        data={warehouseTransactionType}
        columns={formattedColumns}
      />
    </div>
  );
};

export default TypeTransactionWareHouse;
