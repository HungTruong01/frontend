import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/import-batches";

axios.defaults.withCredentials = true;

export const getAllImportBatches = async (
  pageNo,
  pageSize,
  sortBy,
  sortDir
) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getImportBatchById = async (id) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting import batch by id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addImportBatch = async (importBatchData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, importBatchData);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding import batch:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateImportBatch = async (id, importBatchData) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${id}`,
      importBatchData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating import batch:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteImportBatch = async (id) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting import batch:",
      error.response?.data || error.message
    );
    throw error;
  }
};
