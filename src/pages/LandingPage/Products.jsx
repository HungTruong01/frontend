import Contact from "@/components/LandingPage/Contact";
import Footer from "@/components/LandingPage/Footer";
import Header from "@/components/LandingPage/Header";
import Navbar from "@/components/LandingPage/Navbar";
import ProductsPage from "@/components/LandingPage/ProductsPage";
import React from "react";
import { useEffect } from "react";

const Products = () => {
  useEffect(() => {
    document.title = "Sản phẩm - Minh Dương HP";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
