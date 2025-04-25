import React from "react";
import { useParams } from "react-router-dom";
import newsbanner from "../../assets/newsbanner.png";
import newsbanner2 from "../../assets/newsbanner2.png";
import newsbanner3 from "../../assets/newsbanner3.png";
import NewsCard from "./NewsCard";

const newsItems = [
  {
    id: 1,
    title: "Bí quyết tối ưu chi phí vận tải thực phẩm",
    date: "23/02/2025",
    image: newsbanner,
    excerpt: "Chi phí vận chuyển luôn là bài toán lớn...",
    content: `Chi phí vận chuyển luôn là bài toán lớn đối với các doanh nghiệp xuất nhập khẩu thực phẩm. Việc tối ưu hóa chi phí này đòi hỏi một chiến lược toàn diện và khoa học.

    1. Lựa chọn phương tiện vận chuyển phù hợp
    - Đối với hàng đông lạnh: Sử dụng container lạnh chuyên dụng
    - Đối với thực phẩm khô: Có thể dùng container thường để tiết kiệm chi phí
    - Kết hợp đường biển và đường bộ để tối ưu chi phí
    
    2. Tối ưu hóa không gian lưu trữ
    - Sắp xếp hàng hóa một cách khoa học
    - Tận dụng tối đa không gian container
    - Sử dụng phần mềm quản lý kho vận hiện đại
    
    3. Quản lý thời gian hiệu quả
    - Lên kế hoạch vận chuyển chi tiết
    - Theo dõi thời gian thực để điều chỉnh kịp thời
    - Tránh các chi phí phát sinh do chậm trễ
    
    4. Hợp tác với đối tác logistics uy tín
    - Đàm phán giá cả hợp lý
    - Đảm bảo chất lượng dịch vụ
    - Xây dựng mối quan hệ lâu dài`,
    link: "/news/food-logistics-optimization",
  },
  {
    id: 2,
    title: "Xu hướng nhập khẩu thực phẩm năm 2025",
    date: "23/02/2025",
    image: newsbanner2,
    excerpt: "Ngành thực phẩm nhập khẩu đang có nhiều biến chuyển tích cực...",
    content: `Năm 2025 chứng kiến nhiều thay đổi đáng kể trong ngành nhập khẩu thực phẩm, với các xu hướng mới nổi bật sau:

    1. Thực phẩm hữu cơ và sạch
    - Nhu cầu ngày càng tăng cho thực phẩm organic
    - Tiêu chuẩn chất lượng khắt khe hơn
    - Giá trị thị trường dự kiến tăng 25%
    
    2. Thực phẩm chức năng và bổ sung
    - Tập trung vào sức khỏe và miễn dịch
    - Đa dạng hóa sản phẩm
    - Xu hướng sử dụng nguyên liệu tự nhiên
    
    3. Thực phẩm chế biến sẵn cao cấp
    - Đáp ứng nhu cầu tiện lợi
    - Đảm bảo dinh dưỡng
    - Bao bì thân thiện môi trường
    
    4. Yêu cầu về truy xuất nguồn gốc
    - Áp dụng công nghệ blockchain
    - Minh bạch thông tin
    - Đảm bảo an toàn thực phẩm`,
    link: "/news/food-import-trends",
  },
  {
    id: 3,
    title: "Quy định kiểm định thực phẩm nhập khẩu",
    date: "23/02/2025",
    image: newsbanner3,
    excerpt: "Chính sách kiểm định thực phẩm ngày càng siết chặt...",
    content: `Các quy định về kiểm định thực phẩm nhập khẩu đang được thắt chặt nhằm đảm bảo an toàn cho người tiêu dùng. Dưới đây là những điểm quan trọng cần lưu ý:

    1. Quy trình kiểm định
    - Kiểm tra hồ sơ và giấy tờ pháp lý
    - Lấy mẫu kiểm nghiệm
    - Đánh giá kết quả và cấp giấy chứng nhận
    
    2. Tiêu chuẩn an toàn thực phẩm
    - Đảm bảo tiêu chuẩn vệ sinh
    - Kiểm soát dư lượng hóa chất
    - Đánh giá chất lượng sản phẩm
    
    3. Yêu cầu về bao bì và nhãn mác
    - Thông tin đầy đủ và rõ ràng
    - Ghi rõ thành phần và hạn sử dụng
    - Tuân thủ quy định về ghi nhãn
    
    4. Quy định về bảo quản
    - Điều kiện nhiệt độ phù hợp
    - Không gian lưu trữ đạt chuẩn
    - Kiểm soát độ ẩm và ánh sáng`,
    link: "/news/food-inspection-policy",
  },
];

const NewDetailTemplate = () => {
  const { slug } = useParams();

  const currentNews = newsItems.find(
    (item) => item.link === `/news/${slug}`
  ) || {
    title: "Không tìm thấy bài viết",
    date: "",
    image: newsbanner,
    excerpt: "Bài viết không tồn tại hoặc đã bị xóa.",
    content: "Nội dung không tồn tại.",
  };

  const relatedNews = newsItems
    .filter((item) => item.link !== `/news/${slug}`)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white-100 py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <img
          src={currentNews.image}
          alt={currentNews.title}
          className="w-full h-80 object-cover rounded-lg mb-8"
        />

        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentNews.title}
          </h1>
          <p className="text-gray-500 mb-6">Cập nhật: {currentNews.date}</p>

          <div className="text-gray-700 leading-relaxed mb-8">
            <p className="text-lg mb-6">{currentNews.excerpt}</p>

            <div className="whitespace-pre-line">{currentNews.content}</div>
          </div>

          <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Bài viết liên quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((news) => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  title={news.title}
                  date={news.date}
                  image={news.image}
                  excerpt={news.excerpt}
                  link={news.link}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDetailTemplate;
