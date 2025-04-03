import React, { useState } from "react";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";

const ProductsItem = [
    {
        id: 1,
        name: "Gạo ST25",
        description: "Gạo tươi ngon, đảm bảo chất lượng và an toàn thực phẩm.",
        imageUrl: "public/default-store-350x350.jpg",
        category: "Lương thực"
    },
    {
        id: 2,
        name: "Nước mắm Cát Hải",
        description: "Mắm thơm ngon từ các nguồn chăn nuôi an toàn, đảm bảo vệ sinh thực phẩm.",
        imageUrl: "public/default-store-350x350.jpg",
        category: "Gia vị"
    },
    {
        id: 3,
        name: "Dầu ăn cao cấp Tường An",
        description: "Dầu ăn cao cấp, đảm bảo an toàn sức khỏe.",
        imageUrl: "public/default-store-350x350.jpg",
        category: "Gia vị"
    },
    {
        id: 4,
        name: "Trái Cây Tươi",
        description: "Hoa quả tươi ngon, nhập khẩu và nội địa với chất lượng cao.",
        imageUrl: "public/default-store-350x350.jpg",
        category: "Trái cây"
    },
];

const ProductsPage = () => {
    // State quản lý trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Số sản phẩm trên mỗi trang

    // Tính toán index của sản phẩm đầu và cuối
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ProductsItem.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="w-full bg-white flex flex-col">
            <div className="container mx-auto px-6 py-6">
                {/* Tiêu đề */}
                <h2 className="text-3xl font-semibold mb-2 text-center">Sản phẩm</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Cung cấp mọi loại hàng liên quan đến thực phẩm
                </p>

                {/* Danh sách sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentItems.map((item) => (
                        <ProductCard key={item.id} {...item} />
                    ))}
                </div>

                {/* Phân trang */}
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={Math.ceil(ProductsItem.length / itemsPerPage)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
