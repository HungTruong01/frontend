import React from "react";
import banner from "../../assets/banner.jpg";

const Banner = ({
  title,
  titleClassName,
  description1,
  description2,
  buttonHome,
}) => {
  return (
    <div
      className="w-full h-[300px] sm:h-[450px] md:h-[550px] lg:h-[730px] bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${banner})`,
      }}
    >
      <div className="container mx-auto h-full flex flex-col justify-center items-start px-4 sm:px-6 relative z-10">
        <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[576px]">
          <h1
            className={`text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg ${titleClassName}`}
          >
            {title}
          </h1>

          <p className="text-white text-base sm:text-lg max-w-2xl py-2 sm:py-3 md:py-4 text-justify drop-shadow-md font-medium">
            {description1}
          </p>

          <p className="text-white text-base sm:text-lg max-w-2xl py-2 sm:py-3 md:py-4 text-justify drop-shadow-md font-medium">
            {description2}
          </p>

          {buttonHome && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 text-black bg-white rounded-xl font-semibold uppercase hover:bg-blue-500 hover:text-white transition duration-300 text-sm md:text-base shadow-md">
                Xem thêm
              </button>

              <button className="w-full sm:w-auto mt-2 sm:mt-0 px-4 sm:px-6 py-2 text-black bg-white rounded-xl font-semibold uppercase hover:bg-blue-500 hover:text-white transition duration-300 text-sm md:text-base shadow-md">
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
