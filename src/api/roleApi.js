import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/roles";

axios.defaults.withCredentials = true;

export const getAllRoles = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const createRole = async (role) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, role);
    return response.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

export const updateRole = async (roleId, role) => {
  try {
    const response = await axios.put(`${BASE_REST_API_URL}/${roleId}`, role);
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${roleId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

export const getRoleById = async (roleId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${roleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching role by ID:", error);
    throw error;
  }
};
