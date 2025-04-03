import React, { useState } from "react";
import { accountsTableData, accountColumns } from "@/data/accountsTableData";
import Table from "@/components/Dashboard/Table";

const AccountList = () => {
  const [accounts, setAccounts] = useState(accountsTableData);

  const formattedColumns = accountColumns.map((col) => ({
    key: col,
    label: col
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
  }));

  const addAccountFields = [
    {
      key: "username",
      label: "Tên đăng nhập",
      type: "text",
      required: true,
      placeholder: "Nhập tên đăng nhập",
    },
    {
      key: "password",
      label: "Mật khẩu",
      type: "password",
      required: true,
      placeholder: "Nhập mật khẩu",
    },
    {
      key: "status",
      label: "Vai trò",
      type: "select",
      required: true,
      options: [
        { value: "Admin", label: "Admin" },
        { value: "Ban lãnh đạo", label: "Ban lãnh đạo" },
        { value: "Nhân viên kinh doanh", label: "Nhân viên kinh doanh" },
        {
          value: "Nhân viên tài chính kế toán",
          label: "Nhân viên tài chính kế toán",
        },
        { value: "Nhân viên kho vận", label: "Nhân viên kho vận" },
      ],
    },
  ];

  return (
    <div>
      <Table
        title="Danh sách tài khoản"
        subtitle="tài khoản"
        columns={formattedColumns}
        data={accounts}
        addFields={addAccountFields}
      />
    </div>
  );
};

export default AccountList;
