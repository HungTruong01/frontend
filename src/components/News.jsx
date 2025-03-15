import React from "react";
import { Link } from "react-router-dom";
import newsbanner from "../assets/newsbanner.png";
import newsbanner2 from "../assets/newsbanner2.png";
import newsbanner3 from "../assets/newsbanner3.png";

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: "Bí quyết tối ưu chi phí logistics trong hoạt động xuất nhập khẩu",
      image: newsbanner,
      link: "/news/logistics-optimization",
    },
    {
      id: 2,
      title:
        "Xuất khẩu nguyên liệu trong và ngoài nước: Điều kiện, thủ tục & những lưu ý quan trọng",
      image: newsbanner2,
      link: "/news/china-exports",
    },
    {
      id: 3,
      title:
        "Quy trình nhập khẩu thực phẩm vào Việt Nam: Hồ sơ và điều kiện cần biết",
      image: newsbanner3,
      link: "/news/cosmetics-import",
    },
  ];

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
            <button className="px-6 py-2 rounded-2xl cursor-pointer border border-gray-500 text-black font-semibold hover:text-blue-600 transition duration-300">
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
              <Link to={item.link}>
                <div className="h-60 overflow-hidden">
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
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
