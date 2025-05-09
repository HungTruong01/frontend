import React from "react";
import banner from "../../assets/banner.jpg";

const Banner = ({
  description,
  background,
  button,
}) => {
  return (
    <div
      className="w-full h-[300px] sm:h-[450px] md:h-[550px] lg:h-[730px] bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${background || banner})`,
      }}
    >
      <div className="container mx-auto h-full flex flex-col justify-center items-start px-4 sm:px-6 relative z-10">
        <div className="w-full sm:w-[90%] md:w-[100%] lg:w-[750px]">
          {description && (
            <div className="text-white leading-normal text-justify mb-6 w-full leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              ></div>
            </div>
          )}

          {button && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 text-black bg-white rounded-xl font-semibold uppercase hover:bg-blue-500 hover:text-white transition duration-300 text-sm md:text-base shadow-md">
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;