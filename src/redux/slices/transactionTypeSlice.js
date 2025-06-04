import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllWarehouseTransactionType } from "@/api/warehouseTransactionTypeApi";

export const fetchTransactionTypes = createAsyncThunk(
  "transactionType/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllWarehouseTransactionType(0, 100, "id", "asc");
      return res.data.content || [];
    } catch (err) {
      return rejectWithValue(err.message || "Lỗi khi tải loại giao dịch kho");
    }
  }
);

const transactionTypeSlice = createSlice({
  name: "transactionType",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionTypes.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactionTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default transactionTypeSlice.reducer;
