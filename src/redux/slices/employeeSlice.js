import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllEmployees } from "@/api/employeeApi";

export const fetchEmployees = createAsyncThunk(
  "employee/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllEmployees(0, 100, "id", "asc");
      return res.content || [];
    } catch (err) {
      return rejectWithValue(err.message || "Lỗi khi tải danh sách nhân viên");
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default employeeSlice.reducer;
