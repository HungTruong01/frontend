import React from "react";
import { getConfig } from "@/api/configApi";
import { useState, useEffect } from "react";

const Overview = () => {
  const [overviewDescription, setOverviewDescription] = useState(null);
  const [overviewBackground, setOverviewBackground] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const description = await getConfig("overviewDescription");
        const background = await getConfig("overviewImageUrl");
        setOverviewDescription(description?.value);
        setOverviewBackground(background?.value);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto w-[1248px] px-6 py-14">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3 pr-8 flex items-center">
            <div className="mb-6 w-full">
              {overviewDescription && (
                <div className="text-gray-700 text-justify leading-relaxed">
                  <div
                    className="space-y-6 [&>p]:mb-4 [&>h1]:mb-6 [&>h2]:mb-6 [&>h3]:mb-6"
                    dangerouslySetInnerHTML={{
                      __html: overviewDescription,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          {/* Right side image */}
          <div className="w-full md:w-1/3 flex items-center justify-center p-4">
            <div className="rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <img
                src={overviewBackground}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
