import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewsCard from "./NewsCard";
import Pagination from "./Pagination";
import { getPostById, getAllPosts } from "@/api/postApi"; // Đường dẫn đến file api

const NewDetailTemplate = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [totalPages, setTotalPages] = useState(1);

  const [shouldScroll, setShouldScroll] = useState(true); // Biến điều khiển cuộn

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPostById(slug);
        setPost(res);
        setShouldScroll(true); // Chỉ cuộn lên đầu khi bài viết chi tiết được tải
        document.title = res.title;
      } catch (error) {
        console.error("Không thể tải bài viết:", error);
        setPost({
          title: "Không tìm thấy bài viết",
          postedAt: "",
          thumbnail: "",
          content: "Nội dung không tồn tại hoặc đã bị xóa.",
        });
      }
    };

    fetchData();
  }, [slug]);

  // Fetch bài viết liên quan
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Tăng số lượng bài viết cần lấy để đảm bảo đủ sau khi lọc
        const response = await getAllPosts(
          currentPage - 1,
          itemsPerPage + 1, // Tăng lên 1 để bù cho bài viết có thể bị lọc
          "postedAt",
          "desc"
        );
  
        // Lọc và map data
        const filteredPosts = response.data.content
          .filter(item => item.id !== parseInt(slug))
          .slice(0, itemsPerPage); // Chỉ lấy đúng số lượng cần hiển thị
  
        const mappedPosts = filteredPosts.map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.content.replace(/<[^>]+>/g, "").slice(0, 100).trim() + "...",
          date: new Date(item.postedAt).toLocaleDateString("vi-VN"),
          image: `/public/${item.thumbnail}`,
          link: `/news/${item.id}`,
        }));
  
        setRelatedPosts(mappedPosts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Không thể tải bài viết liên quan:", error);
      }
    };
  
    fetchRelated();
  }, [currentPage, slug]);

  useEffect(() => {
    // Chỉ cuộn lên đầu khi bài viết chi tiết đã được tải
    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setShouldScroll(false); // Reset lại để tránh cuộn khi liên quan được tải
    }
  }, [post, shouldScroll]);

  if (!post) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-white-100 mb-20">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <img
          src={`/public/${post.thumbnail}`}
          alt={post.title}
          className="w-full h-80 object-cover rounded-lg mb-8"
        />

        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-justify">
            {post.title}
          </h1>
          <p className="text-gray-500 mb-6">
            Cập nhật: {new Date(post.postedAt).toLocaleDateString("vi-VN")}
          </p>

          <div
            className="text-gray-700 leading-relaxed mb-8 text-justify"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Bài viết liên quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <NewsCard key={post.id} {...post} />
              ))}
            </div>

            {/* Thêm phân trang sử dụng component Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                shouldScroll={false} // Không cuộn khi phân trang bài viết liên quan
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDetailTemplate;
