import { createSlice } from "@reduxjs/toolkit";

// ---------- Helpers ----------

const loadFromLocalStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

// ---------- USER SLICE ----------

const userInitialState = {
  user: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

// ----------   LOC OBJS SLICE ----------
const locObjsInitialState = {
  locObjs: null,
};

const locObjsSlice = createSlice({
  name: "localObjects",
  initialState: locObjsInitialState,
  reducers: {
    setLocObjs(state, action) {
      state.locObjs = action.payload;
    },

    clearLocObjs(state) {
      state.locObjs = null;
    },
  },
});

// ---------- LOC OBJS SELECTOR ----------
export const selectLocObjs = (state) => state.localObjects.locObjs;

// ---------- COMPARE SLICE ----------

export const selectCompareCars = (state) => state.compare.compareCars;
export const selectChosenCars = (state) => state.compare.chosenCars;

const compareInitialState = {
  compareCars: loadFromLocalStorage("compareCars", []),
  chosenCars: loadFromLocalStorage("chosenCars", []),
};

const compareSlice = createSlice({
  name: "compare",
  initialState: compareInitialState,
  reducers: {
    // --- COMPARE CARS ---
    addToCompare(state, action) {
      state.compareCars.push(action.payload);
      // localStorage.setItem("compareCars", JSON.stringify(state.compareCars));
    },
    removeFromCompare(state, action) {
      state.compareCars = state.compareCars.filter(
        (car) => car.id !== action.payload
      );
      // localStorage.setItem("compareCars", JSON.stringify(state.compareCars));
    },
    clearCompare(state) {
      state.compareCars = [];
      // localStorage.setItem("compareCars", "[]");
    },

    // --- CHOSEN CARS ---
    addChosenCar(state, action) {
      state.chosenCars.push(action.payload);
      // localStorage.setItem("chosenCars", JSON.stringify(state.chosenCars));
    },

    setChosenCars(state, action) {
      state.chosenCars = action.payload;
    },

    removeChosenCar(state, action) {
      state.chosenCars = state.chosenCars.filter(
        (car) => car.id !== action.payload
      );
      // localStorage.setItem("chosenCars", JSON.stringify(state.chosenCars));
    },
    clearChosenCars(state) {
      state.chosenCars = [];
      // localStorage.setItem("chosenCars", "[]");
    },
  },
});

// ---------- LOC OBJS EXPORTS ----------
export const { setLocObjs, clearLocObjs } = locObjsSlice.actions;

// ---------- ACTION EXPORTS ----------

export const { setUser, logout } = userSlice.actions;

export const {
  addToCompare,
  removeFromCompare,
  clearCompare,
  addChosenCar,
  setChosenCars,
  removeChosenCar,
  clearChosenCars,
} = compareSlice.actions;

// ---------- REDUCER EXPORTS ----------

export const userReducer = userSlice.reducer;
export const compareReducer = compareSlice.reducer;
export const locObjsReducer = locObjsSlice.reducer;
