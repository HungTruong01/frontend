import axios from "axios";
import { getOrderById } from "./orderApi";
import { partnerApi } from "./partnerApi";
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
    console.log("Fetched invoices:", response.data.content?.length || 0);
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

export const getInvoiceWithDetails = async (invoiceId) => {
  try {
    const invoice = await getInvoiceById(invoiceId);

    if (invoice.orderId) {
      const order = await getOrderById(invoice.orderId);
      if (order && order.partnerId) {
        const partner = await partnerApi.getPartnerById(order.partnerId);

        const items = await Promise.all(
          order.orderDetails.map(async (detail) => {
            try {
              const product = await getProductById(detail.productId);
              return {
                productId: detail.productId,
                productName: product.name || `Sản phẩm ${detail.productId}`,
                quantity: detail.quantity,
                unitPrice: product.exportPrice || 0,
                total: detail.quantity * (product.exportPrice || 0),
              };
            } catch (err) {
              console.error(`Lỗi lấy sản phẩm ${detail.productId}:`, err);
              return {
                productId: detail.productId,
                productName: `Sản phẩm ${detail.productId}`,
                quantity: detail.quantity,
                unitPrice: 0,
                total: 0,
              };
            }
          })
        );

        return { ...invoice, order: { ...order, items }, partner };
      }

      return { ...invoice, order };
    }

    return invoice;
  } catch (error) {
    console.error("Error fetching invoice with details:", error);
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
    const partner = await partnerApi.getPartnerById(order.partnerId);
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
