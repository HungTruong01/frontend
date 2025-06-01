import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/order-types";

axios.defaults.withCredentials = true;

export const getAllOrderTypes = async (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};

export const createOrderType = async (orderType) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, orderType);
    return response.data;
  } catch (error) {
    console.error("Error creating order type:", error);
    throw error;
  }
};

export const updateOrderType = async (orderTypesId, orderType) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${orderTypesId}`,
      orderType
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order type:", error);
    throw error;
  }
};

export const deleteOrderType = async (orderTypesId) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${orderTypesId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order type:", error);
    throw error;
  }
};

export const getOrderTypeById = async (orderTypesId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${orderTypesId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order type by ID:", error);
    throw error;
  }
};
