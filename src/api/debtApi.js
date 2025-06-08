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

    const partnerDebts = partners.map((partner) => {
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
    const partnersWithDebt = partnerDebts.filter((partner) => partner.debt > 0);
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
      labels: [],
      totalDebt,
      totalInvoicePaid,
      partners: partnersWithDebt,
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
        return date.getFullYear() === year;
      })
      .map((invoice) => ({
        ...invoice,
        partnerId: orderMap[invoice.orderId]?.partnerId,
      }))
      .filter((invoice) => invoice.partnerId);

    const partnerDebts = partners.map((partner) => {
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

    const partnersWithDebt = partnerDebts.filter((partner) => partner.debt > 0);

    const totalDebt = partnerDebts.reduce(
      (sum, partner) => sum + partner.debt,
      0
    );

    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );

    return {
      labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
      totalDebt,
      totalInvoicePaid,
      partners: partnersWithDebt,
    };
  } catch (error) {
    console.error("Error fetching yearly debt report:", error);
    throw new Error(error.message || "Không thể lấy báo cáo công nợ theo năm");
  }
};
