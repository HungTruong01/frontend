import React from "react";
import banner from "../assets/banner.jpg";
const Banner = () => {
  return (
    <div
      className="w-full h-[730px] bg-cover bg-center"
      style={{
        backgroundImage: `url(${banner})`,
      }}
    >
      <div className="container mx-auto w-[1248px] h-full flex flex-col justify-center items-start  px-6">
        <div className="w-[576px] h-[340px] text-white">
          <h1 className="text-5xl font-bold mb-6">
            Chào mừng đến với TNHH Minh Dương HP
          </h1>
          <p className="text-lg max-w-2xl py-4">
            “Đoàn kết là sức mạnh... khi có sự chung sức và hợp tác, ta có thể
            đạt được những điều tuyệt vời!”
          </p>
          <p className="text-lg max-w-2xl py-4">
            “Nếu mọi người thích bạn, họ sẽ lắng nghe bạn, nhưng nếu họ tin
            tưởng bạn, họ sẽ làm kinh doanh với bạn.”
          </p>
          <div className="flex items-center gap-4 mt-4">
            <button className="px-6 py-2 text-black bg-white rounded-xl font-semibold uppercase hover:bg-blue-500 hover:text-white transition duration-300">
              Xem thêm
            </button>
            <button className="px-6 py-2 text-black bg-white rounded-xl font-semibold uppercase hover:bg-blue-500 hover:text-white transition duration-300">
              Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
