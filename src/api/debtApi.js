import { getAllPartners } from "@/api/partnerApi";
import { getAllInvoices } from "@/api/invoiceApi";

export const getMonthlyDebtReport = async (year, month) => {
  try {
    if (!year || !month || month < 1 || month > 12) {
      throw new Error("Năm hoặc tháng không hợp lệ");
    }
    const partnerResponse = await getAllPartners(0, 100, "id", "asc");
    const partners = partnerResponse.data.content;

    // Lấy dữ liệu hóa đơn
    const invoiceResponse = await getAllInvoices(0, 1000, "id", "asc");
    const invoices = invoiceResponse.content;

    const filteredPartners = partners.filter((partner) => {
      const date = new Date(
        partner.lastTransactionDate || partner.createdAt || new Date()
      );
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    const filteredInvoices = invoices.filter((invoice) => {
      if (!invoice.createdAt) return false;
      const date = new Date(invoice.createdAt);
      // Kiểm tra cả thời gian và loại hóa đơn
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
    //console.log("Filtered invoices (Monthly):", filteredInvoices);

    // Tính toán dữ liệu
    const totalDebt = filteredPartners.reduce(
      (sum, partner) => sum + (partner.debt || 0),
      0
    );
    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );
    //console.log("Monthly total invoice paid:", totalInvoicePaid);

    return {
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
    const invoiceResponse = await getAllInvoices(0, 1000, "id", "asc");
    const invoices = invoiceResponse.content;
    // Lọc khách hàng (partnerTypeId === 1) theo năm
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
    //console.log("Filtered invoices (Yearly):", filteredInvoices);

    // Tính toán dữ liệu
    const totalDebt = filteredPartners.reduce(
      (sum, partner) => sum + (partner.debt || 0),
      0
    );
    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );
    //console.log("Yearly total invoice paid:", totalInvoicePaid);

    // Tạo labels cho từng tháng
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
    if (!startDate || !endDate) {
      throw new Error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
    }
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error("Ngày bắt đầu phải trước ngày kết thúc");
    }

    const partnerResponse = await getAllPartners(0, 100, "id", "asc");
    const partners = partnerResponse.data.content;

    // Lấy dữ liệu hóa đơn
    const invoiceResponse = await getAllInvoices(0, 1000, "id", "asc");
    const invoices = invoiceResponse.content;

    // Lọc khách hàng theo khoảng thời gian
    const filteredPartners = partners.filter((partner) => {
      const date = new Date(
        partner.lastTransactionDate || partner.createdAt || new Date()
      );
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    // Lọc hóa đơn thanh toán theo khoảng thời gian
    const filteredInvoices = invoices.filter((invoice) => {
      if (!invoice.createdAt) return false;
      const date = new Date(invoice.createdAt);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
    //console.log("Filtered invoices (Date Range):", filteredInvoices);

    // Tính toán dữ liệu
    const totalDebt = filteredPartners.reduce(
      (sum, partner) => sum + (partner.debt || 0),
      0
    );
    const totalInvoicePaid = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.moneyAmount || 0),
      0
    );
    //console.log("Date range total invoice paid:", totalInvoicePaid);

    // Tạo labels cho từng ngày trong khoảng thời gian
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
    console.error("Error fetching debt report by date range:", error);
    throw new Error(
      error.message || "Không thể lấy báo cáo công nợ theo khoảng thời gian"
    );
  }
};
