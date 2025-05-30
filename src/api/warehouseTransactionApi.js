/* eslint-disable no-useless-catch */
import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/warehouse-transactions";

axios.defaults.withCredentials = true;

export const getAllWarehouseTransaction = async (
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
    console.error("Error fetching warehouse transaction:", error);
    throw error;
  }
};

export const createWarehouseTransaction = async (warehouseTransaction) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, warehouseTransaction);
    return response.data;
  } catch (error) {
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
