import React, { useState } from "react";
import newsbanner from "../../assets/newsbanner.png";
import newsbanner2 from "../../assets/newsbanner2.png";
import newsbanner3 from "../../assets/newsbanner3.png";
import NewsCard from "./NewsCard";
import Pagination from "./Pagination";
import RecentPosts from "./RecentPosts";


const newsItems = [
    { id: 1, title: "Bí quyết tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Chi phí vận chuyển luôn là bài toán lớn...", link: "/news/food-logistics-optimization" },
    { id: 2, title: "Xu hướng nhập khẩu thực phẩm năm 2025", date: "23/02/2025", image: newsbanner2, excerpt: "Ngành thực phẩm nhập khẩu đang có...", link: "/news/food-import-trends" },
    { id: 3, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Chính sách kiểm định thực phẩm ngày càng siết chặt...", link: "/news/food-inspection-policy" },
    { id: 4, title: "Tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Làm thế nào để tối ưu chi phí mà vẫn đảm bảo chất lượng...", link: "/news/food-logistics-optimization" },
    { id: 5, title: "Xu hướng nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Phân tích những mặt hàng tiềm năng và quy trình bảo quản...", link: "/news/food-import-trends" },
    { id: 6, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Doanh nghiệp cần hiểu rõ các tiêu chuẩn kiểm tra...", link: "/news/food-inspection-policy" },
    { id: 7, title: "Chiến lược tối ưu logistics thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Cách lựa chọn tuyến đường vận tải tiết kiệm...", link: "/news/food-logistics-optimization" },
    { id: 8, title: "Những thách thức khi nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Quy định ngày càng chặt chẽ đối với hàng nhập khẩu...", link: "/news/food-import-trends" },
    { id: 9, title: "Tiêu chuẩn kiểm tra thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Các tiêu chuẩn quan trọng khi nhập khẩu thực phẩm...", link: "/news/food-inspection-policy" },
    { id: 10, title: "Bí quyết tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Chi phí vận chuyển luôn là bài toán lớn...", link: "/news/food-logistics-optimization" },
    { id: 11, title: "Xu hướng nhập khẩu thực phẩm năm 2025", date: "23/02/2025", image: newsbanner2, excerpt: "Ngành thực phẩm nhập khẩu đang có...", link: "/news/food-import-trends" },
    { id: 12, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Chính sách kiểm định thực phẩm ngày càng siết chặt...", link: "/news/food-inspection-policy" },
    { id: 13, title: "Tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Làm thế nào để tối ưu chi phí mà vẫn đảm bảo chất lượng...", link: "/news/food-logistics-optimization" },
    { id: 14, title: "Xu hướng nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Phân tích những mặt hàng tiềm năng và quy trình bảo quản...", link: "/news/food-import-trends" },
    { id: 15, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Doanh nghiệp cần hiểu rõ các tiêu chuẩn kiểm tra...", link: "/news/food-inspection-policy" },
    { id: 16, title: "Chiến lược tối ưu logistics thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Cách lựa chọn tuyến đường vận tải tiết kiệm...", link: "/news/food-logistics-optimization" },
    { id: 17, title: "Những thách thức khi nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Quy định ngày càng chặt chẽ đối với hàng nhập khẩu...", link: "/news/food-import-trends" },
    { id: 18, title: "Tiêu chuẩn kiểm tra thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Các tiêu chuẩn quan trọng khi nhập khẩu thực phẩm...", link: "/news/food-inspection-policy" },
];

const NewsPage = () => {

    // State quản lý trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Hiển thị 8 thẻ trên mỗi trang

    // Tính toán index của thẻ đầu và thẻ cuối trên mỗi trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center">
            <div className="max-w-6xl px-6 py-8 w-full">
                {/* Phần tin tức */}
                <h2 className="font-semibold text-3xl mb-2 text-center">Tin tức</h2>
                <p className="text-gray-600 mb-6 text-center">Thông tin xuất nhập khẩu, khuyến mãi và ưu đãi</p>

                {/* Danh sách tin tức */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {currentItems.map((item) => (
                        <NewsCard key={item.id} {...item} />
                    ))}
                </div>

                {/* Phân trang */}
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={Math.ceil(newsItems.length / itemsPerPage)}
                    />
                </div>

                {/* Recent News - Đưa xuống dưới */}
                <div className="mt-12 w-full">
                    {/* <h3 className="text-2xl font-semibold mb-4 text-center">Bài viết mới nhất</h3> */}
                    <RecentPosts />
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
