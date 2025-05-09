import React from "react";
import { IoDiamondOutline } from "react-icons/io5";
import { FaDollarSign, FaPhoneAlt, FaUserShield } from "react-icons/fa";
import image from "../../assets/img.jpg";
import { getConfig } from "@/api/configApi";
import { useState, useEffect } from "react";

const features = [
  {
    icon: <IoDiamondOutline />,
    title: "Sản Phẩm Chất Lượng",
    description:
      "Triết lý kinh doanh đặt chất lượng sản phẩm và lợi ích của khách hàng lên hàng đầu. Sản phẩm đến với khách hàng đều được kiểm tra, đóng gói và vận chuyển theo từng công đoạn kiểm tra chặt chẽ.",
  },
  {
    icon: <FaDollarSign />,
    title: "Giá Cả Cạnh Tranh",
    description:
      "Là đơn vị trực thuộc hệ thống đại lý Alibaba.com nên HBS có khả năng kết nối tất cả các nhà máy sản xuất, kinh doanh toàn cầu và có khả năng cung cấp số lượng lớn và giá cả cạnh tranh cho khách hàng.",
  },
  {
    icon: <FaUserShield />,
    title: "Uy Tín & An Toàn",
    description:
      "Mỗi đơn hàng từ lúc lựa chọn sản phẩm, nhà cung cấp đến lúc thanh toán đều được kiểm duyệt và xác thực qua hệ thống. Chúng tôi tự tin mang lại sự an toàn, uy tín, trách nhiệm trên từng đơn hàng.",
  },
  {
    icon: <FaPhoneAlt />,
    title: "Hỗ Trợ 24/7",
    description:
      "HBS có đội ngũ kinh doanh, chăm sóc khách hàng chuyên nghiệp, hỗ trợ khách hàng nhanh và tận tâm. Chúng tôi luôn đặt khách hàng là trung tâm và trách nhiệm với khách hàng là cao nhất.",
  },
];

const FeatureSection = () => {
  const [aboutMotto, setAboutMoto] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [aboutContentImageUrl, setaboutContentImageUrl] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const motto = await getConfig("aboutMotto");
        const content = await getConfig("aboutContent");
        const background = await getConfig("aboutContentImageUrl");
        setAboutMoto(motto?.value);
        setAboutContent(content?.value);
        setaboutContentImageUrl(background?.value);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="w-full bg-white py-16">
      <div className="container mx-auto w-[1248px] px-6">
        <div className="text-center mb-12">
          {aboutMotto && (
            <div
              dangerouslySetInnerHTML={{
                __html: aboutMotto,
              }}
            ></div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="h-16 w-16 text-3xl bg-black text-white rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-4">{feature.title}</h3>
              <p className="text-gray-700 text-justify">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-10 px-4 py-8 mt-12">
          <div className="text-justify">
            {aboutContent && (
              <div
                className="space-y-2 [&>p]:mb-2 [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: aboutContent,
                }}
              ></div>
            )}
          </div>
          <div className="h-full bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={ aboutContentImageUrl || image}
              alt="image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
