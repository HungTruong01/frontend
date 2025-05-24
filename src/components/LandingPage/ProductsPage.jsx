import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import ProductDetailTemplate from "./ProductDetailTemplate";
import { getAllProducts } from "@/api/productApi";
import { getAllProductTypes } from "@/api/productTypeApi";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await getAllProductTypes(0, 100, "id", "asc");
        setProductTypes(response.data.content);
      } catch (error) {
        console.error("Failed to fetch product types:", error);
      }
    };
    fetchProductTypes();
  }, []);

  useEffect(() => {
    if (productTypes.length === 0) return;

    const getProductTypeNameById = (id) => {
      const type = productTypes.find((t) => t.id === id);
      return type ? type.name : "Chưa xác định";
    };

    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(
          currentPage - 1,
          itemsPerPage,
          "id",
          "asc"
        );

        const mappedProducts = response.data.content.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.thumbnail,
          category: getProductTypeNameById(product.productTypeId),
        }));

        setProducts(mappedProducts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [currentPage, productTypes]);

  return (
    <div className="w-full min-h-[80vh] bg-white flex flex-col items-center">
      <div className="max-w-7xl px-6 py-6 w-full">
        <h2 className="text-3xl font-semibold mb-2 text-center">Sản phẩm</h2>
        <p className="text-gray-600 mb-6 text-center">
          Cung cấp mọi loại hàng liên quan đến thực phẩm
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} onClick={() => handleProductClick(product)}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailTemplate
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsPage;
