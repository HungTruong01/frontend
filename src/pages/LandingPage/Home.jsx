import React from "react";
import Header from "../../components/LandingPage/Header";
import Navbar from "../../components/LandingPage/Navbar";
import Banner from "../../components/LandingPage/Banner";
import Overview from "../../components/LandingPage/Overview";
import Service from "../../components/LandingPage/Service";
import NewsCard from "../../components/LandingPage/NewsCard";
import Contact from "../../components/LandingPage/Contact";
import Footer from "../../components/LandingPage/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <Banner
        title={"Chào mừng đến với TNHH Minh Dương HP"}
        titleClassName={"text-5xl font-bold mb-6"}
        description1={
          "Đoàn kết là sức mạnh... khi có sự chung sức và hợp tác, ta có thể đạt được những điều tuyệt vời!"
        }
        description2={
          "Nếu mọi người thích bạn, họ sẽ lắng nghe bạn, nhưng nếu họ tin tưởng bạn, họ sẽ làm kinh doanh với bạn."
        }
        buttonHome={true}
      />
      <Overview />
      <Service />
      <NewsCard />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
