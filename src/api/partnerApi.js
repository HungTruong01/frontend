import axios from "axios";

const API_URL = "http://localhost:8080/api";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout sau 10 giây
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Cho phép gửi cookies nếu cần
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 403) {
      console.error(
        "Lỗi 403: Không có quyền truy cập. Vui lòng kiểm tra quyền của bạn."
      );
    }
    if (error.response?.status === 415) {
      console.error(
        "Lỗi 415: Định dạng dữ liệu không được hỗ trợ. Vui lòng kiểm tra Content-Type và định dạng dữ liệu."
      );
    }
    if (error.response?.status === 500) {
      console.error("Lỗi 500: Lỗi server. Chi tiết:", error.response?.data);
    }
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const partnerApi = {
  getAllPartners: async () => {
    try {
      const response = await axiosInstance.get("/partners");
      return response.data;
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  },

  addPartner: async (partnerData) => {
    try {
      let partnerTypeId;
      switch (partnerData.type) {
        case "Khách hàng":
          partnerTypeId = 1;
          break;
        case "Nhà cung cấp":
          partnerTypeId = 2;
          break;
        default:
          throw new Error("Loại đối tác không hợp lệ");
      }

      const formattedData = {
        name: partnerData.name,
        phone: partnerData.phone,
        email: partnerData.email,
        address: partnerData.address,
        partnerTypeId: partnerTypeId,
        debt: parseFloat(partnerData.debt) || 0,
      };

      const response = await axiosInstance.post("/partners", formattedData);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding partner:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật đối tác
  updatePartner: async (id, partnerData) => {
    try {
      const formattedData = {
        name: partnerData.name,
        phone: partnerData.phone,
        email: partnerData.email,
        address: partnerData.address,
        partnerTypeId: parseInt(partnerData.type),
        debt: parseFloat(partnerData.debt) || 0,
      };
      const response = await axiosInstance.put(
        `/partners/${id}`,
        formattedData
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating partner:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Xóa đối tác
  deletePartner: async (id) => {
    try {
      const response = await axiosInstance.delete(`/partners/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting partner:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy chi tiết đối tác
  getPartnerById: async (id) => {
    try {
      const response = await axiosInstance.get(`/partners/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching partner details:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
