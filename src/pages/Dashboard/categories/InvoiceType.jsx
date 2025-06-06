import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllInvoiceTypes,
  createInvoiceType,
  updateInvoiceType,
  deleteInvoiceType,
} from "@/api/invoiceTypeApi";
import { toast } from "react-toastify";
const InvoiceType = () => {
  const [invoiceType, setInvoiceType] = useState([]);
  const addAccountFields = [
    {
      key: "name",
      label: "Loại hoá đơn",
      type: "text",
      required: true,
      placeholder: "Nhập loại hoá đơn",
    },
  ];
  const invoiceTypeColumns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Loại hoá đơn" },
  ];
  const fetchInvoiceType = async () => {
    try {
      const response = await getAllInvoiceTypes(0, 100, "id", "asc");
      setInvoiceType(response.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại hoá đơn:", error);
    }
  };

  const handleAddInvoiceType = async (newInvoiceType) => {
    try {
      await createInvoiceType(newInvoiceType);
      toast.success("Thêm loại hoá đơn thành công!");
      fetchInvoiceType();
    } catch (error) {
      console.error("Lỗi khi thêm loại hoá đơn:", error);
      toast.error("Lỗi khi thêm loại hoá đơn!");
    }
  };

  const handleEditInvoiceType = async (updatedInvoiceType) => {
    try {
      await updateInvoiceType(updatedInvoiceType.id, updatedInvoiceType);
      toast.success("Cập nhật loại hoá đơn thành công!");
      fetchInvoiceType();
    } catch (error) {
      console.log("Lỗi khi cập nhật loại hoá đơn:", error);
      toast.error("Lỗi khi cập nhật loại hoá đơn!");
    }
  };

  const handleDeleteInvoiceType = async (invoiceType) => {
    try {
      await deleteInvoiceType(invoiceType.id);
      fetchInvoiceType();
    } catch (error) {
      console.log("Lỗi khi xóa loại hoá đơn:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceType();
  }, []);
  return (
    <div>
      <Table
        title={"Loại hoá đơn"}
        subtitle={"loại hoá đơn"}
        addFields={addAccountFields}
        data={invoiceType}
        columns={invoiceTypeColumns}
        onAdd={handleAddInvoiceType}
        onEdit={handleEditInvoiceType}
        onDelete={handleDeleteInvoiceType}
      />
    </div>
  );
};

export default InvoiceType;
