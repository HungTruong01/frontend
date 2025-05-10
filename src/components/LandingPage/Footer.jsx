import React from "react";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getConfig } from "@/api/configApi";

const Footer = () => {
  const [director, setDirector] = useState(null);
  const [footerCopyright, setFooterCopyright] = useState(null);

  const fetchFooterContent = async () => {
    try {
      const director = await getConfig("director");
      const footerCopyright = await getConfig("footerCopyright");

      setDirector(director?.value);
      setFooterCopyright(footerCopyright?.value);
    } catch (error) {
      console.error("Error fetching footer content:", error);
    }
  }

  useEffect(() => {
    fetchFooterContent();
  }, []);

  return (
    <footer className="w-full bg-[#027DC3] text-white py-12">
      <div className="container mx-auto w-[1000px] px-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-between">
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide ">
              THÔNG TIN CÔNG TY
            </h3>
            <ul className="space-y-3">
              <li>
                { director && (
                  <div
                      dangerouslySetInnerHTML={{
                        __html: director,
                      }}
                  ></div>
                )}
              </li>
              <li>
                <p className="inline-block">
                  Giới thiệu về Minh Dương HP
                </p>
              </li>
              <li>
                <p className="inline-block">
                  Văn phòng đại diện
                </p>
              </li>
              <li>
                <p className="inline-block">
                  Tuyển dụng
                </p>
              </li>
              <li>
                <p className="inline-block">
                  Liên hệ & Góp Ý
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">
              HỖ TRỢ KHÁCH HÀNG
            </h3>
            <ul className="space-y-3">
              <li>
                <p className="inline-block">
                  Quản lý đơn hàng Online
                </p>
              </li>
              <li>
                <p className="inline-block">
                  Hướng dẫn mua hàng
                </p>
              </li>
              <li>
                <p className="inline-block">
                  Quy trình nhập hàng
                </p>
              </li>
              <li>
                <p className="inline-block">
                  Cam kết dịch vụ
                </p>
              </li>
              <li>
                <p className="inline-block">
                  Chính sách bảo hành
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wide">
              LIÊN HỆ VỚI CHÚNG TÔI
            </h3>
            <div className="flex space-x-4 mb-4">
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
            </div>
            <div className="text-justify leading-relaxed">
              { footerCopyright && (
                    <div
                        dangerouslySetInnerHTML={{
                          __html: footerCopyright,
                        }}
                    ></div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
