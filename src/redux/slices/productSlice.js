import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts } from "@/api/productApi";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const res = await getAllProducts(0, 100, "id", "asc");
    return res.data.content || [];
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
