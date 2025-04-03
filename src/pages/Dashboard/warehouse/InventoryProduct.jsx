import React, { useState } from "react";
import Table from "@/components/Dashboard/Table";
import { inventoryProducts, inventoryColumns } from "@/data/inventoryProduct";

const ListReceipt = () => {
  const [inventoryProduct, setInventoryProducts] = useState(inventoryProducts);
  const formattedColumns = inventoryColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  return (
    <div>
      <Table
        title={"Sản phẩm tồn kho"}
        subtitle={"Sản phẩm tồn kho"}
        data={inventoryProduct}
        columns={formattedColumns}
      />
    </div>
  );
};

export default ListReceipt;
