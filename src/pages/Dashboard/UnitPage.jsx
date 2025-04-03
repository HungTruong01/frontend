import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import { unitsTableData, unitColumns } from "@/data";
const UnitPage = () => {
  const [unit, setUnit] = useState(unitsTableData);
  const addAccountFields = [
    {
      key: "unit",
      label: "Tên đơn vị tính",
      type: "text",
      required: true,
      placeholder: "Nhập tên đơn vị tính",
    },
  ];
  const formattedColumns = unitColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Đơn vị tính"}
        subtitle={"đơn vị tính"}
        addFields={addAccountFields}
        data={unit}
        columns={formattedColumns}
      />
    </div>
  );
};

export default UnitPage;
