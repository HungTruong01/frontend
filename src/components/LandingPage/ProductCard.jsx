import React from "react";

const ProductCard = ({ id, name, description, imageUrl, category }) => {
  return (
    <div
      key={id}
      className="relative max-w-xs rounded-md overflow-hidden shadow-lg hover:scale-105 transition duration-500 cursor-pointer bg-white"
    >
      {/* Hình ảnh sản phẩm */}
      <img className="w-full h-44 object-cover" src={imageUrl} alt={name} />

      {/* Nội dung sản phẩm */}
      <div className="px-6 py-4 pb-16">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Category */}
      <div className="absolute bottom-4 left-6 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md">
        {category}
      </div>
    </div>
  );
};

export default ProductCard;
