// uniqueLocationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUniqueLocations } from "./components/axiosCalls";

export const fetchUniqueLocations = createAsyncThunk(
  "uniqueLocations/fetch",
  async () => {
    return await getUniqueLocations();
  }
);

const uniqueLocationsSlice = createSlice({
  name: "uniqueLocations",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniqueLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUniqueLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUniqueLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectUniqueLocations = (state) => state.uniqueLocations.items;

export const selectUniqueLocationsStatus = (state) =>
  state.uniqueLocations.status;

export default uniqueLocationsSlice.reducer;
