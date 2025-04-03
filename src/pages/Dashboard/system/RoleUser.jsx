import Table from "@/components/Dashboard/Table";
import React, { useState } from "react";
import { rolesTableData, rolesColumns } from "@/data/rolesTableData";

const RoleUser = () => {
  const [role, setRole] = useState(rolesTableData);
  const addAccountFields = [
    {
      key: "role",
      label: "Vai trò",
      type: "text",
      required: true,
      placeholder: "Nhập vai trò",
    },
  ];
  const formattedColumns = rolesColumns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));

  return (
    <div>
      <Table
        title={"Danh sách vai trò"}
        subtitle={"vai trò"}
        columns={formattedColumns}
        addFields={addAccountFields}
        data={role}
      />
    </div>
  );
};

export default RoleUser;
