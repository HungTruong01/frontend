import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

axios.defaults.withCredentials = true;

export const getAllProducts = async (pageNo, pageSize, sortBy, sortDir) => {
  const url = `${API_URL}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
  return axios.get(url);
};
