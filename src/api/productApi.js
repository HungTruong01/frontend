import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/products";

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

export const getProductsByProductTypeId = async (
  pageNo,
  pageSize,
  sortBy,
  sortDir,
  productTypeId
) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/product-types/${productTypeId}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    return response.data;
  } catch (error) {
    console.log(
      "Lỗi khi lấy sản phẩm theo loại sản phẩm:",
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
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.put(`${BASE_API_URL}/${id}`, {
      ...productData,
      thumbnail: productData.thumbnail || "",
    });
    return response.data;
  } catch (error) {
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
