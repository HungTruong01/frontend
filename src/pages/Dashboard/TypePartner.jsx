import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import { partnerTypesTableData, partnerTypeColumns } from "@/data";
const TypePartner = () => {
  const [partnerType, setPartnerType] = useState(partnerTypesTableData);
  const addAccountFields = [
    {
      key: "partnerType",
      label: "Loại đối tác",
      type: "text",
      required: true,
      placeholder: "Nhập loại đối tác",
    },
  ];
  const formattedColumns = partnerTypeColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Loại đối tác"}
        subtitle={"loại đối tác"}
        data={partnerType}
        addFields={addAccountFields}
        columns={formattedColumns}
      />
    </div>
  );
};
export default TypePartner;
