import React from "react";
import {
  FaArrowRight,
  FaPlane,
  FaShip,
  FaTruck,
  FaWarehouse,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import service1 from "../../assets/service1.jpg";
import service2 from "../../assets/service2.jpg";
import service3 from "../../assets/service3.jpg";
import service4 from "../../assets/service4.jpg";

const services = [
  {
    name: "Vận tải đường bộ",
    description:
      "Dịch vụ vận chuyển hàng hóa đường bộ nhanh chóng, an toàn, phù hợp với mọi loại thực phẩm.",
    imageUrl: service2,
    category: "Vận tải",
    icon: <FaTruck />,
  },
  {
    name: "Vận tải đường biển",
    description:
      "Giải pháp vận chuyển hàng hóa bằng đường biển, đảm bảo chất lượng và thời gian giao hàng.",
    imageUrl: service1,
    category: "Vận tải",
    icon: <FaShip />,
  },
  {
    name: "Cung cấp thực phẩm",
    description:
      "Chuyên cung cấp các loại thực phẩm như gia vị, đồ đông lạnh, thực phẩm chế biến sẵn.",
    imageUrl: service3,
    category: "Thực phẩm",
    icon: <FaWarehouse />,
  },
  {
    name: "Bảo quản thực phẩm",
    description:
      "Đảm bảo bảo quản thực phẩm tuyệt đối với hệ thống kho lạnh, nhằm hương tới an toàn và chất lượng.",
    imageUrl: service4,
    category: "Hỗ trợ",
    icon: <FaWarehouse />,
  },
];

const Service = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-sky-500 py-16">
      <div className="container mx-auto max-w-7xl flex flex-col items-center gap-8 px-4">
        <div className="text-center mb-6">
          <h2 className="font-bold text-2xl md:text-3xl uppercase text-white mb-3">
            Dịch vụ của chúng tôi
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          <p className="text-blue-100 mt-4 max-w-2xl mx-auto">
            Cung cấp các giải pháp vận tải và logistics toàn diện, đáp ứng mọi
            nhu cầu vận chuyển hàng hóa của doanh nghiệp bạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full">
                  {service.icon}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {service.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {service.description}
                </p>
                {/* <button className="mt-auto bg-transparent hover:bg-blue-700 text-blue-700 hover:text-white border border-blue-700 py-2 px-4 rounded transition-colors duration-300 text-sm font-medium flex items-center justify-center">
                  Tìm hiểu thêm
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* <button
          onClick={() => navigate("/services")}
          className="px-8 py-3 mt-8 rounded-md font-semibold bg-yellow-500 hover:bg-yellow-400 text-blue-900 flex items-center gap-2 transition duration-300 shadow-lg hover:shadow-xl"
        >
          <span>Xem tất cả dịch vụ</span>
          <span>
            <FaArrowRight />
          </span>
        </button> */}
      </div>
    </div>
  );
};

export default Service;
