import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllInvoiceTypes } from "@/api/invoiceTypeApi";

export const fetchInvoiceTypes = createAsyncThunk(
  "invoiceTypes/fetchAll",
  async () => {
    const res = await getAllInvoiceTypes(0, 100, "id", "asc");
    return res.data.content;
  }
);

const invoiceTypeSlice = createSlice({
  name: "invoiceTypes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoiceTypes.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoiceTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceTypeSlice.reducer;
