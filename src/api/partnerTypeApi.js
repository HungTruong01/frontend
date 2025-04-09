import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/partner-types";

axios.defaults.withCredentials = true;

export const getAllPartnerTypes = async () => {
  try {
    const response = await axios.get(BASE_REST_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching partner type:", error);
    throw error;
  }
};

export const createPartnerType = async (partnerType) => {
  try {
    const response = await axios.post(BASE_REST_API_URL, partnerType);
    return response.data;
  } catch (error) {
    console.log("Error creating partner type:", error);
  }
};

export const updatePartnerType = async (partnerTypesId, partnerType) => {
  try {
    const response = await axios.put(
      `${BASE_REST_API_URL}/${partnerTypesId}`,
      partnerType
    );
    return response.data;
  } catch (error) {
    console.error("Error updating partner type:", error);
    throw error;
  }
};

export const deletePartnerType = async (partnerTypesId) => {
  try {
    const response = await axios.delete(
      `${BASE_REST_API_URL}/${partnerTypesId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting partner type:", error);
    throw error;
  }
};

export const getPartnerTypeById = async (partnerTypesId) => {
  try {
    const response = await axios.get(`${BASE_REST_API_URL}/${partnerTypesId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching partner type by ID:", error);
    throw error;
  }
};
