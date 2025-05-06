import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/order-status";

axios.defaults.withCredentials = true;

export const getAllOrderStatus = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching order status:", error);
    throw error;
  }
};

export const createOrderStatus = async (orderStatus) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, orderStatus);
    return response.data;
  } catch (error) {
    console.error("Error creating order status:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderStatusId, orderStatus) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${orderStatusId}`,
      orderStatus
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const deleteOrderStatus = async (orderStatusId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${orderStatusId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting order status:", error);
    throw error;
  }
};

export const getOrderStatusById = async (orderStatusId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${orderStatusId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order status by ID:", error);
    throw error;
  }
};
