import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewsCard from "./NewsCard";
import { getAllPosts } from "@/api/postApi";
import { getConfig } from "@/api/configApi";

const News = () => {
  const [posts, setPosts] = useState([]);
  const [newsContent, setNewsContent] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const newsContent = await getConfig("newsContent");
        setNewsContent(newsContent?.value);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await getAllPosts(0, 4, "postedAt", "desc");
        const latestPosts = response.data.content.map((post) => ({
          id: post.id,
          title: post.title,
          excerpt:
            post.content
              .replace(/<[^>]+>/g, "")
              .slice(0, 100)
              .trim() + "...",
          date: new Date(post.postedAt).toLocaleDateString("vi-VN"),
          image: post.thumbnail, // dùng trực tiếp URL từ DB
          link: `/news/${post.id}`,
        }));
        setPosts(latestPosts);
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <div className="w-full h-[660px] bg-white flex items-center">
      <div className="container mx-auto max-w-[1248px] px-6">
        <div className="flex justify-between tracking-wider mb-6">
          { newsContent && (
            <div
                dangerouslySetInnerHTML={{
                  __html: newsContent,
                }}
            ></div>
          )}
          <button
            onClick={() => navigate("/news")}
            className="px-6 py-2 rounded-2xl cursor-pointer border border-gray-500 text-black font-semibold hover:text-blue-600 transition duration-300"
          >
            Xem Tất Cả
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {posts.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
