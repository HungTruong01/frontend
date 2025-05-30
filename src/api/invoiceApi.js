import axios from "axios";
import { getOrderById } from "./orderApi";
import { getPartnerById } from "./partnerApi";
import { getProductById } from "./productApi";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export const getAllInvoices = async (
  pageNo = 0,
  pageSize = 1000,
  sortBy = "id",
  sortDir = "asc"
) => {
  try {
    const response = await axiosInstance.get(
      `/invoices?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (invoiceId) => {
  try {
    const response = await axiosInstance.get(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    throw error;
  }
};

export const getInvoiceDetail = async (invoiceId) => {
  try {
    const response = await axiosInstance.get(`/invoices/${invoiceId}/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const response = await axiosInstance.post("/invoices", invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    const response = await axiosInstance.put(
      `/invoices/${invoiceId}`,
      invoiceData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await axiosInstance.delete(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

export const getPartnerNameFromOrderId = async (orderId) => {
  try {
    const order = await getOrderById(orderId);
    if (!order || !order.partnerId) {
      throw new Error("Không tìm thấy đơn hàng hoặc thiếu partnerId");
    }
    const partner = await getPartnerById(order.partnerId);
    return partner.name || "N/A";
  } catch (error) {
    console.error("Error fetching partner name from orderId:", error);
    return "N/A";
  }
};

export const getAllInvoicesWithPartnerName = async (
  pageNo,
  pageSize,
  sortBy,
  sortDir
) => {
  try {
    const response = await axiosInstance.get(
      `/invoices?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    const invoices = response.data.content || [];
    const invoicesWithPartnerName = await Promise.all(
      invoices.map(async (invoice) => {
        let partnerName = "N/A";
        const orderId = invoice.orderId;
        if (orderId && !isNaN(orderId)) {
          partnerName = await getPartnerNameFromOrderId(orderId);
        }
        return { ...invoice, partnerName };
      })
    );
    return {
      ...response.data,
      content: invoicesWithPartnerName,
    };
  } catch (error) {
    console.error("Error fetching invoices with partner name:", error);
    throw error;
  }
};
