import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPartners } from "@/api/partnerApi";

export const fetchPartners = createAsyncThunk(
  "partner/fetchPartners",
  async () => {
    const res = await getAllPartners(0, 100, "id", "asc");
    return res.data.content || [];
  }
);

const partnerSlice = createSlice({
  name: "partner",
  initialState: {
    partners: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default partnerSlice.reducer;
