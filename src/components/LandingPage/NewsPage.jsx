import React, { useState } from "react";
import newsbanner from "../../assets/newsbanner.png";
import newsbanner2 from "../../assets/newsbanner2.png";
import newsbanner3 from "../../assets/newsbanner3.png";
import NewsCard from "./NewsCard";
import Pagination from "./Pagination";
import RecentPosts from "./RecentPosts";

const newsItems = [
    { id: 1, title: "Bí quyết tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Chi phí vận chuyển luôn là bài toán lớn Chi phí vận chuyển luôn là bài toán lớn Chi phí vận chuyển luôn là bài toán lớn Chi phí vận chuyển luôn là bài toán lớn...", link: "/news/food-logistics-optimization" },
    { id: 2, title: "Xu hướng nhập khẩu thực phẩm năm 2025", date: "23/02/2025", image: newsbanner2, excerpt: "Ngành thực phẩm nhập khẩu đang có...", link: "/news/food-import-trends" },
    { id: 3, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Chính sách kiểm định thực phẩm ngày càng siết chặt...", link: "/news/food-inspection-policy" },
    { id: 4, title: "Tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Làm thế nào để tối ưu chi phí mà vẫn đảm bảo chất lượng...", link: "/news/food-logistics-optimization" },
    { id: 5, title: "Xu hướng nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Phân tích những mặt hàng tiềm năng và quy trình bảo quản Phân tích những mặt hàng tiềm năng và quy trình bảo quản Phân tích những mặt hàng tiềm năng và quy trình bảo quản Phân tích những mặt hàng tiềm năng và quy trình bảo quản", link: "/news/food-import-trends" },
];

const NewsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="w-full min-h-[80vh] bg-white flex flex-col items-center">
            <div className="max-w-6xl px-6 py-6 w-full">

                {/* Tiêu đề trang tin tức */}
                <h2 className="font-semibold text-3xl mb-3 text-left md:text-center">
                    Tin tức
                </h2>
                <p className="text-gray-600 mb-5 text-left md:text-center">
                    Thông tin xuất nhập khẩu, khuyến mãi và ưu đãi
                </p>

                {/* Danh sách tin tức */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {currentItems.map((item) => (
                        <NewsCard key={item.id} {...item} />
                    ))}
                </div>

                {/* Phân trang */}
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={Math.ceil(newsItems.length / itemsPerPage)}
                    />
                </div>

                {/* Recent Posts */}
                <div className="mt-6 w-full">
                    <RecentPosts />
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
