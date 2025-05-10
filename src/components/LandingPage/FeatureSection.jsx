import React from "react";
import image from "../../assets/img.jpg";
import { getConfig } from "@/api/configApi";
import { useState, useEffect } from "react";
import { getAllFeatureContents } from "@/api/featureContentApi";

import * as IoIcons from 'react-icons/io5';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';

const FeatureSection = () => {
  const [aboutMotto, setAboutMoto] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [aboutContentImageUrl, setaboutContentImageUrl] = useState(null);
  const [featureContents, setFeatureContents] = useState([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const motto = await getConfig("aboutMotto");
        const content = await getConfig("aboutContent");
        const background = await getConfig("aboutContentImageUrl");
        setAboutMoto(motto?.value);
        setAboutContent(content?.value);
        setaboutContentImageUrl(background?.value);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchFeatureContent = async () => {
      try {
        const response = await getAllFeatureContents(0, 5, "id", "asc");
        const mappedFeatureContents = response.data.content.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          icon: item.icon,
        }));
        setFeatureContents(mappedFeatureContents);
      } catch (error) {
        console.error("Error fetching feature content:", error);
      }
    };
    fetchFeatureContent();
  }, []);

  const getIconComponent = (iconName) => {
  // Tách prefix và tên icon
  const prefix = iconName.substring(0, 2).toLowerCase();
  // Map prefix với bộ icon tương ứng
  const iconSet = {
    'io': IoIcons,
    'fa': FaIcons,
    'ai': AiIcons,
    'bi': BiIcons,
    'bs': BsIcons,
    'md': MdIcons,
  }[prefix];
  // Lấy component icon từ bộ icon
  if (iconSet && iconSet[iconName]) {
    return iconSet[iconName];
  }
  return null;
};

  return (
    <div className="w-full bg-white py-16">
      <div className="container mx-auto w-[1248px] px-6">
        <div className="text-center mb-12">
          {aboutMotto && (
            <div
              dangerouslySetInnerHTML={{
                __html: aboutMotto,
              }}
            ></div>
          )}
        </div>

        <div className="flex justify-center gap-8 flex-nowrap">
  {featureContents.map((item) => {
    const IconComponent = getIconComponent(item.icon);

    return (
      <div
        key={item.id}
        className="w-64 flex-shrink-0 flex flex-col items-center text-center px-4"
      >
        <div className="h-16 w-16 text-3xl bg-black text-white rounded-full flex items-center justify-center mb-6">
          {IconComponent ? <IconComponent /> : null}
        </div>
        <h3 className="font-bold text-lg mb-4">{item.title}</h3>
        <p className="text-gray-700 text-justify">{item.description}</p>
      </div>
    );
  })}
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-10 px-4 py-8 mt-12">
          <div className="text-justify">
            {aboutContent && (
              <div
                className="space-y-2 [&>p]:mb-2 [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: aboutContent,
                }}
              ></div>
            )}
          </div>
          <div className="h-full bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={ aboutContentImageUrl || image}
              alt="image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
