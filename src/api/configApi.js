import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/configs";

axios.defaults.withCredentials = true;

export const getAllConfigs = async (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getConfig = async (field) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${field}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting config by field:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addConfig = async (configData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, configData);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding config:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateConfig = async (field, configData) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${field}`,
      configData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating config:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteConfig = async (field) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${field}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting config:",
      error.response?.data || error.message
    );
    throw error;
  }
};
