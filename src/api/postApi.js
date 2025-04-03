import axios from "axios";

const API_URL = "http://localhost:8080/api";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.data);
    return response;
  },
  (error) => {
    if (error.response?.status === 403) {
      console.error(
        "Lỗi 403: Không có quyền truy cập. Vui lòng kiểm tra quyền của bạn."
      );
    }
    if (error.response?.status === 415) {
      console.error(
        "Lỗi 415: Định dạng dữ liệu không được hỗ trợ. Vui lòng kiểm tra Content-Type và định dạng dữ liệu."
      );
    }
    if (error.response?.status === 500) {
      console.error("Lỗi 500: Lỗi server. Chi tiết:", error.response?.data);
    }
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const postApi = {
  getAllPosts: async () => {
    try {
      const response = await axiosInstance.get("/posts");
      return response.data;
    } catch (error) {
      console.log("Error fetching posts");
      throw error;
    }
  },

  addPost: async (postData) => {
    try {
      const formattedData = {
        content: postData.content,
        title: postData.title,
        thumbnail: postData.thumbnail,
        posted_at: postData.posted_at,
        updated_at: postData.updated_at,
      };

      const response = await axiosInstance.post("/posts", formattedData);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding post:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const formattedData = {
        content: postData.content,
        title: postData.title,
        thumbnail: postData.thumbnail,
        posted_at: postData.posted_at,
        updated_at: postData.updated_at,
      };
      const response = await axiosInstance.put(`/posts/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating post:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await axiosInstance.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching post details:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
