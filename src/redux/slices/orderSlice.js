import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrders, getOrderById } from "@/api/orderApi";
import { getAllOrderTypes } from "@/api/orderTypeApi";
import { getAllOrderStatus } from "@/api/orderStatusApi";

export const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {
  const res = await getAllOrders(0, 100, "id", "asc");
  return res.content || [];
});

export const fetchOrderTypes = createAsyncThunk(
  "order/fetchOrderTypes",
  async () => {
    const res = await getAllOrderTypes(0, 100, "id", "asc");
    return res.data.content || [];
  }
);

export const fetchOrderStatus = createAsyncThunk(
  "order/fetchOrderStatus",
  async () => {
    const res = await getAllOrderStatus(0, 100, "id", "asc");
    return res.data.content || [];
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    orderTypes: [],
    orderStatus: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchOrderTypes.fulfilled, (state, action) => {
        state.orderTypes = action.payload;
      })

      .addCase(fetchOrderStatus.fulfilled, (state, action) => {
        state.orderStatus = action.payload;
      });
  },
});

export default orderSlice.reducer;
