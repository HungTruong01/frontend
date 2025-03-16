import React from "react";
import { IoDiamondOutline } from "react-icons/io5";
import { FaDollarSign, FaPhoneAlt, FaUserShield } from "react-icons/fa";
import image from "../assets/img.jpg";
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
  return (
    <div className="w-full bg-white py-16">
      <div className="container mx-auto w-[1248px] px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold text-2xl md:text-3xl mb-3 tracking-wide">
            Phương châm kinh doanh của Minh Dương HP
          </h2>
          <p className="mt-4 font-semibold max-w-2xl mx-auto tracking-wide">
            "Tài sản giá trị nhất của công ty bạn chính là cách mà khách hàng
            biết đến nó."
          </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-6 px-4 py-8 mt-12">
          <div className="text-justify ">
            <h2 className="font-bold text-2xl mb-6">
              “Nếu mọi người thích bạn, họ sẽ lắng nghe bạn, nhưng nếu họ tin
              tưởng bạn, họ sẽ làm kinh doanh với bạn.”
            </h2>
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">I. Trách nhiệm :</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  Với bản thân: Luôn cầu tiến, lắng nghe, chia sẻ và có ý chí
                  vươn lên.
                </li>
                <li>
                  Với khách hàng: Luôn phục vụ với tinh thần trách nhiệm cao và
                  tận tâm nhất.
                </li>
                <li>
                  Với tổ chức: Đặt trách nhiệm với tổ chức lên cao nhất trong
                  suy nghĩ và hành động.
                </li>
              </ol>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">II. Tận tâm :</h2>
              <p className="pl-2">
                Luôn tận tâm với khách hàng - Đồng nghiệp - Tổ chức cả trong suy
                nghĩ và hành động.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4">III. Hướng đến :</h2>
              <p>Một cuộc sống tươi đẹp, hạnh phúc và bền vững hơn</p>
            </div>
          </div>
          <div className="h-2/3 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image}
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
