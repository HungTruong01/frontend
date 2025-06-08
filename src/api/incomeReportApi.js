import { getAllInvoicesWithPartnerName } from "@/api/invoiceApi";
import { getAllInvoiceTypes } from "@/api/invoiceTypeApi";

const determineInvoiceType = async () => {
  try {
    const response = await getAllInvoiceTypes(0, 1000, "id", "asc");
    const types = response.data.content || [];
    const thuType = types.find((type) =>
      type.name.toLowerCase().includes("thu")
    );
    const chiType = types.find((type) =>
      type.name.toLowerCase().includes("chi")
    );
    return {
      thuTypeId: thuType ? thuType.id : null,
      chiTypeId: chiType ? chiType.id : null,
    };
  } catch (error) {
    console.error("Error fetching invoice types:", error);
    throw new Error("Không thể lấy danh sách loại hóa đơn");
  }
};

export const getMonthlyIncomeReport = async (year, month) => {
  try {
    const { thuTypeId, chiTypeId } = await determineInvoiceType();
    if (!thuTypeId || !chiTypeId) {
      throw new Error("Không tìm thấy loại hóa đơn Thu hoặc Chi");
    }

    const response = await getAllInvoicesWithPartnerName(0, 1000, "id", "asc");
    const invoices = response.content || [];

    // Lọc hóa đơn theo tháng và năm
    const filteredInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.createdAt);
      return (
        invoiceDate.getFullYear() === year &&
        invoiceDate.getMonth() + 1 === month
      );
    });

    // Tính toán dữ liệu
    const income = filteredInvoices
      .filter((invoice) => invoice.invoiceTypeId === thuTypeId)
      .reduce((sum, invoice) => sum + (invoice.moneyAmount || 0), 0);

    const expense = filteredInvoices
      .filter((invoice) => invoice.invoiceTypeId === chiTypeId)
      .reduce((sum, invoice) => sum + (invoice.moneyAmount || 0), 0);

    // Tạo labels cho từng ngày trong tháng
    const daysInMonth = new Date(year, month, 0).getDate();
    const labels = Array.from(
      { length: daysInMonth },
      (_, i) => `Ngày ${i + 1}`
    );

    // Tính toán dữ liệu theo ngày
    const dailyIncome = Array(daysInMonth).fill(0);
    const dailyExpense = Array(daysInMonth).fill(0);

    filteredInvoices.forEach((invoice) => {
      const day = new Date(invoice.createdAt).getDate() - 1;
      if (invoice.invoiceTypeId === thuTypeId) {
        dailyIncome[day] += invoice.moneyAmount || 0;
      } else if (invoice.invoiceTypeId === chiTypeId) {
        dailyExpense[day] += invoice.moneyAmount || 0;
      }
    });

    return {
      labels,
      income: dailyIncome,
      expense: dailyExpense,
      totalIncome: income,
      totalExpense: expense,
    };
  } catch (error) {
    console.error("Error fetching monthly income report:", error);
    throw new Error(
      error.message || "Không thể lấy báo cáo thu chi theo tháng"
    );
  }
};

export const getYearlyIncomeReport = async (year) => {
  try {
    const { thuTypeId, chiTypeId } = await determineInvoiceType();
    if (!thuTypeId || !chiTypeId) {
      throw new Error("Không tìm thấy loại hóa đơn Thu hoặc Chi");
    }

    const response = await getAllInvoicesWithPartnerName(0, 1000, "id", "asc");
    const invoices = response.content || [];

    // Lọc hóa đơn theo năm
    const filteredInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.createdAt);
      return invoiceDate.getFullYear() === year;
    });

    // Tính toán dữ liệu
    const income = filteredInvoices
      .filter((invoice) => invoice.invoiceTypeId === thuTypeId)
      .reduce((sum, invoice) => sum + (invoice.moneyAmount || 0), 0);

    const expense = filteredInvoices
      .filter((invoice) => invoice.invoiceTypeId === chiTypeId)
      .reduce((sum, invoice) => sum + (invoice.moneyAmount || 0), 0);

    // Tạo labels cho từng tháng
    const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

    // Tính toán dữ liệu theo tháng
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    filteredInvoices.forEach((invoice) => {
      const month = new Date(invoice.createdAt).getMonth();
      if (invoice.invoiceTypeId === thuTypeId) {
        monthlyIncome[month] += invoice.moneyAmount || 0;
      } else if (invoice.invoiceTypeId === chiTypeId) {
        monthlyExpense[month] += invoice.moneyAmount || 0;
      }
    });

    return {
      labels,
      income: monthlyIncome,
      expense: monthlyExpense,
      totalIncome: income,
      totalExpense: expense,
    };
  } catch (error) {
    console.error("Error fetching yearly income report:", error);
    throw new Error(error.message || "Không thể lấy báo cáo thu chi theo năm");
  }
};
