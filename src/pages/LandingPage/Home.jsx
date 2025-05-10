import React from "react";
import Banner from "../../components/LandingPage/Banner";
import Contact from "../../components/LandingPage/Contact";
import Footer from "../../components/LandingPage/Footer";
import Header from "../../components/LandingPage/Header";
import Navbar from "../../components/LandingPage/Navbar";
import { default as News, default as NewsCard } from "../../components/LandingPage/NewsSection";
import Overview from "../../components/LandingPage/Overview";
import Service from "../../components/LandingPage/Service";
import { useState, useEffect } from "react";
import { getConfig } from "@/api/configApi";

const Home = () => {
  const [homeDescription, setHomeDescription] = useState(null);
  const [homeBackground, setHomeBackground] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const description = await getConfig("homeDescription");
        const background = await getConfig("homeBackground");
        setHomeDescription(description?.value);
        setHomeBackground(background?.value);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    document.title = "Công ty TNHH TMDV & XNK Minh Dương HP";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <Banner
        description={homeDescription}
        background={homeBackground}
        button={true}
      />
      <Overview />
      <Service />
      <News />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
