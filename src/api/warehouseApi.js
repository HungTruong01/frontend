import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/warehouses";

axios.defaults.withCredentials = true;

export const getAllWarehouse = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse:", error);
    throw error;
  }
};

export const createWarehouse = async (warehouse) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, warehouse);
    return response.data;
  } catch (error) {
    console.error("Error creating warehouse:", error);
    throw error;
  }
};

export const updateWarehouse = async (warehouseId, warehouse) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${warehouseId}`,
      warehouse
    );
    return response.data;
  } catch (error) {
    console.error("Error updating warehouse:", error);
    throw error;
  }
};

export const deleteWarehouse = async (warehouseId) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${warehouseId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    throw error;
  }
};

export const getWarehouseById = async (warehouseId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${warehouseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse by ID:", error);
    throw error;
  }
};
