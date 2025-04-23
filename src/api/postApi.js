import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/posts";

axios.defaults.withCredentials = true; // Đảm bảo axios gửi cookies cùng yêu cầu

// Thêm interceptors để debug
axios.interceptors.request.use((request) => {
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Error Response:", error.response || error);
    return Promise.reject(error);
  }
);

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

// Tạo bài viết, sửa cấu hình Content-Type
export const createPost = async (formData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cập nhật bài viết, thêm headers
export const updatePost = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_REST_API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating post:",
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
