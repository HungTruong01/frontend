import React from "react";
import newsbanner from "../../assets/newsbanner.png";
import newsbanner2 from "../../assets/newsbanner2.png";
import newsbanner3 from "../../assets/newsbanner3.png";

const newsItems = [
  { id: 1, title: "Bí quyết tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Chi phí vận chuyển luôn là bài toán lớn...", link: "/news/food-logistics-optimization" },
  { id: 2, title: "Xu hướng nhập khẩu thực phẩm năm 2025", date: "23/02/2025", image: newsbanner2, excerpt: "Ngành thực phẩm nhập khẩu đang có...", link: "/news/food-import-trends" },
  { id: 3, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Chính sách kiểm định thực phẩm ngày càng siết chặt...", link: "/news/food-inspection-policy" },
  { id: 4, title: "Tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Làm thế nào để tối ưu chi phí mà vẫn đảm bảo chất lượng...", link: "/news/food-logistics-optimization" },
  { id: 5, title: "Xu hướng nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Phân tích những mặt hàng tiềm năng và quy trình bảo quản...", link: "/news/food-import-trends" },
  { id: 6, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Doanh nghiệp cần hiểu rõ các tiêu chuẩn kiểm tra...", link: "/news/food-inspection-policy" },
  { id: 7, title: "Chiến lược tối ưu logistics thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Cách lựa chọn tuyến đường vận tải tiết kiệm...", link: "/news/food-logistics-optimization" },
  { id: 8, title: "Những thách thức khi nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Quy định ngày càng chặt chẽ đối với hàng nhập khẩu...", link: "/news/food-import-trends" },
  { id: 9, title: "Tiêu chuẩn kiểm tra thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Các tiêu chuẩn quan trọng khi nhập khẩu thực phẩm...", link: "/news/food-inspection-policy" },
  { id: 10, title: "Bí quyết tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Chi phí vận chuyển luôn là bài toán lớn...", link: "/news/food-logistics-optimization" },
  { id: 11, title: "Xu hướng nhập khẩu thực phẩm năm 2025", date: "23/02/2025", image: newsbanner2, excerpt: "Ngành thực phẩm nhập khẩu đang có...", link: "/news/food-import-trends" },
  { id: 12, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Chính sách kiểm định thực phẩm ngày càng siết chặt...", link: "/news/food-inspection-policy" },
  { id: 13, title: "Tối ưu chi phí vận tải thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Làm thế nào để tối ưu chi phí mà vẫn đảm bảo chất lượng...", link: "/news/food-logistics-optimization" },
  { id: 14, title: "Xu hướng nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Phân tích những mặt hàng tiềm năng và quy trình bảo quản...", link: "/news/food-import-trends" },
  { id: 15, title: "Quy định kiểm định thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Doanh nghiệp cần hiểu rõ các tiêu chuẩn kiểm tra...", link: "/news/food-inspection-policy" },
  { id: 16, title: "Chiến lược tối ưu logistics thực phẩm", date: "23/02/2025", image: newsbanner, excerpt: "Cách lựa chọn tuyến đường vận tải tiết kiệm...", link: "/news/food-logistics-optimization" },
  { id: 17, title: "Những thách thức khi nhập khẩu thực phẩm", date: "23/02/2025", image: newsbanner2, excerpt: "Quy định ngày càng chặt chẽ đối với hàng nhập khẩu...", link: "/news/food-import-trends" },
  { id: 18, title: "Tiêu chuẩn kiểm tra thực phẩm nhập khẩu", date: "23/02/2025", image: newsbanner3, excerpt: "Các tiêu chuẩn quan trọng khi nhập khẩu thực phẩm...", link: "/news/food-inspection-policy" },
];

const NewTemplate = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <img src={image} alt="Banner Tin tức" className="w-full h-80 object-cover" />
      <h1 className="text-3xl font-bold mt-4">{title}</h1>
      <p className="text-gray-500">Cập nhật: {updated_date}</p>
      <p className="mt-4">{content}</p>
    </div>
  );
};

export default NewTemplate;
