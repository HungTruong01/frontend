import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFacebook,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const Header = () => {
  return (
    <div className="w-full bg-[#027DC3] py-4">
      <div className="container mx-auto w-[1248px] px-6 h-full flex justify-between items-center text-white text-sm tracking-wider">
        <h4 className="font-semibold">Chào mừng đến với TNHH Minh Dương HP</h4>

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
            <p>0982908841 - 0123456789</p>
          </div>

          <div className="flex items-center gap-2">
            <span>
              <IoIosMail size={16} />
            </span>
            <p>info@gmail.com</p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 cursor-pointer">
          <FaFacebook size={14} />
          <FaYoutube size={14} />
          <FaTiktok size={14} />
        </div>
      </div>
    </div>
  );
};

export default Header;
