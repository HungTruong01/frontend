import React, { useState } from "react";
import tableConfig from "@/configs/tableConfig";
import Table from "@/components/Dashboard/Table";

const ListPost = () => {
  const { title, tableData: initialData, columns } = tableConfig["posts-list"];

  // State để quản lý dữ liệu
  const [tableData, setTableData] = useState(initialData);
  // State để quản lý modal xem chi tiết
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  // State để lưu item đang xem chi tiết
  const [currentItem, setCurrentItem] = useState(null);

  // Định nghĩa các cột quan trọng muốn hiển thị
  const importantColumns = [
    "Mã bài đăng",
    "Tiêu đề",
    "Ngày đăng bài",
    "Cập nhật lần cuối",
  ]; // Thay đổi theo nhu cầu của bạn

  const formattedColumns = columns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));

  // Xử lý chỉnh sửa dữ liệu
  const handleEdit = (updatedItem) => {
    const updatedData = tableData.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setTableData(updatedData);

    // Ở đây bạn có thể thêm logic để gửi dữ liệu đến API
    console.log("Đã cập nhật dữ liệu:", updatedItem);
  };

  // Xử lý xem chi tiết
  const handleView = (item) => {
    console.log("Xem chi tiết:", item);
    setCurrentItem(item);
    setDetailModalOpen(true);
  };

  // Xử lý đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setCurrentItem(null);
  };

  // Xử lý xóa dữ liệu
  const handleDelete = (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${item.title}"?`)) {
      const updatedData = tableData.filter((data) => data.id !== item.id);
      setTableData(updatedData);

      // Ở đây bạn có thể thêm logic để gửi yêu cầu xóa đến API
      console.log("Đã xóa dữ liệu:", item);
    }
  };

  // Xử lý thêm mới
  const handleAddNew = (newItem) => {
    // Thêm ID cho mục mới (trong thực tế, ID thường được tạo bởi backend)
    const newItemWithId = {
      ...newItem,
      id: Math.max(...tableData.map((item) => item.id)) + 1,
    };

    setTableData([...tableData, newItemWithId]);

    // Ở đây bạn có thể thêm logic để gửi dữ liệu đến API
    console.log("Đã thêm dữ liệu mới:", newItemWithId);
  };

  return (
    <div>
      <Table
        title={title}
        data={tableData}
        columns={formattedColumns}
        visibleColumns={importantColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
        addFields={formattedColumns.map((col) => ({
          id: col.key,
          label: col.label,
          type: col.key === "id" ? "number" : "text",
        }))}
      />
    </div>
  );
};

export default ListPost;
