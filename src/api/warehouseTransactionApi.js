import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/warehouse-transactions";

axios.defaults.withCredentials = true;

export const getAllWarehouseTransaction = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse transaction:", error);
    throw error;
  }
};

export const createWarehouseTransaction = async (warehouseTransaction) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, warehouseTransaction);
    return response.data;
  } catch (error) {
    console.error("Error creating warehouse transaction :", error);
    throw error;
  }
};

export const updateWarehouseTransaction = async (
  warehouseTransactionId,
  warehouseTransaction
) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${warehouseTransactionId}`,
      warehouseTransaction
    );
    return response.data;
  } catch (error) {
    console.error("Error updating warehouse transaction :", error);
    throw error;
  }
};

export const deleteWarehouseTransaction = async (warehouseTransactionId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${warehouseTransactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting warehouse transaction :", error);
    throw error;
  }
};

export const getWarehouseTransactionById = async (warehouseTransactionId) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/${warehouseTransactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse transaction by ID:", error);
    throw error;
  }
};
