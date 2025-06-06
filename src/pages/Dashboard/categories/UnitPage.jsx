import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllProductUnits,
  createProductUnit,
  updateProductUnit,
  deleteProductUnit,
} from "@/api/productUnitApi";
import { toast } from "react-toastify";
const UnitPage = () => {
  const [units, setUnits] = useState([]);
  const addUnitFields = [
    {
      key: "name",
      label: "Tên đơn vị tính",
      type: "text",
      required: true,
      placeholder: "Nhập tên đơn vị tính",
    },
  ];
  const productUnitColumns = [
    { key: "id", label: "Mã" },
    { key: "name", label: "Tên đơn vị tính" },
  ];
  const fetchProductUnit = async () => {
    try {
      const response = await getAllProductUnits(0, 100, "id", "asc");
      setUnits(response.data.content || []);
    } catch (error) {
      console.error("Error fetching product units:", error);
    }
  };

  const handleAddUnit = async (newUnit) => {
    try {
      await createProductUnit(newUnit);
      toast.success("Thêm đơn vị tính thành công!");
      fetchProductUnit();
    } catch (error) {
      console.log("Error adding product unit:", error);
      toast.error("Lỗi khi thêm đơn vị tính!");
    }
  };

  const handleEditUnit = async (updatedUnit) => {
    try {
      await updateProductUnit(updatedUnit.id, updatedUnit);
      toast.success("Cập nhật đơn vị tính thành công!");
      fetchProductUnit();
    } catch (error) {
      console.log("Error updating product unit:", error);
      toast.error("Lỗi khi cập nhật đơn vị tính!");
    }
  };

  const handleDeleteUnit = async (unit) => {
    try {
      await deleteProductUnit(unit.id);
      fetchProductUnit();
    } catch (error) {
      console.log("Error deleting product unit:", error);
    }
  };

  useEffect(() => {
    fetchProductUnit();
  }, []);

  return (
    <div>
      <Table
        title="Đơn vị tính"
        subtitle="đơn vị tính"
        addFields={addUnitFields}
        data={units}
        columns={productUnitColumns}
        onAdd={handleAddUnit}
        onEdit={handleEditUnit}
        onDelete={handleDeleteUnit}
      />
    </div>
  );
};

export default UnitPage;
