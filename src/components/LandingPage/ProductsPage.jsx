import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import { getAllProducts } from "@/api/productApi";
import { getAllProductTypes } from "@/api/productTypeApi";

const ProductsPage = () => {
    const [products, setProducts] = useState([]); 
    const [productTypes, setProductTypes] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
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
                    category: getProductTypeNameById(product.productTypeId)
                }));
                setProducts(mappedProducts);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, productTypes]);

    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const response = await getAllProductTypes(0, 100, "id", "asc");
                setProductTypes(response.content);
            } catch (error) {
                console.error("Failed to fetch product types:", error);
            }
        };
        fetchProductTypes();
    }, []);

    const getProductTypeNameById = (id) => {
        const productType = productTypes.find((type) => type.id === id);
        return productType ? productType.name : "Chưa xác định";
    }
    
    return (
        <div className="w-full min-h-[80vh] bg-white flex flex-col items-center">
            <div className="max-w-7xl px-6 py-6 w-full">
                <h2 className="text-3xl font-semibold mb-2 text-center">Sản phẩm</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Cung cấp mọi loại hàng liên quan đến thực phẩm
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                {/* Phân trang */}
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
