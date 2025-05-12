import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
} from "@/api/employeeApi";

const ListEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const addEmployeeFields = [
    {
      key: "fullname",
      label: "Họ tên nhân viên",
      type: "text",
      required: true,
      placeholder: "Nhập họ tên nhân viên",
    },
    {
      key: "address",
      label: "Địa chỉ",
      type: "text",
      required: true,
      placeholder: "Nhập địa chỉ",
    },
    {
      key: "phoneNumber",
      label: "Số điện thoại",
      type: "text",
      required: true,
      placeholder: "Nhập số điện thoại",
    },
  ];
  const columns = [
    { key: "id", label: "Mã" },
    { key: "fullname", label: "Họ tên nhân viên" },
    { key: "phoneNumber", label: "Số điện thoại" },
    { key: "address", label: "Địa chỉ" },
  ];
  const fetchData = async () => {
    try {
      const response = await getAllEmployees(0, 100, "id", "asc");
      setEmployees(response.data.content);
    } catch (error) {
      console.error("Error fetching all employees", error);
    }
  };

  const handleAdd = async (data) => {
    try {
      await createEmployee(data);
      fetchData();
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateEmployee(data.id, data);
      fetchData();
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  const handleDelete = async (data) => {
    try {
      await deleteEmployee(data.id);
      fetchData();
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <Table
        title={"Danh sách nhân viên"}
        subtitle={"nhân viên"}
        data={employees}
        addFields={addEmployeeFields}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ListEmployees;
