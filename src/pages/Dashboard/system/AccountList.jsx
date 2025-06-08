import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/api/accountApj";
import { getAllRoles } from "@/api/roleApi";
import { FaSearch, FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import AddModal from "@/components/Dashboard/AddModal";
import EditModal from "@/components/Dashboard/EditModal";
import { toast } from "react-toastify";
import { Pagination } from "@/utils/pagination";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const columns = ["Mã", "Tên đăng nhập", "Ngày tạo", "Vai trò"];

  const fetchData = async () => {
    try {
      const [account, role] = await Promise.all([
        getAllUsers(0, 100, "id", "asc"),
        getAllRoles(0, 100, "id", "asc"),
      ]);
      setAccounts(account.data.content || []);
      setRoles(role.content || []);
      setTotalPages(account.data.totalPages || 0);
      setTotalElements(account.data.totalElements || 0);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAccounts = accounts.filter((acc) => {
    const keyword = searchTerm.toLowerCase();
    const usernameMatch = acc.username.toLowerCase().includes(keyword);
    const roleLabel =
      roles.find((r) => r.id === acc.roleId)?.label?.toLowerCase() ?? "";
    const roleMatch = roleLabel.includes(keyword);

    return usernameMatch || roleMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Không xác định";
  };

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
        .filter((role) => role.name !== "ROLE_ADMIN")
        .map((role) => ({
          value: role.id.toString(),
          label: role.name,
        })),
    },
  ];

  const editAccountFields = [
    {
      key: "username",
      label: "Tên đăng nhập",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      key: "roleId",
      label: "Vai trò",
      type: "select",
      required: true,
      options: roles
        .filter((role) => role.name !== "ROLE_ADMIN")
        .map((role) => ({
          value: role.id.toString(),
          label: role.name,
        })),
    },
  ];

  const handleAddAccount = async (formData) => {
    try {
      const accountData = {
        username: formData.username,
        password: formData.password,
        roleId: parseInt(formData.roleId, 10),
      };
      await createAccount(accountData);
      toast.success("Thêm tài khoản thành công!");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Thêm tài khoản thất bại!");
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
      fetchData();
    } catch (error) {
      console.log(error);
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
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xoá tài khoản:", error);
      toast.error("Xoá tài khoản thất bại!");
    }
  };

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
              {filteredAccounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-left">{account.id}</td>
                  <td className="py-3 px-4 text-sm text-left">
                    {account.username}
                  </td>
                  <td className="py-3 px-4 text-sm text-left">
                    {formatDate(account.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-sm text-left">
                    {getRoleName(account.roleId)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsEditModalOpen(true);
                        }}
                        className={`text-blue-500 hover:text-blue-700 transition-colors ${
                          account.roleId === 1 &&
                          "cursor-not-allowed opacity-50"
                        }`}
                        title="Sửa"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className={`text-red-500 hover:text-red-700 transition-colors ${
                          account.roleId === 1 &&
                          "cursor-not-allowed opacity-50"
                        }`}
                        title="Xóa"
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxPagesToShow={3}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountList;
