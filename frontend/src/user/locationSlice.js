import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchZipFromCoords, fetchCityStateFromZip } from "../googleAPIs"; // adjust as needed

const initialState = {
  zip: null,
  city: null,
  state: null,
  latitude: null,
  longitude: null,
  localInv: [],
};
//create object {city, state, zip} of user w/ Google API's
//for initial location state set
export const getLocationFromBrowser = createAsyncThunk(
  "location/getLocationFromBrowser",
  async (_, thunkAPI) => {
    return new Promise((resolve, reject) => {
      //get longitude, latitude from free browser API
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            //get zip from browser using 1st free Google API call
            const zip = await fetchZipFromCoords(latitude, longitude);
            if (zip) {
              //Use response to get City & State from 2nd free Google API call
              const { city, state } = await fetchCityStateFromZip(zip);
              resolve({ zip, city, state, latitude, longitude }); //GLFB return obj
            } else {
              reject("Unable to resolve ZIP");
            }
          } catch (err) {
            reject(err);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
);

//create 'Location' Redux object
const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearLocation: (state) => {
      state.zip = null;
      state.city = null;
      state.state = null;
      state.localInv = []; // ✅ optionally clear it as well
      state.latitude = null;
      state.longitude = null;
    },
    setLocalInv: (state, action) => {
      state.localInv = action.payload; // ✅ store the array
    },
    setManualLocation: (state, action) => {
      const { city, state: st, zip, latitude, longitude } = action.payload;
      state.city = city;
      state.state = st;
      state.zip = zip;
      state.latitude = latitude;
      state.longitude = longitude;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLocationFromBrowser.fulfilled, (state, action) => {
      state.zip = action.payload.zip;
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    });
  },
});

export const { clearLocation, setLocalInv, setManualLocation } =
  locationSlice.actions;
export default locationSlice.reducer;
