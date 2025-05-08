import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import Pagination from "./Pagination";
import RecentPosts from "./RecentPosts";
import { getAllPosts } from "@/api/postApi";

const NewsPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts(
          currentPage - 1,
          itemsPerPage,
          "postedAt",
          "desc"
        );
        console.log(response.data.content);

        const mappedPosts = response.data.content.map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.content
            ? post.content
                .replace(/<[^>]+>/g, "")
                .slice(0, 100)
                .trim() + "..."
            : "Không có nội dung.",
          date: new Date(post.postedAt).toLocaleDateString("vi-VN"),
          image: post.thumbnail,
          link: `/news/${post.id}`,
        }));

        setPosts(mappedPosts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, [currentPage]);

  return (
    <div className="w-full min-h-[80vh] bg-white flex flex-col items-center">
      <div className="max-w-7xl px-6 py-6 w-full">
        {/* Tiêu đề trang tin tức */}
        <h2 className="font-semibold text-3xl mb-3 text-left md:text-center">
          Tin tức
        </h2>
        <p className="text-gray-600 mb-10 text-left md:text-center">
          Thông tin xuất nhập khẩu, khuyến mãi và ưu đãi
        </p>

        {/* Danh sách tin tức */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {posts.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>

        {/* Phân trang */}
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
