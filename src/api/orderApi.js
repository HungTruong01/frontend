import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/orders";

axios.defaults.withCredentials = true;

export const getAllOrders = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrdersByPartnerId = async (partnerId) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/partners/${partnerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

export const createOrder = async (order) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, order);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrder = async (orderId, order) => {
  try {
    const response = await axios.put(`${BASE_REST_API_URL}/${orderId}`, order);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${BASE_REST_API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
