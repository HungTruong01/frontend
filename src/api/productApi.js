import axios from "axios";

const BASE_API_URL = "http://localhost:8080/api/products";

axios.defaults.withCredentials = true;

export const getAllProducts = async (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log(
      "Lỗi khi lấy sản phẩm theo ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post(BASE_API_URL, {
      ...productData,
      thumbnail: productData.thumbnail || "",
    });
    return response.data;
  } catch (error) {
    console.log("Lỗi khi tạo sản phẩm:", error.response?.data || error.message);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${BASE_API_URL}/${id}`, {
      ...productData,
      thumbnail: productData.thumbnail || "",
    });
    return response.data;
  } catch (error) {
    console.log(
      "Lỗi khi cập nhật sản phẩm:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
    throw error;
  }
};
