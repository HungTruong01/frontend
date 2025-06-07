import { getAllPartners } from "@/api/partnerApi";
import { getAllInvoices } from "@/api/invoiceApi";
import { getAllOrders } from "@/api/orderApi";

export const getMonthlyDebtReport = async (year, month) => {
  try {
    if (!year || !month || month < 1 || month > 12) {
      throw new Error("Năm hoặc tháng không hợp lệ");
    }
    const [partnerResponse, invoiceResponse, orderResponse] = await Promise.all(
      [
        getAllPartners(0, 100, "id", "asc"),
        getAllInvoices(0, 100, "id", "asc"),
        getAllOrders(0, 100, "id", "asc"),
      ]
    );
    const partners = partnerResponse.data.content;
    const invoices = invoiceResponse.content;
    const orders = orderResponse.content;

    const orderMap = orders.reduce((acc, order) => {
      acc[order.id] = order;
      return acc;
    }, {});

    const filteredInvoices = invoices
      .filter((invoice) => {
        if (!invoice.createdAt) return false;
        const date = new Date(invoice.createdAt);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      })
      .map((invoice) => ({
        ...invoice,
        partnerId: orderMap[invoice.orderId]?.partnerId,
      }))
      .filter((invoice) => invoice.partnerId);

    const activePartnerIds = new Set(
      filteredInvoices.map((invoice) => invoice.partnerId)
    );

    const filteredPartners = partners.filter((partner) =>
      activePartnerIds.has(partner.id)
    );

    const partnerDebts = filteredPartners.map((partner) => {
      const partnerInvoices = filteredInvoices.filter(
        (invoice) => invoice.partnerId === partner.id
      );

      const totalPaid = partnerInvoices.reduce(
        (sum, invoice) => sum + (invoice.moneyAmount || 0),
        0
      );

      return {
        name: partner.name,
        debt: partner.debt || 0,
        paid: totalPaid,
        partnerTypeId: partner.partnerTypeId,
        partnerTypeName:
          partner.partnerTypeId === 1
            ? "Khách hàng"
            : partner.partnerTypeId === 2
            ? "Nhà cung cấp"
            : "Không xác định",
      };
    });

    const totalDebt = partnerDebts.reduce(
      (sum, partner) => sum + partner.debt,
      0
    );

    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );

    const daysInMonth = new Date(year, month, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) =>
      new Date(year, month - 1, i + 1).toLocaleDateString("vi-VN")
    );

    return {
      labels,
      totalDebt,
      totalInvoicePaid,
      partners: partnerDebts,
    };
  } catch (error) {
    console.error("Error fetching monthly debt report:", error);
    throw new Error(
      error.message || "Không thể lấy báo cáo công nợ theo tháng"
    );
  }
};

export const getYearlyDebtReport = async (year) => {
  try {
    if (!year) {
      throw new Error("Năm không hợp lệ");
    }
    const partnerResponse = await getAllPartners(0, 100, "id", "asc");
    const partners = partnerResponse.data.content;
    const invoiceResponse = await getAllInvoices(0, 100, "id", "asc");
    const invoices = invoiceResponse.content;
    const filteredPartners = partners.filter((partner) => {
      const date = new Date(
        partner.lastTransactionDate || partner.createdAt || new Date()
      );
      return date.getFullYear() === year;
    });

    const filteredInvoices = invoices.filter((invoice) => {
      if (!invoice.createdAt) return false;
      const date = new Date(invoice.createdAt);
      return date.getFullYear() === year;
    });
    const totalDebt = filteredPartners.reduce(
      (sum, partner) => sum + (partner.debt || 0),
      0
    );
    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );
    const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
    return {
      labels,
      totalDebt,
      totalInvoicePaid,
      partners: filteredPartners.map((partner) => ({
        name: partner.name,
        debt: partner.debt || 0,
        partnerTypeId: partner.partnerTypeId,
        partnerTypeName:
          partner.partnerTypeId === 1
            ? "Khách hàng"
            : partner.partnerTypeId === 2
            ? "Nhà cung cấp"
            : "Không xác định",
      })),
    };
  } catch (error) {
    console.error("Error fetching yearly debt report:", error);
    throw new Error(error.message || "Không thể lấy báo cáo công nợ theo năm");
  }
};

export const getDebtReportByDateRange = async (startDate, endDate) => {
  try {
    const [partnerResponse, invoiceResponse, orderResponse] = await Promise.all(
      [
        getAllPartners(0, 100, "id", "asc"),
        getAllInvoices(0, 100, "id", "asc"),
        getAllOrders(0, 100, "id", "asc"),
      ]
    );
    const partners = partnerResponse.data.content;
    const invoices = invoiceResponse.content;
    const orders = orderResponse.content;

    const orderMap = orders.reduce((acc, order) => {
      acc[order.id] = order;
      return acc;
    }, {});

    const filteredInvoices = invoices
      .filter((invoice) => {
        if (!invoice.createdAt) return false;
        const invoiceDate = new Date(invoice.createdAt);
        return (
          invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate)
        );
      })
      .map((invoice) => ({
        ...invoice,
        partnerId: orderMap[invoice.orderId]?.partnerId,
      }))
      .filter((invoice) => invoice.partnerId);

    const activePartnerIds = new Set(
      filteredInvoices.map((invoice) => invoice.partnerId)
    );

    const filteredPartners = partners.filter((partner) =>
      activePartnerIds.has(partner.id)
    );

    const partnerDebts = filteredPartners.map((partner) => {
      const partnerInvoices = filteredInvoices.filter(
        (invoice) => invoice.partnerId === partner.id
      );

      const totalPaid = partnerInvoices.reduce(
        (sum, invoice) => sum + (invoice.moneyAmount || 0),
        0
      );

      return {
        name: partner.name,
        debt: partner.debt || 0,
        paid: totalPaid,
        partnerTypeId: partner.partnerTypeId,
        partnerTypeName:
          partner.partnerTypeId === 1
            ? "Khách hàng"
            : partner.partnerTypeId === 2
            ? "Nhà cung cấp"
            : "Không xác định",
      };
    });

    const totalDebt = partnerDebts.reduce(
      (sum, partner) => sum + partner.debt,
      0
    );

    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );
    const days =
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      ) + 1;

    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date.toLocaleDateString("vi-VN");
    });

    return {
      labels,
      totalDebt,
      totalInvoicePaid,
      partners: partnerDebts,
    };
  } catch (error) {
    console.error("Error fetching debt report by date range:", error);
    throw new Error(
      error.message || "Không thể lấy báo cáo công nợ theo khoảng thời gian"
    );
  }
};
