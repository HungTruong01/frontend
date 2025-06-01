import Table from "@/components/Dashboard/Table";
import React, { useState, useEffect } from "react";
import { getAllRoles, createRole, updateRole, deleteRole } from "@/api/roleApi";
import { toast } from "react-toastify";

const RoleUser = () => {
  const [roles, setRoles] = useState([]);

  const rolesColumns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Tên vai trò" },
  ];

  const addRoleFields = [
    {
      key: "name",
      label: "Tên vai trò",
      type: "text",
      required: true,
      placeholder: "Nhập tên vai trò",
    },
  ];

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles(0, 100, "id", "asc");
      setRoles(response.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vai trò:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async (newRole) => {
    try {
      await createRole(newRole);
      toast.success("Thêm vai trò thành công");
      fetchRoles();
    } catch (error) {
      console.error("Lỗi khi thêm vai trò:", error);
    }
  };

  const handleEditRole = async (editedRole) => {
    try {
      await updateRole(editedRole.id, editedRole);
      toast.success("Cập nhật vai trò thành công");
      fetchRoles();
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
    }
  };

  const handleDeleteRole = async (roleToDelete) => {
    try {
      await deleteRole(roleToDelete.id);
      toast.success("Xóa vai trò thành công");
      fetchRoles();
    } catch (error) {
      console.error("Lỗi khi xóa vai trò:", error);
    }
  };

  return (
    <div>
      <Table
        title={"Danh sách vai trò"}
        subtitle={"vai trò"}
        columns={rolesColumns}
        data={roles}
        addFields={addRoleFields}
        onAdd={handleAddRole}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
      />
    </div>
  );
};

export default RoleUser;
