import React from "react";
import Header from "../../components/LandingPage/Header";
import Navbar from "../../components/LandingPage/Navbar";
import Banner from "../../components/LandingPage/Banner";
import FeatureSection from "../../components/LandingPage/FeatureSection";
import Contact from "../../components/LandingPage/Contact";
import Footer from "../../components/LandingPage/Footer";
import { useEffect, useState } from "react";
import { getConfig } from "@/api/configApi";

const About = () => {
  const [aboutDescription, setAboutDescription] = useState(null);
  const [aboutBackground, setAboutBackground] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const description = await getConfig("aboutDescription");
        const background = await getConfig("aboutBackground");
        setAboutDescription(description?.value);
        setAboutBackground(background?.value);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    document.title = "Về chúng tôi - Minh Dương HP";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <Banner
        description={aboutDescription}
        background={aboutBackground}
        button={true}
      />
      <FeatureSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default About;
