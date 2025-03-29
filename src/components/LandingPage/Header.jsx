import React, { useState } from "react";
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full bg-[#027DC3] py-4">
      {/* Desktop view */}
      <div className="container mx-auto px-4 lg:px-6 h-full">
        {/* Main header row */}
        <div className="hidden lg:flex justify-between items-center text-white text-sm tracking-wider">
          <h4 className="font-semibold">
            Chào mừng đến với TNHH TMDV & XNK Minh Dương HP
          </h4>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>
                <FaMapMarkerAlt size={16} />
              </span>
              <p>An Lão, Hải Phòng</p>
            </div>

            <div className="flex items-center gap-2">
              <span>
                <FaPhoneAlt size={14} />
              </span>
              <p>0936886234</p>
            </div>

            <div className="flex items-center gap-2">
              <span>
                <IoIosMail size={16} />
              </span>
              <p>congtyxnkminhduonghp@gmail.com</p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 cursor-pointer">
            <FaFacebook size={14} />
            <FaYoutube size={14} />
            <FaTiktok size={14} />
          </div>
        </div>

        {/* Mobile view */}
        <div className="lg:hidden flex justify-between items-center text-white">
          <h4 className="font-semibold text-xs sm:text-sm">
            TNHH TMDV & XNK Minh Dương HP
          </h4>

          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center gap-2 cursor-pointer">
              <FaFacebook size={14} />
              <FaYoutube size={14} />
              <FaTiktok size={14} />
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
              <p className="text-sm">An Lão, Hải Phòng</p>
            </div>

            <div className="flex items-center gap-2">
              <span>
                <FaPhoneAlt size={14} />
              </span>
              <p className="text-sm">0936886234</p>
            </div>

            <div className="flex items-center gap-2">
              <span>
                <IoIosMail size={16} />
              </span>
              <p className="text-sm">congtyxnkminhduonghp@gmail.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
