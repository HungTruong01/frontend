import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/api/accountApj";
import { FaSearch, FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import AddModal from "@/components/Dashboard/AddModal";
import EditModal from "@/components/Dashboard/EditModal";
import { toast } from "react-toastify";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [roles] = useState([
    { id: 1, name: "ADMIN", label: "ADMIN" },
    { id: 2, name: "ADMIN_KD", label: "Nhân viên kinh doanh" },
    { id: 3, name: "ADMIN_BLD", label: "Ban lãnh đạo" },
    { id: 4, name: "ADMIN_K", label: "Nhân viên XNK & kho vận" },
    { id: 5, name: "ADMIN_TCKT", label: "Nhân viên tài chính kế toán" },
  ]);
  const columns = ["Mã", "Tên đăng nhập", "Ngày tạo", "Vai trò"];

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const fetchAccounts = async (page = 1) => {
    try {
      const response = await getAllUsers(page - 1, 100, "id", "asc");
      setAccounts(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
      setTotalPages(0);
      setTotalElements(0);
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const keyword = searchTerm.toLowerCase();
    const usernameMatch = acc.username.toLowerCase().includes(keyword);
    const roleLabel =
      roles.find((r) => r.id === acc.roleId)?.label?.toLowerCase() ?? "";
    const roleMatch = roleLabel.includes(keyword);

    return usernameMatch || roleMatch;
  });

  const handleAddAccount = async (formData) => {
    try {
      const accountData = {
        username: formData.username,
        password: formData.password,
        roleId: parseInt(formData.roleId, 10),
      };
      await createAccount(accountData);
      toast.success("Thêm tài khoản thành công!");
      fetchAccounts();
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
    }
  };

  const handleEditAccount = async (accountId, formData) => {
    try {
      const roleId = parseInt(formData.roleId, 10);
      const accountData = {
        username: formData.username,
        password: formData.password || undefined,
        roleId: roleId,
      };
      await updateAccount(accountId, accountData);
      toast.success("Cập nhật tài khoản thành công!");
      fetchAccounts();
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
      toast.error("Cập nhật tài khoản thất bại!");
    }
  };

  const handleDeleteAccount = async (accountId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xoá tài khoản này?"
    );
    if (!confirmDelete) return;

    try {
      await deleteAccount(accountId);
      toast.success("Xoá tài khoản thành công!");
      fetchAccounts();
    } catch (error) {
      console.error("Lỗi khi xoá tài khoản:", error);
      toast.error("Xoá tài khoản thất bại!");
    }
  };

  useEffect(() => {
    fetchAccounts(currentPage);
  }, [currentPage]);

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
    key: "roleId",
    label: "Vai trò",
    type: "select",
    required: true,
    options: roles
      .filter((role) => role.label !== "ADMIN")
      .map((role) => ({
        value: role.id.toString(),
        label: role.label,
      })),
  },
];

  const editAccountFields = [
    {
      key: "username",
      label: "Tên đăng nhập",
      type: "text",
      required: true,
    },
    {
      key: "roleId",
      label: "Vai trò",
      type: "select",
      required: true,
      options: roles
      .filter((role) => role.label !== "ADMIN")
      .map((role) => ({
        value: role.id.toString(),
        label: role.label,
      })),
    },
  ];

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm mới tài khoản"
        fields={addAccountFields}
        onSubmit={handleAddAccount}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Sửa tài khoản"
        fields={editAccountFields}
        initialData={
          selectedAccount
            ? {
                username: selectedAccount.username,
                password: selectedAccount.password,
                roleId:
                  selectedAccount.role?.id?.toString() ??
                  selectedAccount.roleId?.toString(),
              }
            : {}
        }
        onSubmit={(formData) => {
          if (selectedAccount) {
            handleEditAccount(selectedAccount.id, formData);
            setIsEditModalOpen(false);
          }
        }}
      />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách tài khoản
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => {}}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <GoPlus className="h-5 w-5 mr-2" />
              Thêm mới
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="py-3 px-4 font-semibold whitespace-nowrap text-left"
                  >
                    {col}
                  </th>
                ))}
                <th className="py-3 px-4 font-semibold text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-left">{row.id}</td>
                  <td className="py-3 px-4 text-sm text-left">
                    {row.username}
                  </td>
                  <td className="py-3 px-4 text-sm text-left">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-sm text-left">
                    {roles.find((role) => role.id === row.roleId)?.label ||
                      row.roleId}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedAccount(row);
                          setIsEditModalOpen(true);
                        }}
                        className={`text-blue-500 hover:text-blue-700 transition-colors ${
                          row.roleId === 1 && "cursor-not-allowed opacity-50"
                        }`}
                        title="Sửa"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(row.id)}
                        className={`text-red-500 hover:text-red-700 transition-colors ${
                          row.roleId === 1 && "cursor-not-allowed opacity-50"
                        }`}
                        title="Xóa"
                        disabled={row.roleId === "ADMIN"}
                      >
                        <FaRegTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, totalElements)} của{" "}
            {totalElements} bản ghi
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Trước
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountList;
