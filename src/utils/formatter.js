// Định dạng số tiền VNĐ
export const formatCurrency = (amount = 0) => {
  return `${new Intl.NumberFormat("vi-VN").format(amount)} VNĐ`;
};

// Định dạng ngày thành dd/mm/yyyy
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
