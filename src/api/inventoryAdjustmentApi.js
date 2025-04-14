import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/inventory-adjustments";

axios.defaults.withCredentials = true;

export const getAllInventoryAdjustment = async (
  pageNo,
  pageSize,
  sortBy,
  sortDir
) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory adjustment:", error);
    throw error;
  }
};

export const getInventoryAdjustmentById = async (inventoryAdjustmentId) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/${inventoryAdjustmentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory adjustment by id:", error);
    throw error;
  }
};

export const createInventoryAdjustment = async (inventoryAdjustmentType) => {
  try {
    const response = await axios.post(
      BASE_REST_API_URL,
      inventoryAdjustmentType
    );
    return response.data;
  } catch (error) {
    console.error("Error creating inventory adjustment:", error);
    throw error;
  }
};

export const updateInventoryAdjustment = async (
  inventoryAdjustmentId,
  inventoryAdjustment
) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${inventoryAdjustmentId}`,
      inventoryAdjustment
    );
    return response.data;
  } catch (error) {
    console.error("Error updating inventory adjustment:", error);
    throw error;
  }
};

export const deleteInventoryAdjustment = async (inventoryAdjustmentId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${inventoryAdjustmentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting inventory adjustment:", error);
    throw error;
  }
};
