// src/store/selectedVehicleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const selectedVehicleSlice = createSlice({
  name: "selectedVehicle",

  // The selected vehicle is either:
  // - null (nothing selected)
  // - a vehicle object
  initialState: {
    vehicle: null,
  },

  reducers: {
    // Save the clicked vehicle object
    selectVehicle(state, action) {
      state.vehicle = action.payload;
    },

    // Clear the selected vehicle (optional)
    clearSelectedVehicle(state) {
      state.vehicle = null;
    },

    // Replace fields inside vehicle without replacing whole object
    updateSelectedVehicle(state, action) {
      if (state.vehicle) {
        Object.assign(state.vehicle, action.payload);
      }
    },
  },
});

export const { selectVehicle, clearSelectedVehicle, updateSelectedVehicle } =
  selectedVehicleSlice.actions;

export default selectedVehicleSlice.reducer;
