import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/order-details";

axios.defaults.withCredentials = true;

export const getAllOrderDetails = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

export const createOrderDetails = async (orderDetailList) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, orderDetailList);
    return response.data;
  } catch (error) {
    console.error("Error creating order details:", error);
    throw error;
  }
};

export const updateOrderDetailsByOrderId = async (orderId, orderDetailList) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/orders/${orderId}`,
      orderDetailList
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order details:", error);
    throw error;
  }
};

export const deleteOrderDetail = async (orderDetailId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${orderDetailId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting order detail:", error);
    throw error;
  }
};
