import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/partners";

axios.defaults.withCredentials = true;

export const getAllPartners = async (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getPartnerById = async (id) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting partner by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addPartner = async (partnerData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, partnerData);
    return response.data;
  } catch (error) {
    console.error("Error creating partner:", error);
    throw error;
  }
};

export const updatePartner = async (id, partnerData) => {
  try {
    const response = await axios.put(`${BASE_REST_API_URL}/${id}`, partnerData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating partner:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deletePartner = async (id) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting partner:",
      error.response?.data || error.message
    );
    throw error;
  }
};
