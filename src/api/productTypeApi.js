import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/product-types";

axios.defaults.withCredentials = true;

export const getAllProductTypes = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching product type:", error);
    throw error;
  }
};

export const createProductType = async (productType) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, productType);
    return response.data;
  } catch (error) {
    console.error("Error creating product type:", error);
    throw error;
  }
};

export const updateProductType = async (productTypesId, productType) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${productTypesId}`,
      productType
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product type:", error);
    throw error;
  }
};

export const deleteProductType = async (productTypesId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${productTypesId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product type:", error);
    throw error;
  }
};

export const getProductTypeById = async (productTypesId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${productTypesId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product type by ID:", error);
    throw error;
  }
};
