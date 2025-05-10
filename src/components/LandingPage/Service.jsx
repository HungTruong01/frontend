import React, { useState, useEffect } from "react";
import { getConfig } from "@/api/configApi";
import { getAllServiceContents } from "@/api/serviceContentApi";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Service = () => {
  const [serviceTitle, setServiceTitle] = useState(null);
  const [serviceDescription, setServiceDescription] = useState(null);
  const [serviceContents, setServiceContents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 4;
  const [slideDirection, setSlideDirection] = useState("next");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const title = await getConfig("serviceTitle");
        const description = await getConfig("serviceDescription");
        setServiceTitle(title?.value);
        setServiceDescription(description?.value);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchServiceContent = async () => {
      try {
        const response = await getAllServiceContents(
          currentPage,
          itemsPerPage,
          "id",
          "asc"
        );

        const mappedServiceContents = response.data.content.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail
        }));
        setTotalPages(response.data.totalPages);
        setServiceContents(mappedServiceContents);
      } catch (error) {
        console.error("Error fetching service content:", error);
      }
    };
    fetchServiceContent();
  }, [currentPage]);

  return (
    <div className="w-full bg-sky-500 py-16">
      <div className="container mx-auto max-w-7xl flex flex-col items-center gap-8 px-4">
        <div className="text-center mb-6">
          <h2 className="font-bold text-2xl md:text-3xl uppercase text-white mb-3">
            {serviceTitle ? (
              <div
                className="space-y-6 [&>p]:mb-4 [&>h1]:mb-6 [&>h2]:mb-6 [&>h3]:mb-6"
                dangerouslySetInnerHTML={{ __html: serviceTitle }}
              ></div>
            ) : null}
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          {serviceDescription ? (
            <div
              className="text-white text-justify leading-relaxed mt-4"
              dangerouslySetInnerHTML={{
                __html: serviceDescription,
              }}
            ></div>
          ) : null}
        </div>

        <div className="relative w-full">
          {currentPage > 0 && (
            <button
              onClick={() => {
                setSlideDirection("prev");
                setCurrentPage(currentPage - 1);
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-30 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ x: slideDirection === "next" ? 100 : -100 }}
                animate={{ x: 0 }}
                exit={{ x: slideDirection === "next" ? -100 : 100 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap justify-center gap-6"
              >
                {serviceContents.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full w-[calc(100%-1rem)] sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)]"
                  >
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 flex-grow text-justify">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {currentPage < totalPages - 1 && (
            <button
              onClick={() => {
                setSlideDirection("next");
                setCurrentPage(currentPage + 1);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-30 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Service;
