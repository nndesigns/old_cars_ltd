// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   appliedFilters: {}, // holds the current filter state
// };

// const filtersSlice = createSlice({
//   name: "filters",
//   initialState,
//   reducers: {
//     saveFilter(state, action) {
//       state.appliedFilters = action.payload; // overwrite with new filterState
//     },
//   },
// });

// export const { saveFilter } = filtersSlice.actions;
// export default filtersSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const defaultFilterState = {
  sort: "Best match",
  dist_radius: null, //DISTANCE FILTER (number or null)
  veh_locations: [],
  minPrice: null,
  maxPrice: null,
  makes: [],
  models: {},
  styles: [],
  yearFrom: null,
  yearTo: null,
  mileage: null,
  fuelType: null,
  features: null,
  carSize: null,
  doors: null,
  exteriorColor: null,
  interiorColor: null,
  drivetrain: null,
  transmission: null,
  cylinders: null,
  MPGHwy: null,
  vin: null,
};

const initialState = {
  appliedFilters: { ...defaultFilterState }, // { makes: [], models: {}, minPrice: 10000, ... }
  orderedFilters: [], // ["dist_radius", "makes", "models", ...]
};

const getDefaultValue = (key) => defaultFilterState[key];

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // 🔹 Set or update a filter value
    /*   updateFilter(state, action) {
      const { key, value } = action.payload;
      if (value === undefined) return;

      state.appliedFilters[key] = value;

      if (!state.orderedFilters.includes(key) && key !== "sort") {
        state.orderedFilters.push(key);
      }
    }, */

    // UPDATE FILTER
    updateFilter(state, action) {
      const { key, value } = action.payload;
      if (value === undefined) return;

      //is the rec'd key in DFS an array or object value
      //if so, is the rec'd value for it an array or object
      //if not

      state.appliedFilters[key] = value;

      const isEmpty =
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0);

      if (key === "sort") return;

      if (isEmpty) {
        // remove from orderedFilters
        state.orderedFilters = state.orderedFilters.filter((f) => f !== key);
      } else if (!state.orderedFilters.includes(key)) {
        // add if missing
        state.orderedFilters.push(key);
      }
    },
    /// ARRAY - REDUCER
    addFilterValue(state, action) {
      const { key, value } = action.payload;

      const current = state.appliedFilters[key];

      if (!Array.isArray(current)) {
        state.appliedFilters[key] = [value];
      } else if (!current.includes(value)) {
        current.push(value);
      }

      if (!state.orderedFilters.includes(key)) {
        state.orderedFilters.push(key);
      }
    },

    // 🔹 Remove ONE value from an array-based filter
    removeFilterValue(state, action) {
      const { key, value } = action.payload;
      const current = state.appliedFilters[key];

      if (!Array.isArray(current)) return;

      // if filter is array, filter out rec'd value
      const updated = current.filter((v) => v !== value);
      state.appliedFilters[key] = updated;

      if (updated.length === 0) {
        state.appliedFilters[key] = getDefaultValue(key);
        state.orderedFilters = state.orderedFilters.filter((k) => k !== key);
      }
    },

    //  remove all models for a given make
    removeModelsByMake(state, action) {
      const make = action.payload;
      const models = state.appliedFilters.models;
      //if no filter-for models for that make existed, return
      if (!models?.[make]) return;
      //if 'make' entry did exist in AF.models, remove it
      delete models[make];

      //if no more AF.models entries at all..
      if (Object.keys(models).length === 0) {
        state.appliedFilters.models = {};
        // take 'models' out of OF
        state.orderedFilters = state.orderedFilters.filter(
          (k) => k !== "models"
        );
      }
    },

    // 🔹 Remove a single model under a make
    removeModelFilter(state, action) {
      const { make, model } = action.payload;
      const models = state.appliedFilters.models;

      if (!models?.[make]) return;

      const updatedModels = models[make].filter((m) => m !== model);

      if (updatedModels.length > 0) {
        models[make] = updatedModels;
      } else {
        delete models[make];
      }

      if (Object.keys(models).length === 0) {
        state.appliedFilters.models = {};
        state.orderedFilters = state.orderedFilters.filter(
          (k) => k !== "models"
        );
      }
    },

    // 🔹 Clear a scalar filter (price, year, mileage, etc)
    clearSingleFilter(state, action) {
      const key = action.payload;

      state.appliedFilters[key] = getDefaultValue(key);
      state.orderedFilters = state.orderedFilters.filter((k) => k !== key);
    },

    // 🔹 Reset everything
    clearFilters(state) {
      console.log("🔥 clearFilters reducer ran");
      state.appliedFilters = { ...defaultFilterState };
      state.orderedFilters = [];
    },
  },
});

export const {
  updateFilter,
  addFilterValue,
  removeFilterValue,
  removeModelsByMake,
  removeModelFilter,
  clearSingleFilter,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
