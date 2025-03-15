import React from "react";
import Product from "./Product";
import { useNavigate } from "react-router-dom";

const products = [
  {
    name: "Product 1",
    description: "This is a description for product 1.",
    imageUrl:
      "https://media.ldlc.com/r1600/ld/products/00/05/82/02/LD0005820208_1.jpg",
    category: "Electronics",
  },
  {
    name: "Product 2",
    description: "This is a description for product 2.",
    imageUrl:
      "https://media.ldlc.com/r1600/ld/products/00/05/82/02/LD0005820208_1.jpg",
    category: "Clothing",
  },
  {
    name: "Product 3",
    description: "This is a description for product 3.",
    imageUrl:
      "https://media.ldlc.com/r1600/ld/products/00/05/82/02/LD0005820208_1.jpg",
    category: "Clothing",
  },
  {
    name: "Product 3",
    description: "This is a description for product 3.",
    imageUrl:
      "https://media.ldlc.com/r1600/ld/products/00/05/82/02/LD0005820208_1.jpg",
    category: "Clothing",
  },
];
const ListProduct = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-blue-400">
      <div className="container mx-auto w-[1248px] flex flex-col items-center gap-4 px-6 py-8 mt-8">
        <p className="font-bold text-lg uppercase text-white">
          Sản phẩm của chúng tôi
        </p>
        <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Product key={index} product={product} />
          ))}
        </div>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-4 rounded-2xl font-semibold bg-white text-black hover:scale-105 transition duration-300 cursor-pointer"
        >
          Xem Tất Cả
        </button>

        <div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
