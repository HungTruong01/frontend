import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewsCard from "./NewsCard";
import { getAllPosts } from "@/api/postApi";

const News = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

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
          <div>
            <h2 className="font-semibold text-3xl mb-2">Tin tức</h2>
            <p className="text-gray-600">
              Thông tin xuất nhập khẩu, khuyến mãi và ưu đãi cho khách hàng
            </p>
          </div>
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
