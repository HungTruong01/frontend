import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState, useEffect } from "react";
import { getConfig } from "@/api/configApi";

const Contact = () => {
  const [contactContent, setContactContent] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const [email, setEmail] = useState(null);

  const fetchContactContent = async () => {
    try {
      const contactContent = await getConfig("contactContent");
      const phone = await getConfig("phone");
      const address = await getConfig("address");
      const email = await getConfig("email");
      setContactContent(contactContent?.value);
      setPhone(phone?.value);
      setAddress(address?.value);
      setEmail(email?.value);
    } catch (error) {
      console.error("Error fetching contact content:", error);
    }
  }
  
  useEffect(() => {
    fetchContactContent();
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-gray-200 py-16">
      <div className="max-w-5xl mx-auto flex flex-col justify-center items-center gap-6 px-4 mb-12 text-center">
        { contactContent && (
          <div
              className="space-y-6 [&>p]:mb-4 [&>h1]:mb-6 [&>h2]:mb-6 [&>h3]:mb-6"
              dangerouslySetInnerHTML={{
                __html: contactContent,
              }}
          ></div>
        )}
      </div>

      <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
        <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-8 md:p-12">
          <div className="flex flex-wrap justify-around">
            <div className="w-full md:w-1/3 flex flex-col items-center gap-6 px-4 mb-8 md:mb-0 hover:transform hover:translateY-[-8px] transition-transform duration-300">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                <FaPhoneAlt className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center">Đường dây nóng</h3>
              { phone && (
                <div className="text-center break-words"
                  dangerouslySetInnerHTML={{
                    __html: phone,
                  }}
                ></div>
              )}
            </div>

            <div className="w-full md:w-1/3 flex flex-col items-center gap-6 px-4 mb-8 md:mb-0 hover:transform hover:translateY-[-8px] transition-transform duration-300">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                <FaMapMarkerAlt className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center">Văn phòng</h3>
              { address && (
                <div className="text-center break-words"
                  dangerouslySetInnerHTML={{
                    __html: address,
                  }}
                ></div>
              )}
            </div>

            <div className="w-full md:w-1/3 flex flex-col items-center gap-6 px-4 mb-8 md:mb-0 hover:transform hover:translateY-[-8px] transition-transform duration-300">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                <MdEmail className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center">Hòm thư</h3>
              { email && (
                <div className="text-center break-words"
                  dangerouslySetInnerHTML={{
                    __html: email,
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
