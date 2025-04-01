import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaRegEdit,
  FaRegTrashAlt,
  FaPlus,
} from "react-icons/fa";
import { postApi } from "@/api/postApi";
import AddPostModal from "@/components/Dashboard/AddPostModal";
import EditPostModal from "@/components/Dashboard/EditPostModal";
import PostDetailModal from "@/components/Dashboard/PostDetailModal";
import { toast } from "react-toastify";

const ListPost = () => {
  const [posts, setPosts] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const columns = [
    { key: "id", label: "Mã bài viết" },
    { key: "title", label: "Tiêu đề" },
    { key: "postedDate", label: "Ngày đăng" },
    { key: "updatedDate", label: "Ngày cập nhật" },
  ];

  const fetchPosts = async () => {
    try {
      const data = await postApi.getAllPosts();
      setPosts(data.content || data);
    } catch (error) {
      toast.error("Không thể tải danh sách bài viết");
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPosts = () => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleSearchTitleChange = (e) => {
    setSearchTitle(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNew = async (newPost) => {
    try {
      await postApi.addPost(newPost);
      toast.success("Thêm bài viết thành công");
      await fetchPosts();
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error("Không thể thêm bài viết");
      console.error("Error adding post:", error);
    }
  };

  const handleEditClick = (post) => {
    setCurrentPost(post);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedPost) => {
    try {
      await postApi.updatePost(updatedPost.id, updatedPost);
      toast.success("Cập nhật bài viết thành công");
      await fetchPosts();
      setIsEditModalOpen(false);
      setCurrentPost(null);
    } catch (error) {
      toast.error("Không thể cập nhật bài viết");
      console.error("Error updating post:", error);
    }
  };

  const handleViewDetail = (post) => {
    setCurrentPost(post);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (post) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.title}"?`)) {
      try {
        await postApi.deletePost(post.id);
        toast.success("Xóa bài viết thành công");
        fetchPosts();
      } catch (error) {
        toast.error("Không thể xóa bài viết");
        console.error("Error deleting post:", error);
      }
    }
  };

  const filteredData = filterPosts();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <AddPostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddNew}
      />
      {currentPost && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentPost(null);
          }}
          onSubmit={handleEditSubmit}
          post={currentPost}
        />
      )}
      {currentPost && (
        <PostDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setCurrentPost(null);
          }}
          post={currentPost}
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách bài viết
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tiêu đề..."
                  value={searchTitle}
                  onChange={handleSearchTitleChange}
                  className="w-64 px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FaSearch className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Thêm mới
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="py-3 px-4 font-semibold text-sm text-left min-w-[100px]"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 font-semibold text-sm text-center min-w-[120px]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="py-3 px-4 text-sm text-gray-600 text-left truncate max-w-[200px]"
                    >
                      {col.key === "posted_at" || col.key === "updated_at" ? (
                        new Date(post[col.key]).toLocaleDateString("vi-VN")
                      ) : (
                        <span title={post[col.key] || "-"}>
                          {post[col.key] || "-"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleViewDetail(post)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Xem chi tiết"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(post)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Sửa"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Xóa"
                      >
                        <FaRegTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} của{" "}
            {filteredData.length} bản ghi
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              Trước
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPost;
