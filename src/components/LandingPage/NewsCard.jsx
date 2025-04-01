import React from "react";
import { Link, useNavigate } from "react-router-dom";
import newsbanner from "../../assets/newsbanner.png";
import newsbanner2 from "../../assets/newsbanner2.png";
import newsbanner3 from "../../assets/newsbanner3.png";

const newsItems = [
  {
    id: 1,
    title: "Bí quyết tối ưu chi phí vận tải thực phẩm cho doanh nghiệp",
    date: "23/02/2025",
    image: newsbanner, // Cập nhật hình ảnh phù hợp
    excerpt: "Trung Quốc là một trong những thị trường nhập khẩu...",
    link: "/news/food-logistics-optimization",
  },
  {
    id: 2,
    title:
      "Xu hướng nhập khẩu thực phẩm: Các mặt hàng tiềm năng & quy trình bảo quản",
    date: "23/02/2025",
    image: newsbanner2, // Cập nhật hình ảnh phù hợp
    excerpt: "Trong hoạt động xuất nhập khẩu, chi phí logistics chiếm...",
    link: "/news/food-import-trends",
  },
  {
    id: 3,
    title:
      "Chính sách kiểm định thực phẩm nhập khẩu: Những điều doanh nghiệp cần biết",
    date: "23/02/2025",
    image: newsbanner3, // Cập nhật hình ảnh phù hợp
    excerpt: "Trong hoạt động xuất nhập khẩu, chi phí logistics chiếm...",
    link: "/news/food-inspection-policy",
  },
];
const News = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[660px] bg-white flex items-center">
      <div className="container mx-auto w-[1248px] px-6">
        <div className="flex justify-between tracking-wider mb-6">
          <div>
            <h2 className="font-semibold text-3xl mb-2">Tin tức</h2>
            <p className="text-gray-600">
              Thông tin xuất nhập khẩu, khuyến mãi và ưu đãi cho khách hàng
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate("/news")}
              className="px-6 py-2 rounded-2xl cursor-pointer border border-gray-500 text-black font-semibold hover:text-blue-600 transition duration-300"
            >
              Xem Tất Cả
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <div className="h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">{item.date}</p>
                  <p className="text-gray-600 mt-2">{item.excerpt}</p>
                  <p className="mt-3 text-blue-600 font-semibold">Đọc thêm →</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
