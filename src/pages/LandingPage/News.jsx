import Header from "@/components/LandingPage/Header";
import Navbar from "@/components/LandingPage/Navbar";
import NewsPage from "@/components/LandingPage/NewsPage";
import React from "react";
import Contact from "../../components/LandingPage/Contact";
import Footer from "../../components/LandingPage/Footer";
import { useEffect } from "react";

const News = () => {
  useEffect(() => {
    document.title = "Tin tức - Minh Dương HP";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="w-full h-screen">
      <Header />
      <Navbar />
      <NewsPage />
      <Contact />
      <Footer />
    </div>
  );
};

export default News;
