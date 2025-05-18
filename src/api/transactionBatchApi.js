import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/transaction-batches";

axios.defaults.withCredentials = true;

export const getAllTransactionBatches = async (
  pageNo,
  pageSize,
  sortBy,
  sortDir
) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getTransactionBatchById = async (id) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting transaction batch by id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addTransactionBatch = async (transactionBatchData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, transactionBatchData);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding transaction batch:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTransactionBatch = async (id, transactionBatchData) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${id}`,
      transactionBatchData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating transaction batch:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTransactionBatch = async (id) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting transaction batch:",
      error.response?.data || error.message
    );
    throw error;
  }
};
