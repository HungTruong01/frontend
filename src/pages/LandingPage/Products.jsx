import Contact from "@/components/LandingPage/Contact";
import Footer from "@/components/LandingPage/Footer";
import Header from "@/components/LandingPage/Header";
import Navbar from "@/components/LandingPage/Navbar";
import ProductsPage from "@/components/LandingPage/ProductsPage";
import React from "react";

const Products = () => {
  return (
    <div className="w-full h-screen">
      <Header />
      <Navbar />
      <ProductsPage />
      <Contact />
      <Footer />
    </div>
  );
};

export default Products;
