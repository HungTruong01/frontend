import React from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import FeatureSection from "../components/FeatureSection";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <Banner
        title={"Chúng tôi là ai"}
        titleClassName={"text-3xl font-bold mb-4"}
        description1={
          "Công ty TNHH TMDV & XNK Minh Dương HP là 1 trong những đơn vị hàng đầu trong lĩnh vực Thương mại Xuất Nhập khẩu tại Việt Nam, cam kết mang đến giải pháp kinh doanh hiệu quả và bền vững cho các doanh nghiệp vừa và nhỏ"
        }
        description2={
          "Với sứ mệnh kết nối thị trường Việt Nam với thương mại quốc tế, Minh Dương HP không ngừng đổi mới, ứng dụng công nghệ tiên tiến để tối ưu hóa chuỗi cung ứng và giao thương toàn cầu. Chúng tôi đặt con người làm trung tâm, lấy Uy tín - Chất lượng - Tốc độ - Hiệu quả làm giá trị cốt lõi, góp phần nâng tầm thương hiệu Việt trên bản đồ thương mại thế giới."
        }
        buttonHome={false}
      />
      <FeatureSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default About;
