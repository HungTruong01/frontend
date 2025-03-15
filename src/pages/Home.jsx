import React from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Overview from "../components/Overview";
import ListProduct from "../components/ListProduct";
import News from "../components/News";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <Banner />
      <Overview />
      <ListProduct />
      <News />
    </div>
  );
};

export default Home;
