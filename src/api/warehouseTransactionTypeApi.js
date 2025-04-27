import axios from "axios";

const BASE_REST_API_URL =
  "http://localhost:3000/api/warehouse-transaction-types";

axios.defaults.withCredentials = true;

export const getAllWarehouseTransactionType = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse transaction types:", error);
    throw error;
  }
};

export const createWarehouseTransactionType = async (
  warehouseTransactionType
) => {
  try {
    const response = await axios.post(
      BASE_REST_API_URL,
      warehouseTransactionType
    );
    return response.data;
  } catch (error) {
    console.error("Error creating warehouse transaction type:", error);
    throw error;
  }
};

export const updateWarehouseTransactionType = async (
  warehouseTransactionTypeId,
  warehouseTransactionType
) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${warehouseTransactionTypeId}`,
      warehouseTransactionType
    );
    return response.data;
  } catch (error) {
    console.error("Error updating warehouse transaction type:", error);
    throw error;
  }
};

export const deleteWarehouseTransactionType = async (
  warehouseTransactionTypeId
) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${warehouseTransactionTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting warehouse transaction type:", error);
    throw error;
  }
};

export const getWarehouseTransactionTypeById = async (
  warehouseTransactionTypeId
) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/${warehouseTransactionTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse transaction types by ID:", error);
    throw error;
  }
};
