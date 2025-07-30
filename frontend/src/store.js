import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import favoritesReducer from "./user/favoritesSlice";
import locationReducer from "./user/locationSlice";
import filtersReducer from "./user/filtersSlice";

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

const store = configureStore({
  reducer: {
    user: userReducer,
    favorites: persistedFavoritesReducer,
    location: persistedLocationReducer, // ✅ now persisted
    filters: persistedFiltersReducer,
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
