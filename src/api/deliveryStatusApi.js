import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/status";

axios.defaults.withCredentials = true;

export const getAllDeliveryStatus = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching delivery status:", error);
    throw error;
  }
};

export const createDeliveryStatus = async (deliveryStatus) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, deliveryStatus);
    return response.data;
  } catch (error) {
    console.error("Error creating delivery status:", error);
    throw error;
  }
};

export const updateDeliveryStatus = async (
  deliveryStatusId,
  deliveryStatus
) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${deliveryStatusId}`,
      deliveryStatus
    );
    return response.data;
  } catch (error) {
    console.error("Error updating delivery status:", error);
    throw error;
  }
};

export const deleteDeliveryStatus = async (deliveryStatusId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${deliveryStatusId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting delivery status:", error);
    throw error;
  }
};

export const getDeliveryStatusById = async (deliveryStatusId) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/${deliveryStatusId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching delivery status by ID:", error);
    throw error;
  }
};
