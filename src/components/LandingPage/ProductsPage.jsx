import React, { useState } from "react";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";

const ProductsItem = [
    {
        id: 1,
        name: "Rau Củ Tươi",
        description: "Cung cấp các loại rau củ tươi ngon, đảm bảo chất lượng và an toàn thực phẩm.",
        imageUrl: "/images/fresh-vegetables.jpg",
        category: "Rau củ"
    },
    {
        id: 2,
        name: "Thịt Tươi",
        description: "Thịt tươi sạch từ các nguồn chăn nuôi an toàn, đảm bảo vệ sinh thực phẩm.",
        imageUrl: "/images/fresh-meat.jpg",
        category: "Thịt"
    },
    {
        id: 3,
        name: "Hải Sản Tươi",
        description: "Hải sản tươi sống, đánh bắt trực tiếp và bảo quản đúng tiêu chuẩn.",
        imageUrl: "/images/fresh-seafood.jpg",
        category: "Hải sản"
    },
    {
        id: 4,
        name: "Trái Cây Tươi",
        description: "Hoa quả tươi ngon, nhập khẩu và nội địa với chất lượng cao.",
        imageUrl: "/images/fresh-fruits.jpg",
        category: "Trái cây"
    },
    {
        id: 5,
        name: "Sữa và Sản Phẩm Sữa",
        description: "Các loại sữa tươi, sữa chua, phô mai và sản phẩm từ sữa chất lượng cao.",
        imageUrl: "/images/dairy-products.jpg",
        category: "Sữa & chế phẩm"
    },
    {
        id: 6,
        name: "Thực Phẩm Chế Biến Sẵn",
        description: "Thực phẩm tiện lợi, chế biến sẵn giúp tiết kiệm thời gian nấu nướng.",
        imageUrl: "/images/processed-foods.jpg",
        category: "Thực phẩm chế biến"
    },
    {
        id: 7,
        name: "Rau Củ Tươi",
        description: "Cung cấp các loại rau củ tươi ngon, đảm bảo chất lượng và an toàn thực phẩm.",
        imageUrl: "/images/fresh-vegetables.jpg",
        category: "Rau củ"
    },
    {
        id: 8,
        name: "Thịt Tươi",
        description: "Thịt tươi sạch từ các nguồn chăn nuôi an toàn, đảm bảo vệ sinh thực phẩm.",
        imageUrl: "/images/fresh-meat.jpg",
        category: "Thịt"
    },
    {
        id: 9,
        name: "Hải Sản Tươi",
        description: "Hải sản tươi sống, đánh bắt trực tiếp và bảo quản đúng tiêu chuẩn.",
        imageUrl: "/images/fresh-seafood.jpg",
        category: "Hải sản"
    },
    {
        id: 10,
        name: "Trái Cây Tươi",
        description: "Hoa quả tươi ngon, nhập khẩu và nội địa với chất lượng cao.",
        imageUrl: "/images/fresh-fruits.jpg",
        category: "Trái cây"
    },
    {
        id: 11,
        name: "Sữa và Sản Phẩm Sữa",
        description: "Các loại sữa tươi, sữa chua, phô mai và sản phẩm từ sữa chất lượng cao.",
        imageUrl: "/images/dairy-products.jpg",
        category: "Sữa & chế phẩm"
    },
    {
        id: 13,
        name: "Thực Phẩm Chế Biến Sẵn",
        description: "Thực phẩm tiện lợi, chế biến sẵn giúp tiết kiệm thời gian nấu nướng.",
        imageUrl: "/images/processed-foods.jpg",
        category: "Thực phẩm chế biến"
    },
    {
        id: 14,
        name: "Thực Phẩm Chế Biến Sẵn",
        description: "Thực phẩm tiện lợi, chế biến sẵn giúp tiết kiệm thời gian nấu nướng.",
        imageUrl: "/images/processed-foods.jpg",
        category: "Thực phẩm chế biến"
    }
];

const ProductsPage = () => {

    // State quản lý trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Hiển thị 8 thẻ trên mỗi trang

    // Tính toán index của thẻ đầu và thẻ cuối trên mỗi trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ProductsItem.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="w-full min-h-screen bg-white flex items-center justify-center">
            <div className="max-w-6xl px-6 py-8 w-full">
                {/* Phần tin tức */}
                <div className="w-full pr-6">
                    <h2 className="font-semibold text-3xl mb-2">Sản phẩm</h2>
                    <p className="text-gray-600 mb-6">Cung cấp mọi loại hàng liên quan đến thực phẩm</p>

                    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6 justify-center">
                        {currentItems.map((item) => (
                            <ProductCard key={item.id} {...item} />
                        ))}
                    </div>

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
