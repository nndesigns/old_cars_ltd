// const GoogleAPIKey = process.env.REACT_APP_GOOGLE_CLOUD_API; // Replace with your actual API key

// GEONAMES (getLocationFromBrowser(); locationSlice.js)

const fetchLocObjFromCoords = async (lat, lng) => {
  const USER_NAME = "matrix90";
  // const response = await fetch(
  //   `http://api.geonames.org/findNearbyPostalCodesJSON?lat=${lat}&lng=${lng}&username=${USER_NAME}`
  // );
  const response = await fetch(
    `https://secure.geonames.org/findNearbyPostalCodesJSON?lat=${lat}&lng=${lng}&username=${USER_NAME}`
  );

  const data = await response.json();

  console.log("response data json", data);

  if (!data.postalCodes || data.postalCodes.length === 0) {
    throw new Error("No postal code found for these coordinates");
  }

  // Extract the first postal code result
  const result = data.postalCodes[0];

  // Return object in your custom format
  return {
    zip: result.postalCode,
    city: result.placeName, // County / locality
    state: result.adminCode1, // State abbreviation
    latitude: result.lat,
    longitude: result.lng,
  };
};

export { fetchLocObjFromCoords };
