import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllWarehouseTransaction } from "@/api/warehouseTransactionApi";

export const fetchWarehouseTransactions = createAsyncThunk(
  "warehouseTransaction/fetchWarehouseTransactions",
  async () => {
    const res = await getAllWarehouseTransaction(0, 100, "id", "asc");
    return res.content || [];
  }
);

const warehouseTransactionSlice = createSlice({
  name: "warehouseTransaction",
  initialState: { warehouseTransactions: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouseTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWarehouseTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouseTransactions = action.payload;
      })
      .addCase(fetchWarehouseTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default warehouseTransactionSlice.reducer;
