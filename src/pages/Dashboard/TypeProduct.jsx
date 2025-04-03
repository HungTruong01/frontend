import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  productTypesTableData,
  productTypeColumns,
} from "@/data/productTypesTableData";
const TypeProduct = () => {
  const [typeProduct, setTypeProduct] = useState(productTypesTableData);
  const addAccountFields = [
    {
      key: "productTypeName",
      label: "Tên loại sản phẩm",
      type: "text",
      required: true,
      placeholder: "Nhập tên loại sản phẩm",
    },
  ];
  const formattedColumns = productTypeColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Loại sản phẩm"}
        subtitle={"loại sản phẩm"}
        addFields={addAccountFields}
        columns={formattedColumns}
        data={typeProduct}
      />
    </div>
  );
};

export default TypeProduct;
