import React from "react";
import overview from "../../assets/overview.jpg";
import { FaCheckCircle } from "react-icons/fa";
const Overview = () => {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto w-[1248px] px-6 py-14">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3 pr-8">
            <div className="mb-6">
              <p className="text-lg">
                <span className="font-medium text-gray-800">
                  Công ty TNHH Thương mại và Dịch vụ Minh Dương HP
                </span>
                <span className="text-gray-600">
                  {" "}
                  được thành lập với sứ mệnh là công ty hàng đầu trong lĩnh vực
                  tư vấn xúc tiến thương mại điện tử, logistics và xuất nhập
                  khẩu.
                </span>
              </p>
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium text-gray-800">
                Với sứ mệnh kết nối thị trường toàn cầu, Minh Dương không ngừng
                mở rộng quan hệ hợp tác, nâng cao chất lượng dịch vụ và đảm bảo
                cung ứng các sản phẩm đạt tiêu chuẩn quốc tế.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <FaCheckCircle size={24} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-700 text-base">
                    Chúng tôi tập trung vào cung cấp giải pháp thương mại điện
                    tử, logistics và xuất nhập khẩu, giúp các doanh nghiệp vừa
                    và nhỏ tiếp cận thị trường quốc tế một cách dễ dàng và hiệu
                    quả.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <FaCheckCircle size={24} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-700 text-base">
                    Chúng tôi tự hào sở hữu đội ngũ giàu nhiệt huyết và không
                    ngừng học hỏi để mang đến các giải pháp tối ưu nhất cho
                    khách hàng
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <FaCheckCircle size={24} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-700 text-base">
                    Với phương châm{" "}
                    <span className="font-bold">
                      “Đồng hành - Hỗ trợ - Phát triển”
                    </span>
                    , chúng tôi cam kết mang đến dịch vụ chuyên nghiệp, tận tâm
                    và hiệu quả, giúp doanh nghiệp Việt tự tin vươn xa trên thị
                    trường quốc tế.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="w-full md:w-1/3 flex items-center justify-center p-4">
            <div className="rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <img
                src={overview}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
