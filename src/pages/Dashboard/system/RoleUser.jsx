import Table from "@/components/Dashboard/Table";
import React from "react";
import tableConfig from "@/configs/tableConfig";

const RoleUser = () => {
  const { title, tableData, columns } = tableConfig.role;
  const addAccountFields = [
    {
      key: "id",
      label: "Mã vai trò",
      type: "text",
      required: true,
      placeholder: "Nhập mã vai trò",
    },
    {
      key: "role",
      label: "Vai trò",
      type: "text",
      required: true,
      placeholder: "Nhập vai trò",
    },
  ];
  const formattedColumns = columns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));

  return (
    <div>
      <Table
        title={title}
        columns={formattedColumns}
        addFields={addAccountFields}
        data={tableData}
      />
    </div>
  );
};

export default RoleUser;
