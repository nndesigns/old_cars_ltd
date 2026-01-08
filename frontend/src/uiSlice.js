import {
  createSlice,
  //   createAsyncThunk,
  //   createSelector,
} from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    preventScroll: false,
  },
  reducers: {
    lockScroll: (state) => {
      state.preventScroll = true;
    },
    unlockScroll: (state) => {
      state.preventScroll = false;
    },
  },
});

export const { lockScroll, unlockScroll } = uiSlice.actions;
export default uiSlice.reducer;
