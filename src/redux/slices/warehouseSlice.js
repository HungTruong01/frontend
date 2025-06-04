import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllWarehouse } from "@/api/warehouseApi";

export const fetchWarehouses = createAsyncThunk(
  "warehouse/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllWarehouse(0, 100, "id", "asc");
      return res.content || [];
    } catch (err) {
      return rejectWithValue(err.message || "Lỗi khi tải danh sách kho");
    }
  }
);

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default warehouseSlice.reducer;
