import Table from "@/components/Dashboard/Table";
import React from "react";
import tableConfig from "@/configs/tableConfig";

const RoleUser = () => {
  const { title, tableData, columns } = tableConfig.role;

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

export default RoleUser;
