import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/api/employeeApi";
import { toast } from "react-toastify";

const ListEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const addEmployeeFields = [
    {
      key: "fullname",
      label: "Họ và tên",
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
    { key: "fullname", label: "Họ và tên" },
    { key: "phoneNumber", label: "Số điện thoại" },
    { key: "address", label: "Địa chỉ" },
  ];
  const fetchData = async () => {
    try {
      const response = await getAllEmployees(0, 1000, "id", "asc");
      setEmployees(response.data.content);
    } catch (error) {
      console.error("Error fetching all employees", error);
    }
  };

  const handleAdd = async (data) => {
    try {
      await createEmployee(data);
      toast.success("Thêm nhân viên thành công");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data || "Không thể thêm nhân viên!!!");
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateEmployee(data.id, data);
      toast.success("Sửa thông tin nhân viên thành công");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data || "Không thể sửa thông tin nhân viên!!!");
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
