import React from "react";
import { Link } from "react-router-dom";

const NewsCard = ({ id, title, date, image, excerpt, link }) => {
  

  return (
    <div
      key={id}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs h-[380px] relative"
    >
      <Link to={link} className="block h-full">
        {/* Hình ảnh */}
        <div className="h-36 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Nội dung */}
        <div className="p-5 flex flex-col justify-between">
          <div className="mb-4">
            {/* Tiêu đề với tối đa 2 dòng */}
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            {/* Ngày */}
            <p className="text-sm text-gray-500 mt-1">{date}</p>
          </div>

          {/* Mô tả trong một div và cắt nội dung khi dài */}
          <div className="overflow-hidden">
            <p className="text-justify text-gray-600 mb-6 text-ellipsis line-clamp-3">
              {excerpt}
            </p>
          </div>
        </div>

        {/* Phần "Đọc thêm" cố định ở góc trái dưới */}
        <p className="absolute bottom-4 left-6 text-blue-600 font-semibold text-sm">
          Đọc thêm →
        </p>
      </Link>
    </div>
  );
};

export default NewsCard;
