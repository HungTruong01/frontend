import React from "react";
import Header from "@/components/LandingPage/Header";
import Navbar from "@/components/LandingPage/Navbar";
import NewsCard from "@/components/LandingPage/NewsCard";

const News = () => {
  return (
    <div className="w-full h-screen">
      <Header />
      <Navbar />
      <NewsCard />
    </div>
  );
};

export default News;
