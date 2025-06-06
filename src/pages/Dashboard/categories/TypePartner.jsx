import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllPartnerTypes,
  createPartnerType,
  updatePartnerType,
  deletePartnerType,
} from "@/api/partnerTypeApi";
import { toast } from "react-toastify";
const TypePartner = () => {
  const [partnerType, setPartnerType] = useState([]);
  const addPartnerTypeFields = [
    {
      key: "name",
      label: "Loại đối tác",
      type: "text",
      required: true,
      placeholder: "Nhập loại đối tác",
    },
  ];
  const partnerTypeColumns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Loại đối tác" },
  ];
  const fetchTypePartner = async () => {
    try {
      const response = await getAllPartnerTypes(0, 100, "id", "asc");
      setPartnerType(response.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại đối tác:", error);
    }
  };

  const handleAddPartnerType = async (newPartnerType) => {
    try {
      await createPartnerType(newPartnerType);
      toast.success("Thêm loại đối tác thành công!");
      fetchTypePartner();
    } catch (error) {
      console.log("Lỗi khi thêm loại đối tác:", error);
      toast.error("Lỗi khi thêm loại đối tác!");
    }
  };

  const handleEditPartnerType = async (updatedPartnerType) => {
    try {
      await updatePartnerType(updatedPartnerType.id, updatedPartnerType);
      toast.success("Cập nhật loại đối tác thành công!");
      fetchTypePartner();
    } catch (error) {
      console.log("Lỗi khi cập nhật loại đối tác:", error);
      toast.error("Lỗi khi cập nhật loại đối tác!");
    }
  };

  const handleDeletePartnerType = async (partnerTypeId) => {
    try {
      await deletePartnerType(partnerTypeId.id);
      fetchTypePartner();
    } catch (error) {
      console.log("Lỗi khi xóa loại đối tác:", error);
    }
  };

  useEffect(() => {
    fetchTypePartner();
  }, []);
  return (
    <div>
      <Table
        title={"Loại đối tác"}
        subtitle={"loại đối tác"}
        data={partnerType}
        addFields={addPartnerTypeFields}
        columns={partnerTypeColumns}
        onAdd={handleAddPartnerType}
        onEdit={handleEditPartnerType}
        onDelete={handleDeletePartnerType}
      />
    </div>
  );
};
export default TypePartner;
