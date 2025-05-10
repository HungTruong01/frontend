import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/feature-contents";

axios.defaults.withCredentials = true;

export const getAllFeatureContents = async (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getFeatureContent = async (id) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting feature content by id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addFeatureContent = async (featureContentData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, featureContentData);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding feature content:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateFeatureContent = async (id, featureContentData) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${id}`,
      featureContentData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating feature content:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteFeatureContent = async (id) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting feature content:",
      error.response?.data || error.message
    );
    throw error;
  }
};
