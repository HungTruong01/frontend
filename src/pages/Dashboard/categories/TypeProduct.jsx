import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "@/api/productTypeApi";
const TypeProduct = () => {
  const [typeProduct, setTypeProduct] = useState([]);
  const addProductTypeField = [
    {
      key: "name",
      label: "Tên loại sản phẩm",
      type: "text",
      required: true,
      placeholder: "Nhập tên loại sản phẩm",
    },
  ];
  const typeProductColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên loại sản phẩm" },
  ];

  const fetchTypeProduct = async () => {
    try {
      const response = await getAllProductTypes();
      setTypeProduct(response.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
    }
  };

  const handleAddProductType = async (newProductType) => {
    try {
      await createProductType(newProductType);
      fetchTypeProduct();
    } catch (error) {
      console.error("Lỗi khi thêm loại sản phẩm:", error);
    }
  };

  const handleEditProductType = async (updatedProductType) => {
    try {
      await updateProductType(updatedProductType.id, updatedProductType);
      fetchTypeProduct();
    } catch (error) {
      console.log("Lỗi khi cập nhật loại sản phẩm:", error);
    }
  };

  const handleDeleteProductType = async (productType) => {
    try {
      await deleteProductType(productType.id);
      fetchTypeProduct();
    } catch (error) {
      console.log("Lỗi khi xóa loại sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchTypeProduct();
  }, []);
  return (
    <div>
      <Table
        title={"Loại sản phẩm"}
        subtitle={"loại sản phẩm"}
        columns={typeProductColumns}
        addFields={addProductTypeField}
        data={typeProduct}
        onAdd={handleAddProductType}
        onEdit={handleEditProductType}
        onDelete={handleDeleteProductType}
      />
    </div>
  );
};

export default TypeProduct;
