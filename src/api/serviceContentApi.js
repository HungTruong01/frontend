import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/service-contents";

axios.defaults.withCredentials = true;

export const getAllServiceContents = async (
  pageNo,
  pageSize,
  sortBy,
  sortDir
) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getServiceContent = async (id) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting service content by id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addServiceContent = async (serviceContentData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, serviceContentData);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding service content:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateServiceContent = async (id, serviceContentData) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${id}`,
      serviceContentData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating service content:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteServiceContent = async (id) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting service content:",
      error.response?.data || error.message
    );
    throw error;
  }
};
