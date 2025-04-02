import React from "react";

const NewsCard = ({ id, title, date, image, excerpt, link }) => {
  return (
    <div
      key={id}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div className="h-52 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-2">{date}</p>
          <p className="text-gray-600 mt-2">{excerpt}</p>
          <p className="mt-3 text-blue-600 font-semibold">Đọc thêm →</p>
        </div>
      </a>
    </div>
  );
};

export default NewsCard;
