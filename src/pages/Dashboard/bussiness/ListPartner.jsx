import React, { useState } from "react";
import tableConfig from "@/configs/tableConfig";
import Table from "@/components/Dashboard/Table";
const ListPartner = () => {
  const {
    title,
    tableData: initialData,
    columns,
  } = tableConfig["partner-list"];
  const [tableData, setTableData] = useState(initialData);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const importantColumns = [
    "Mã đối tác",
    "Tên đối tác",
    "Địa chỉ",
    "Công nợ",
    "Loại đối tác",
  ];

  const formattedColumns = columns.map((col) => ({
    key: col,
    label: col.charAt(0).toUpperCase() + col.slice(1),
  }));
  const handleEdit = (updatedItem) => {
    const updatedData = tableData.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setTableData(updatedData);
    console.log("Đã cập nhật dữ liệu:", updatedItem);
  };

  const handleView = (item) => {
    setCurrentItem(item);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setCurrentItem(null);
  };

  // Xử lý xóa dữ liệu
  const handleDelete = (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${item.title}"?`)) {
      const updatedData = tableData.filter((data) => data.id !== item.id);
      setTableData(updatedData);
      console.log("Đã xóa dữ liệu:", item);
    }
  };

  const handleAddNew = (newItem) => {
    const newItemWithId = {
      ...newItem,
      id: Math.max(...tableData.map((item) => item.id)) + 1,
    };

    setTableData([...tableData, newItemWithId]);
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

export default ListPartner;
