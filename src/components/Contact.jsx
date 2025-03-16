import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Contact = () => {
  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-gray-200 py-16">
      <div className="max-w-4xl mx-auto flex flex-col justify-center items-center gap-6 px-4 mb-12 text-center">
        <h2 className="font-bold text-2xl md:text-3xl uppercase tracking-wider text-gray-800">
          Liên hệ với Minh Dương HP ngay hôm nay
        </h2>
        <p className="text-gray-600 max-w-2xl mt-4 text-lg">
          Đội ngũ kinh doanh của chúng tôi luôn sẵn sàng để hỗ trợ bạn. Hãy gọi
          cho chúng tôi bất cứ khi nào bạn cần được trợ giúp!
        </p>
      </div>

      <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
        <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-8 md:p-12">
          <div className="flex flex-wrap justify-around">
            <div className="w-full md:w-1/3 flex flex-col items-center gap-6 px-4 mb-8 md:mb-0 hover:transform hover:translateY-[-8px] transition-transform duration-300">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                <FaPhoneAlt className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center">Hotline</h3>
              <p className="text-lg text-center font-medium">0936886234</p>
            </div>

            <div className="w-full md:w-1/3 flex flex-col items-center gap-6 px-4 mb-8 md:mb-0 hover:transform hover:translateY-[-8px] transition-transform duration-300">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                <FaMapMarkerAlt className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center">HP Office</h3>
              <p className="text-center">
                Thôn Câu Trung, Xã Quang Hưng, Huyện An Lão, Thành phố Hải
                Phòng, Việt Nam
              </p>
            </div>

            <div className="w-full md:w-1/3 flex flex-col items-center gap-6 px-4 mb-8 md:mb-0 hover:transform hover:translateY-[-8px] transition-transform duration-300">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                <MdEmail className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center">Email</h3>
              <p className="text-center break-words">
                congtyxnkminhduonghp@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
