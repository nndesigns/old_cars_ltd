// src/features/favorites/favoritesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  heartedCars: [], // array of full car objects
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleHeart(state, action) {
      const incomingCar = action.payload;
      const carExists = state.heartedCars.some(
        (car) => car.id === incomingCar.id
      );

      if (carExists) {
        state.heartedCars = state.heartedCars.filter(
          (car) => car.id !== incomingCar.id
        );
      } else {
        state.heartedCars.push(incomingCar);
      }
    },
    clearHearts(state) {
      state.heartedCars = [];
    },
  },
});

export const { toggleHeart, clearHearts } = favoritesSlice.actions;
export default favoritesSlice.reducer;
