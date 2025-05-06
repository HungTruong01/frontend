import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/product-units";

axios.defaults.withCredentials = true;

export const getAllProductUnits = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching product unit:", error);
    throw error;
  }
};

export const createProductUnit = async (productUnit) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, productUnit);
    return response.data;
  } catch (error) {
    console.log("Error creating product unit:", error);
  }
};

export const updateProductUnit = async (productUnitId, productUnit) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${productUnitId}`,
      productUnit
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product unit:", error);
    throw error;
  }
};

export const deleteProductUnit = async (productUnitId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${productUnitId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product unit:", error);
    throw error;
  }
};

export const getProductUnitById = async (productUnitId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${productUnitId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product unit by ID:", error);
    throw error;
  }
};
