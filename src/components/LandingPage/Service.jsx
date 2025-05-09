import React, { useState, useEffect } from "react";
import {
  FaShip,
  FaTruck,
  FaWarehouse,
} from "react-icons/fa";
import service1 from "../../assets/service1.jpg";
import service2 from "../../assets/service2.jpg";
import service3 from "../../assets/service3.jpg";
import service4 from "../../assets/service4.jpg";
import { getConfig } from "@/api/configApi";

const services = [
  {
    name: "Vận tải đường bộ",
    description:
      "Dịch vụ vận chuyển hàng hóa đường bộ nhanh chóng, an toàn, phù hợp với mọi loại thực phẩm.",
    imageUrl: service2,
    icon: <FaTruck />,
  },
  {
    name: "Vận tải đường biển",
    description:
      "Giải pháp vận chuyển hàng hóa bằng đường biển, đảm bảo chất lượng và thời gian giao hàng.",
    imageUrl: service1,
    icon: <FaShip />,
  },
  {
    name: "Cung cấp thực phẩm",
    description:
      "Chuyên cung cấp các loại thực phẩm như gia vị, đồ đông lạnh, thực phẩm chế biến sẵn.",
    imageUrl: service3,
    icon: <FaWarehouse />,
  },
  {
    name: "Bảo quản thực phẩm",
    description:
      "Đảm bảo bảo quản thực phẩm tuyệt đối với hệ thống kho lạnh, nhằm hướng tới an toàn và chất lượng.",
    imageUrl: service4,
    icon: <FaWarehouse />,
  },
];

const Service = () => {
  const [serviceTitle, setServiceTitle] = useState(null);
  const [serviceDescription, setServiceDescription] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const title = await getConfig("serviceTitle");
        const description = await getConfig("serviceDescription");
        setServiceTitle(title?.value);
        setServiceDescription(description?.value);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="w-full bg-sky-500 py-16">
      <div className="container mx-auto max-w-7xl flex flex-col items-center gap-8 px-4">
        <div className="text-center mb-6">
          <h2 className="font-bold text-2xl md:text-3xl uppercase text-white mb-3">
            {serviceTitle ? (
              <div
                className="space-y-6 [&>p]:mb-4 [&>h1]:mb-6 [&>h2]:mb-6 [&>h3]:mb-6"
                dangerouslySetInnerHTML={{ __html: serviceTitle }}
              ></div>
            ) : null}
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
            {serviceDescription ? (
              <div
                className="text-white text-justify leading-relaxed mt-4"
                dangerouslySetInnerHTML={{
                  __html: serviceDescription,
                }}
              ></div>
            ) : null}
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
                <div className="flex items-center">
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 flex-grow">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
