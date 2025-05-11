import React, { useState } from "react";
import { loginCallAPI, saveLoggedInUser } from "@/api/authService";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SuccessPopup from "@/components/Dashboard/SuccessPopup";
import ErrorPopup from "@/components/Dashboard/ErrorPopUp";
const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleLoginForm(e) {
    e.preventDefault();

    try {
      const response = await loginCallAPI(username, password);
      saveLoggedInUser(username);
      localStorage.setItem("token", response.data.token);
      setShowSuccess(true);
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data,
        error.response?.status
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại."
      );
      setShowError(true);
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/dashboard");
    window.location.reload(false);
  };

  const handleErrorClose = () => {
    setShowError(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Đăng nhập
        </h2>
        <form onSubmit={handleLoginForm}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <SuccessPopup
            onClose={handleSuccessClose}
            successMessage="Đăng nhập thành công! Chào mừng bạn quay trở lại."
          />
        )}
        {showError && (
          <ErrorPopup onClose={handleErrorClose} errorMessage={errorMessage} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginComponent;
