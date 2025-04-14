import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8080/api/warehouse-products";

axios.defaults.withCredentials = true;

export const getAllInventoryWarehouse = async (
  pageNo,
  pageSize,
  sortBy,
  sortDir
) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory warehouse:", error);
    throw error;
  }
};

export const getInventoryWarehouseById = async (inventoryWarehouseId) => {
  try {
    const response = await axios.get(
      `${BASE_REST_API_URL}/${inventoryWarehouseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory warehouse by id:", error);
    throw error;
  }
};
