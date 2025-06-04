import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllInvoicesWithPartnerName,
  getInvoiceDetail,
} from "@/api/invoiceApi";

export const fetchInvoices = createAsyncThunk("invoices/fetchAll", async () => {
  const res = await getAllInvoicesWithPartnerName(0, 100, "id", "asc");
  return res.content || [];
});

export const fetchInvoiceDetail = createAsyncThunk(
  "invoices/fetchDetail",
  async (id) => {
    const res = await getInvoiceDetail(id);
    return res || [];
  }
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    list: [],
    detail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInvoiceDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
      });
  },
});

export default invoiceSlice.reducer;
