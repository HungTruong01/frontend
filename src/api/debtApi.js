import { partnerApi } from "@/api/partnerApi";
import { getAllInvoices } from "@/api/invoiceApi";

export const getMonthlyDebtReport = async (year, month) => {
  try {
    if (!year || !month || month < 1 || month > 12) {
      throw new Error("Năm hoặc tháng không hợp lệ");
    }

    // Lấy dữ liệu đối tác
    const partnerResponse = await partnerApi.getAllPartners(
      0,
      100,
      "id",
      "asc"
    );
    const partners = partnerResponse.content || [];
    console.log("Partners:", partners.length);

    // Lấy dữ liệu hóa đơn
    const invoiceResponse = await getAllInvoices(0, 1000, "id", "asc");
    const invoices = invoiceResponse.content || [];
    console.log("Total invoices:", invoices.length);

    // Lọc khách hàng (partnerTypeId === 1) theo tháng và năm
    const filteredPartners = partners.filter((partner) => {
      if (partner.partnerTypeId !== 1) return false;
      const date = new Date(
        partner.lastTransactionDate || partner.createdAt || new Date()
      );
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    // Lọc hóa đơn thanh toán (invoiceTypeId === 2) theo tháng và năm
    const filteredInvoices = invoices.filter((invoice) => {
      if (!invoice.createdAt) return false;
      const date = new Date(invoice.createdAt);
      return (
        invoice.invoiceTypeId === 2 &&
        date.getFullYear() === year &&
        date.getMonth() + 1 === month
      );
    });
    console.log("Filtered invoices (Thanh toán):", filteredInvoices);

    // Tính toán dữ liệu
    const totalDebt = filteredPartners.reduce(
      (sum, partner) => sum + (partner.debt || 0),
      0
    );
    const totalPaid = filteredPartners.reduce(
      (sum, partner) => sum + (partner.paid || 0),
      0
    );
    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );
    console.log("Total invoice paid:", totalInvoicePaid);

    // Tạo labels cho từng ngày trong tháng (giữ lại nhưng không sử dụng)
    const daysInMonth = new Date(year, month, 0).getDate();
    const labels = Array.from(
      { length: daysInMonth },
      (_, i) => `Ngày ${i + 1}`
    );

    return {
      labels,
      totalDebt,
      totalPaid,
      totalInvoicePaid,
      partners: filteredPartners.map((partner) => ({
        name: partner.name,
        debt: partner.debt || 0,
        paid: partner.paid || 0,
      })),
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

    // Lấy dữ liệu đối tác
    const partnerResponse = await partnerApi.getAllPartners(
      0,
      100,
      "id",
      "asc"
    );
    const partners = partnerResponse.content || [];
    console.log("Partners:", partners.length);

    // Lấy dữ liệu hóa đơn
    const invoiceResponse = await getAllInvoices(0, 1000, "id", "asc");
    const invoices = invoiceResponse.content || [];
    console.log("Total invoices:", invoices.length);

    // Lọc khách hàng (partnerTypeId === 1) theo năm
    const filteredPartners = partners.filter((partner) => {
      if (partner.partnerTypeId !== 1) return false;
      const date = new Date(
        partner.lastTransactionDate || partner.createdAt || new Date()
      );
      return date.getFullYear() === year;
    });

    // Lọc hóa đơn thanh toán (invoiceTypeId === 2) theo năm
    const filteredInvoices = invoices.filter((invoice) => {
      if (!invoice.createdAt) return false;
      const date = new Date(invoice.createdAt);
      return invoice.invoiceTypeId === 2 && date.getFullYear() === year;
    });
    console.log("Filtered invoices (Thanh toán):", filteredInvoices);

    // Tính toán dữ liệu
    const totalDebt = filteredPartners.reduce(
      (sum, partner) => sum + (partner.debt || 0),
      0
    );
    const totalPaid = filteredPartners.reduce(
      (sum, partner) => sum + (partner.paid || 0),
      0
    );
    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );
    console.log("Total invoice paid:", totalInvoicePaid);

    // Tạo labels cho từng tháng (giữ lại nhưng không sử dụng)
    const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

    return {
      labels,
      totalDebt,
      totalPaid,
      totalInvoicePaid,
      partners: filteredPartners.map((partner) => ({
        name: partner.name,
        debt: partner.debt || 0,
        paid: partner.paid || 0,
      })),
    };
  } catch (error) {
    console.error("Error fetching yearly debt report:", error);
    throw new Error(error.message || "Không thể lấy báo cáo công nợ theo năm");
  }
};

export const getDebtReportByDateRange = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      throw new Error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
    }
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error("Ngày bắt đầu phải trước ngày kết thúc");
    }

    // Lấy dữ liệu đối tác
    const partnerResponse = await partnerApi.getAllPartners(
      0,
      100,
      "id",
      "asc"
    );
    const partners = partnerResponse.content || [];
    console.log("Partners:", partners.length);

    // Lấy dữ liệu hóa đơn
    const invoiceResponse = await getAllInvoices(0, 1000, "id", "asc");
    const invoices = invoiceResponse.content || [];
    console.log("Total invoices:", invoices.length);

    // Lọc khách hàng (partnerTypeId === 1) theo khoảng thời gian
    const filteredPartners = partners.filter((partner) => {
      if (partner.partnerTypeId !== 1) return false;
      const date = new Date(
        partner.lastTransactionDate || partner.createdAt || new Date()
      );
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    // Lọc hóa đơn thanh toán (invoiceTypeId === 2) theo khoảng thời gian
    const filteredInvoices = invoices.filter((invoice) => {
      if (!invoice.createdAt) return false;
      const date = new Date(invoice.createdAt);
      return (
        invoice.invoiceTypeId === 2 &&
        date >= new Date(startDate) &&
        date <= new Date(endDate)
      );
    });
    console.log("Filtered invoices (Thanh toán):", filteredInvoices);

    // Tính toán dữ liệu
    const totalDebt = filteredPartners.reduce(
      (sum, partner) => sum + (partner.debt || 0),
      0
    );
    const totalPaid = filteredPartners.reduce(
      (sum, partner) => sum + (partner.paid || 0),
      0
    );
    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );
    console.log("Total invoice paid:", totalInvoicePaid);

    // Tạo labels cho từng ngày trong khoảng thời gian (giữ lại nhưng không sử dụng)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date.toLocaleDateString("vi-VN");
    });

    return {
      labels,
      totalDebt,
      totalPaid,
      totalInvoicePaid,
      partners: filteredPartners.map((partner) => ({
        name: partner.name,
        debt: partner.debt || 0,
        paid: partner.paid || 0,
      })),
    };
  } catch (error) {
    console.error("Error fetching debt report by date range:", error);
    throw new Error(
      error.message || "Không thể lấy báo cáo công nợ theo khoảng thời gian"
    );
  }
};
