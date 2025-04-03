import Footer from "@/components/LandingPage/Footer";
import Header from "@/components/LandingPage/Header";
import Navbar from "@/components/LandingPage/Navbar";

import React from "react";

const NewDetail = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Navbar />

            <Footer />
        </div>
    );
};

export default NewDetail;
