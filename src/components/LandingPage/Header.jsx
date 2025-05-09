import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { getConfig } from "@/api/configApi";  

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerContent, setHeaderContent] = useState(null);
  const [shortenedHeaderContent, setShortenedHeaderContent] = useState(null);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);

  // Fetch header content from the API
  useEffect(() => {
    fetchHeaderContent();
  }, []);

  const fetchHeaderContent = async () => {
    try {
      const headerContentData = await getConfig("headerContent");
      const shortenedHeaderContentData = await getConfig("shortenedHeaderContent");
      const addressData = await getConfig("shortenedAddress");
      const phoneData = await getConfig("phone");
      const emailData = await getConfig("email");
      const socialLinksData = await getConfig("socialLinks");

      // Ensure we're getting the correct field from the response
      setHeaderContent(headerContentData?.value || null);
      setShortenedHeaderContent(shortenedHeaderContentData?.value || null);
      setAddress(addressData?.value || null);
      setPhone(phoneData?.value || null);
      setEmail(emailData?.value || null);
      setSocialLinks(socialLinksData?.value || []);
    } catch (error) {
      console.error("Error fetching header content:", error);
    }
  };

  return (
    <div className="w-full bg-[#027DC3] py-4">
      {/* Desktop view */}
      <div className="container mx-auto px-4 lg:px-6 h-full">
        {/* Main header row */}
        <div className="hidden lg:flex justify-between items-center text-white text-sm tracking-wider">
          { headerContent && (
            <div
              dangerouslySetInnerHTML={{
              __html: headerContent,
            }}
            ></div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>
                <FaMapMarkerAlt size={16} />
              </span>
              { address && (
                <div
                  dangerouslySetInnerHTML={{
                  __html: address,
                }}
                ></div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>
                <FaPhoneAlt size={14} />
              </span>
              { phone && (
                <div
                  dangerouslySetInnerHTML={{
                  __html: phone,
                }}
                ></div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>
                <IoIosMail size={16} />
              </span>
              { email && (
                <div
                  dangerouslySetInnerHTML={{
                  __html: email,
                }}
                ></div>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 cursor-pointer">
            <a href={socialLinks} target="_blank" rel="noopener noreferrer">
              <FaFacebook size={20} />
            </a>
            <FaYoutube size={20} />
            <FaTiktok size={20} />
          </div>
        </div>

        {/* Mobile view */}
        <div className="lg:hidden flex justify-between items-center text-white">
          { shortenedHeaderContent && (
            <div
              dangerouslySetInnerHTML={{
              __html: shortenedHeaderContent,
            }}
            ></div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center gap-2 cursor-pointer">
              <a href={socialLinks} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
              <FaYoutube size={20} />
              <FaTiktok size={20} />
            </div>

            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden text-white mt-4 space-y-3 pb-2">
            <div className="flex items-center gap-2">
              <span>
                <FaMapMarkerAlt size={16} />
              </span>
              {address && (
                <div className="text-sm"
                  dangerouslySetInnerHTML={{
                  __html: address,
                }}
                ></div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>
                <FaPhoneAlt size={14} />
              </span>
              { phone && (
                <div className="text-sm"
                  dangerouslySetInnerHTML={{
                  __html: phone,
                }}
                ></div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>
                <IoIosMail size={16} />
              </span>
              { email && (
                <div className="text-sm"
                  dangerouslySetInnerHTML={{
                  __html: email,
                }}
                ></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
