import React, { useEffect, useState } from "react";
import Table from "@/components/Dashboard/Table";
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "@/api/productTypeApi";
import { toast } from "react-toastify";
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
    { key: "id", label: "Mã" },
    { key: "name", label: "Tên loại sản phẩm" },
  ];

  const fetchTypeProduct = async () => {
    try {
      const response = await getAllProductTypes(0, 1000, "id", "asc");
      setTypeProduct(response.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
    }
  };

  const handleAddProductType = async (newProductType) => {
    try {
      await createProductType(newProductType);
      toast.success("Thêm loại sản phẩm thành công!");
      fetchTypeProduct();
    } catch (error) {
      console.error("Lỗi khi thêm loại sản phẩm:", error);
      toast.error("Lỗi khi thêm loại sản phẩm!");
    }
  };

  const handleEditProductType = async (updatedProductType) => {
    try {
      await updateProductType(updatedProductType.id, updatedProductType);
      toast.success("Cập nhật loại sản phẩm thành công!");
      fetchTypeProduct();
    } catch (error) {
      console.log("Lỗi khi cập nhật loại sản phẩm:", error);
      toast.error("Lỗi khi cập nhật loại sản phẩm!");
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
