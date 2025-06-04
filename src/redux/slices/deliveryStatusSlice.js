import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDeliveryStatus } from "@/api/deliveryStatusApi";

export const fetchDeliveryStatuses = createAsyncThunk(
  "deliveryStatus/fetchDeliveryStatuses",
  async () => {
    const res = await getAllDeliveryStatus(0, 100, "id", "asc");
    return res.data.content || [];
  }
);

const deliveryStatusSlice = createSlice({
  name: "deliveryStatus",
  initialState: { deliveryStatuses: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryStatuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveryStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryStatuses = action.payload;
      })
      .addCase(fetchDeliveryStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default deliveryStatusSlice.reducer;
