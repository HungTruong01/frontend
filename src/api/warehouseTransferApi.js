import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/warehouse-transfers";

axios.defaults.withCredentials = true;

export const getAllWarehouseTransfer = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse transfers:", error);
    throw error;
  }
};

export const createWarehouseTransfer = async (warehouseTransfer) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, warehouseTransfer);
    return response.data;
  } catch (error) {
    console.error("Error creating warehouse transfer:", error);
    throw error;
  }
};

export const updateWarehouseTransfer = async (
  warehouseTransferId,
  warehouseTransfer
) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${warehouseTransferId}`,
      warehouseTransfer
    );
    return response.data;
  } catch (error) {
    console.error("Error updating warehouse transfer:", error);
    throw error;
  }
};

export const deleteWarehouseTransfer = async (warehouseTransferId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${warehouseTransferId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting warehouse transfer:", error);
    throw error;
  }
};

export const getWarehouseTransferById = async (warehouseTransferId) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/${warehouseTransferId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse transfers by ID:", error);
    throw error;
  }
};
