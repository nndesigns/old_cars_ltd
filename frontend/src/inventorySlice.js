// inventorySlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
// import { getInventory } from "../api";
import { getInventory } from "./components/axiosCalls";

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async () => {
    const data = await getInventory();
    return data;
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
/* =======================
   SELECTORS
   ======================= */
export const selectInventoryItems = (state) => state.inventory.items;
export const selectInventoryStatus = (state) => state.inventory.status;

export const selectActiveInventory = createSelector(
  selectInventoryItems,
  (items) => items.filter((car) => car.status)
);

// ACTIVE MAKE COUNTS (CAROUSELS [MAKE DATA] - HOME)
export const selectActiveMakeCounts = createSelector(
  selectActiveInventory,
  (activeInv) => {
    const counts = {};
    activeInv.forEach((car) => {
      counts[car.make] = (counts[car.make] || 0) + 1;
    });
    return Object.entries(counts).map(([make, count]) => ({
      make,
      count,
    }));
  }
);

/// MAKES (MAKES SELECT - HOME)
export const selectUniqueMakes = createSelector(
  selectActiveInventory,
  (activeInv) => [...new Set(activeInv.map((car) => car.make))]
);

/// MAKES MODELS STYLES (HOME)
export const selectMakesModelsStyles = createSelector(
  selectActiveInventory,
  (activeInv) => {
    const comboMap = new Map();

    activeInv.forEach((car) => {
      const key = `${car.make}-${car.model}`;
      if (!comboMap.has(key)) {
        comboMap.set(key, {
          year: car.year,
          make: car.make,
          model: car.model,
          color: car.color,
          style: car.style,
          images: car.images ?? "undefined",
        });
      }
    });

    const uniqueCombos = Array.from(comboMap.values());

    const stylesToMatch = [
      "SUV / 4x4",
      "pickup",
      "hatchback",
      "station wagon",
      "sedan",
      "van",
    ];

    const filtered = uniqueCombos.filter((model) =>
      stylesToMatch.some((style) =>
        model.style.toLowerCase().includes(style.toLowerCase())
      )
    );

    return {
      SUVS: filtered.filter((m) => m.style.includes("SUV / 4x4")),
      TRUCKS: filtered.filter((m) => m.style.includes("pickup")),
      CROSSOVERS: filtered.filter(
        (m) =>
          m.style.includes("hatchback") ||
          m.style.includes("station wagon") ||
          m.style.includes("van") ||
          (m.style.includes("pickup") && m.style.includes("coupe"))
      ),
      SEDANS: filtered.filter((m) => m.style.includes("sedan")),
    };
  }
);

export default inventorySlice.reducer;
