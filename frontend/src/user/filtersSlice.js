import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appliedFilters: {}, // holds the current filter state
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    saveFilter(state, action) {
      state.appliedFilters = action.payload; // overwrite with new filterState
    },
  },
});

export const { saveFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
