import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllProductUnits,
  createProductUnit,
  updateProductUnit,
  deleteProductUnit,
} from "@/api/productUnitApi";
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
      // Lấy tất cả dữ liệu một lần
      const response = await getAllProductUnits(0, 1000, "id", "asc");
      setUnits(response.data.content || []);
    } catch (error) {
      console.error("Error fetching product units:", error);
    }
  };

  const handleAddUnit = async (newUnit) => {
    try {
      await createProductUnit(newUnit);
      fetchProductUnit();
    } catch (error) {
      console.log("Error adding product unit:", error);
    }
  };

  const handleEditUnit = async (updatedUnit) => {
    try {
      await updateProductUnit(updatedUnit.id, updatedUnit);
      fetchProductUnit();
    } catch (error) {
      console.log("Error updating product unit:", error);
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
        data={units} // Table sẽ tự handle phân trang
        columns={productUnitColumns}
        onAdd={handleAddUnit}
        onEdit={handleEditUnit}
        onDelete={handleDeleteUnit}
      />
    </div>
  );
};

export default UnitPage;
