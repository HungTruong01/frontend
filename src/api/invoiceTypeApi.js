import axios from "axios";

const BASE_REST_API_URL = "http://localhost:3000/api/invoice-types";

axios.defaults.withCredentials = true;

export const getAllInvoiceTypes = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice type:", error);
    throw error;
  }
};

export const createInvoiceType = async (invoiceType) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, invoiceType);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice type:", error);
    throw error;
  }
};

export const updateInvoiceType = async (invoiceTypesId, invoiceType) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${invoiceTypesId}`,
      invoiceType
    );
    return response.data;
  } catch (error) {
    console.error("Error updating invoice type:", error);
    throw error;
  }
};

export const deleteInvoiceType = async (invoiceTypesId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${invoiceTypesId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice type:", error);
    throw error;
  }
};

export const getInvoiceTypeById = async (invoiceTypesId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${invoiceTypesId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice type by ID:", error);
    throw error;
  }
};
