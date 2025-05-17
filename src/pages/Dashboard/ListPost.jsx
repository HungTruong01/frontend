import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaRegTrashAlt,
  FaPlus,
} from "react-icons/fa";
import {
  getPostById,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/api/postApi";
import AddPostModal from "@/components/Dashboard/post/AddPostModal";
import EditPostModal from "@/components/Dashboard/post/EditPostModal";
import PostDetailModal from "@/components/Dashboard/post/PostDetailModal";
import { toast } from "react-toastify";

const ListPost = () => {
  const [posts, setPosts] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentDetailPostId, setCurrentDetailPostId] = useState(null);
  const [currentEditPost, setCurrentEditPost] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { key: "id", label: "Mã" },
    { key: "title", label: "Tiêu đề" },
    { key: "posted_at", label: "Ngày đăng" },
    { key: "updated_at", label: "Ngày cập nhật" },
  ];

  useEffect(() => {
    listPosts();
  }, []);

  const listPosts = async () => {
    setIsLoading(true);
    try {
      const res = await getAllPosts(0, 100, "id", "asc");
      setPosts(res.data.content);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài đăng:", error);
      toast.error("Không thể tải danh sách bài đăng");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    return posts.filter((post) =>
      (post.title || "").toLowerCase().includes(searchTitle.toLowerCase())
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
      if (!newPost.title || !newPost.content) {
        toast.error("Tiêu đề và nội dung không được để trống");
        return Promise.reject(new Error("Invalid post data"));
      }

      // Gọi trực tiếp API với newPost object
      await createPost(newPost);
      toast.success("Thêm bài đăng thành công");
      await listPosts();
      setIsAddModalOpen(false);
      return Promise.resolve();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Không thể thêm bài đăng";
      toast.error(errorMessage);
      console.error("Error adding post:", error);
      return Promise.reject(error);
    }
  };

  const handleEditClick = async (post) => {
    try {
      setIsLoading(true);
      const detailPost = await getPostById(post.id);
      if (!detailPost) {
        throw new Error("Không nhận được dữ liệu từ API");
      }
      
      // Transform the data to match the expected structure
      const editPost = {
        id: detailPost.id,
        title: detailPost.title || '',
        content: detailPost.content || '',
        thumbnail: detailPost.thumbnail || '',
        postedAt: detailPost.postedAt,
        updatedAt: detailPost.updatedAt
      };
      
      console.log('Transformed post data:', editPost);
      setCurrentEditPost(editPost);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Không thể tải thông tin bài đăng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (updatedPost) => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!updatedPost.title?.trim() || !updatedPost.content?.trim()) {
        throw new Error("Tiêu đề và nội dung không được để trống");
      }

      // Gửi trực tiếp dữ liệu mà không wrap trong FormData
      const response = await updatePost(updatedPost.id, {
        title: updatedPost.title.trim(),
        content: updatedPost.content.trim(),
        thumbnail: updatedPost.thumbnail || "",
        postedAt: updatedPost.postedAt,
        updatedAt: new Date().toISOString()
      });
      
      if (!response) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      setIsEditModalOpen(false);
      setCurrentEditPost(null);
      await listPosts();
      toast.success("Cập nhật bài đăng thành công");

    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(error.message || "Không thể cập nhật bài đăng");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "N/A";
    }
  };

  const handleViewDetail = async (post) => {
    try {
      setIsLoading(true);
      const detailPost = await getPostById(post.id);
      setCurrentDetailPostId(post.id);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error("Không thể tải chi tiết bài đăng");
      console.error("Error fetching post details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (post) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài đăng "${post.title}"?`)) {
      try {
        setIsLoading(true);
        await deletePost(post.id);
        toast.success("Xóa bài đăng thành công");
        await listPosts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Không thể xóa bài đăng");
        console.error("Error deleting post:", error);
      } finally {
        setIsLoading(false);
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
      {currentEditPost && isEditModalOpen && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentEditPost(null);
          }}
          onSubmit={handleEditSubmit}
          post={currentEditPost}
        />
      )}

      {currentDetailPostId && isDetailModalOpen && (
        <PostDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setCurrentDetailPostId(null);
          }}
          postId={currentDetailPostId}
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách bài đăng
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo tiêu đề..."
                value={searchTitle}
                onChange={handleSearchTitleChange}
                className="w-64 px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
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
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-4 text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-4 text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                paginatedData.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-left">{post.id}</td>
                    <td className="py-3 px-4 text-left">{post.title}</td>
                    <td className="py-3 px-4 text-left">
                      {formatDate(post.postedAt)}
                    </td>
                    <td className="py-3 px-4 text-left">
                      {formatDate(post.updatedAt)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleViewDetail(post)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Xem chi tiết"
                          disabled={isLoading}
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(post)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Sửa"
                          disabled={isLoading}
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          className="text-red-500 hover:text-red-700"
                          title="Xóa"
                          disabled={isLoading}
                        >
                          <FaRegTrashAlt className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Hiển thị{" "}
            {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
            đến {Math.min(currentPage * itemsPerPage, filteredData.length)} của{" "}
            {filteredData.length} bản ghi
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Trước
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-md text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
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
