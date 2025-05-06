import React from "react";
import { useParams } from "react-router-dom";
import NewsCard from "./NewsCard";
import { useEffect, useState } from "react";
import { getPostById, getAllPosts } from "@/api/postApi"; // Đường dẫn đến file api

const NewDetailTemplate = () => {
  const { slug } = useParams(); // slug chính là id trong URL: /news/:id
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPostById(slug); // slug chính là id bài viết
        setPost(res);
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

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await getAllPosts(0, 10, "postedAt", "desc");
        if (!res.data) {
          throw new Error("Không thể tải bài viết liên quan");
        }
        const related = res.data.content.filter((item) => item.id !== parseInt(slug));
        setRelatedPosts(related.slice(0, 10));
      } catch (error) {
        console.error("Không thể tải bài viết liên quan:", error);
      }
    };
  
    fetchRelated();
  }, [slug]);  

  if (!post) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-white-100 py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <img
            src={`/public/${post.thumbnail}`}
            alt={post.title}
            className="w-full h-80 object-cover rounded-lg mb-8"
        />

        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-justify">{post.title}</h1>
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
              {relatedPosts.map((posts) => (
                <NewsCard
                  key={posts.id}
                  id={posts.id}
                  title={posts.title}
                  date={new Date(posts.postedAt).toLocaleDateString("vi-VN")}
                  image={`/public/${posts.thumbnail}`}
                  excerpt={
                    posts.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..."
                  }
                  link={`/news/${posts.id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDetailTemplate;
