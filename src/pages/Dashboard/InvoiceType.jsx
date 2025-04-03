import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import { invoiceTypeTableData, invoiceTypeColumns } from "@/data/InvoiceType";
const InvoiceType = () => {
  const [invoiceType, setInvoiceType] = useState(invoiceTypeTableData);
  const addAccountFields = [
    {
      key: "invoiceType",
      label: "Loại hoá đơn",
      type: "text",
      required: true,
      placeholder: "Nhập loại hoá đơn",
    },
  ];
  const formattedColumns = invoiceTypeColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Loại hoá đơn"}
        subtitle={"loại hoá đơn"}
        addFields={addAccountFields}
        data={invoiceType}
        columns={formattedColumns}
      />
    </div>
  );
};

export default InvoiceType;
