import React from "react";
import banner from "../assets/banner.jpg";
const Banner = ({
  title,
  titleClassName,
  description1,
  description2,
  buttonHome,
}) => {
  return (
    <div
      className="w-full h-[730px] bg-cover bg-center"
      style={{
        backgroundImage: `url(${banner})`,
      }}
    >
      <div className="container mx-auto w-[1248px] h-full flex flex-col justify-center items-start  px-6">
        <div className="w-[576px] h-[340px] text-white">
          <h1 className={`${titleClassName}`}>{title}</h1>
          <p className="text-lg max-w-2xl py-4 text-justify">{description1}</p>
          <p className="text-lg max-w-2xl py-4 text-justify">{description2}</p>
          {buttonHome && (
            <div className="flex items-center gap-4 mt-4">
              <button className="px-6 py-2 text-black bg-white rounded-xl font-semibold uppercase hover:bg-blue-500 hover:text-white transition duration-300">
                Xem thêm
              </button>
              <button className="px-6 py-2 text-black bg-white rounded-xl font-semibold uppercase hover:bg-blue-500 hover:text-white transition duration-300">
                Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
