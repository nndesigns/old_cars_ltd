import { configureStore } from "@reduxjs/toolkit";
import { userReducer, compareReducer, locObjsReducer } from "./user/userSlice";
import favoritesReducer from "./user/favoritesSlice";
import locationReducer from "./user/locationSlice";
import filtersReducer from "./user/filtersSlice";
import uniqueLocationsReducer from "./uniqueLocationsSlice";
import inventoryReducer from "./inventorySlice";
import selectedVehicleReducer from "./pages/selectedVehicleSlice";
import uiReducer from "./uiSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

// Persist config for favorites
const favoritesPersistConfig = {
  key: "favorites",
  storage,
};

// ✅ Add persist config for location
const locationPersistConfig = {
  key: "location",
  storage,
};

const filtersPersistConfig = {
  key: "filters",
  storage,
};

const uniqueLocationsConfig = {
  key: "uniqueLocations",
  storage,
};

const comparePersistConfig = {
  key: "compare",
  storage,
  whitelist: ["compareCars", "chosenCars"], // persist ONLY these fields
};

// Wrap reducers that need persistence
const persistedFavoritesReducer = persistReducer(
  favoritesPersistConfig,
  favoritesReducer
);
const persistedLocationReducer = persistReducer(
  locationPersistConfig,
  locationReducer
);
const persistedFiltersReducer = persistReducer(
  filtersPersistConfig,
  filtersReducer
);
const persistedUniqueLocationsReducer = persistReducer(
  uniqueLocationsConfig,
  uniqueLocationsReducer
);
const persistedCompareReducer = persistReducer(
  comparePersistConfig,
  compareReducer
);

const store = configureStore({
  reducer: {
    user: userReducer,
    localObjects: locObjsReducer,
    compare: persistedCompareReducer,
    favorites: persistedFavoritesReducer,
    location: persistedLocationReducer, // ✅ now persisted
    filters: persistedFiltersReducer,
    uniqueLocations: persistedUniqueLocationsReducer,
    inventory: inventoryReducer,
    selectedVehicle: selectedVehicleReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
