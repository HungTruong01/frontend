import axios from "axios";

const BASE_REST_API_URL =
  "http://localhost:3000/api/inventory-adjustment-types";

axios.defaults.withCredentials = true;

export const getAllInventoryAdjustmentType = async (
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
    console.error("Error fetching inventory adjustment types:", error);
    throw error;
  }
};

export const getInventoryAdjustmentTypeById = async (
  inventoryAdjustmentTypeId
) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/${inventoryAdjustmentTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory adjustment types by id:", error);
    throw error;
  }
};

export const createInventoryAdjustmentType = async (
  inventoryAdjustmentType
) => {
  try {
    const response = await axios.post(
      BASE_REST_API_URL,
      inventoryAdjustmentType
    );
    return response.data;
  } catch (error) {
    console.error("Error creating inventory adjustment type:", error);
    throw error;
  }
};

export const updateInventoryAdjustmentType = async (
  inventoryAdjustmentTypeId,
  inventoryAdjustmentType
) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${inventoryAdjustmentTypeId}`,
      inventoryAdjustmentType
    );
    return response.data;
  } catch (error) {
    console.error("Error updating inventory adjustment type:", error);
    throw error;
  }
};

export const deleteInventoryAdjustmentType = async (
  inventoryAdjustmentTypeId
) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${inventoryAdjustmentTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting inventory adjustment type:", error);
    throw error;
  }
};

export const getWarehouseTransactionTypeById = async (
  inventoryAdjustmentTypeId
) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/${inventoryAdjustmentTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory adjustment types by ID:", error);
    throw error;
  }
};
