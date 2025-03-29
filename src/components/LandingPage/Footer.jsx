import React from "react";
import { FaFacebookF, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#027DC3] text-white py-12">
      <div className="container mx-auto w-[1248px] px-6 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide ">
              THÔNG TIN CÔNG TY
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Giới thiệu về Minh Dương HP
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Văn phòng đại diện
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Hoạt động & Văn hoá
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Liên hệ & Góp Ý
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">
              HỖ TRỢ KHÁCH HÀNG
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Quản lý đơn hàng Online
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Quy trình nhập hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Cam kết dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 inline-block">
                  Chính sách bảo hành
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">
              TỔNG ĐÀI HỖ TRỢ
            </h3>
            <p className="mb-4 text-lg">0936886234</p>

            <p className="font-medium">Zalo/SMS:</p>
            <p className="mb-4 text-lg">0938 11 6869 - 0915 611 366</p>

            <p className="font-medium">Đổi hàng, bảo hành, khiếu nại :</p>
            <p className="text-lg">0915 611 366 - 1900 2525 89</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">
              LIÊN HỆ VỚI CHÚNG TÔI
            </h3>
            <div className="flex space-x-4 mb-8">
              <a
                href="#"
                className="bg-blue-800 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="#"
                className="bg-red-600 hover:bg-red-500 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                <FaYoutube size={18} />
              </a>
              <a
                href="#"
                className="bg-black hover:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                <FaTiktok size={18} />
              </a>
              <a
                href="#"
                className="bg-green-500 hover:bg-green-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
