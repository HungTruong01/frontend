import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/orders";

axios.defaults.withCredentials = true;

export const getAllOrders = async (pageNo, pageSize, sortBy, sortDir) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
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

export const analyzeWithCondition = async (year) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/monthly-revenue`, {
      params: { year },
    });
    return response.data;
  } catch (error) {
    console.error("Xảy ra lỗi:", error);
    throw error;
  }
};
export const analyzeWithConditionQuality = async (year) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/quarterly-revenue`, {
      params: { year },
    });
    return response.data;
  } catch (error) {
    console.error("Xảy ra lỗi:", error);
    throw error;
  }
};
export const analyzeWithConditionYear = async (year) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/year-revenue`, {
      params: { year },
    });
    if (response.data?.content?.[0]?.label !== `Năm ${year}`) {
      console.log(`Data returned is not for requested year ${year}`);
      return { content: [] };
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`No data found for year ${year}`);
      return { content: [] };
    }
    console.error(`Error fetching data for year ${year}:`, error);
    throw new Error(`Failed to fetch data for year ${year}: ${error.message}`);
  }
};
