import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/posts";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((request) => {
  return request;
});

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting post by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllPosts = (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, {
      ...postData,
      thumbnail: postData.thumbnail || "",
    });
    return response.data;
  } catch (error) {
    console.log("Lỗi khi tạo bài đăng:", error.response?.data || error.message);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const response = await axios.put(`${BASE_REST_API_URL}/${id}`, {
      ...postData,
      thumbnail: postData.thumbnail || "",
    });
    return response.data;
  } catch (error) {
    console.log(
      "Lỗi khi cập nhật bài đăng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa bài viết
export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting post:",
      error.response?.data || error.message
    );
    throw error;
  }
};
