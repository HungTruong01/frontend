import axios from "axios";

const AUTH_REST_BASE_API_URL = "http://localhost:3000/api/auth";

// Register API call
export const registerCallAPI = (registerObj) =>
  axios.post(AUTH_REST_BASE_API_URL + "/register", registerObj);

// Login API call
export const loginCallAPI = (username, password) =>
  axios.post(
    AUTH_REST_BASE_API_URL + "/login",
    { username, password },
    { withCredentials: true }
  );

export const logout = () => {
  document.cookie = `authenticatedUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`;
  axios.post(`${AUTH_REST_BASE_API_URL}/logout`);
};

export const saveLoggedInUser = (username) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 7000).toUTCString(); // 1 ngày
  document.cookie = `authenticatedUser=${username}; path=/; expires=${expires}; Secure; SameSite=Strict`;
};

// Check if user is logged in by checking the cookie
export const isUserLoggedIn = () => {
  return getCookie("authenticatedUser") !== null;
};

// Get logged in user from cookies
export const getLoggedInUser = () => {
  return getCookie("authenticatedUser");
};

// Check if the logged in user is an admin by checking the role cookie
export const isAdminUser = () => {
  return getCookie("role") === "ROLE_ADMIN";
};

// Helper function to get a cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};
