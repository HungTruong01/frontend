import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/users";

axios.defaults.withCredentials = true;

export const getAllUsers = async (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getAccountById = async (id) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting account by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      accountData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating account:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    const response = await axios.put(`${BASE_REST_API_URL}/${id}`, accountData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating account:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting account:",
      error.response?.data || error.message
    );
    throw error;
  }
};
