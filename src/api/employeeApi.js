import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/employees";

axios.defaults.withCredentials = true;

export const getAllEmployees = async (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting employee by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, employeeData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating employee:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${id}`,
      employeeData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating employee:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting employee:",
      error.response?.data || error.message
    );
    throw error;
  }
};
