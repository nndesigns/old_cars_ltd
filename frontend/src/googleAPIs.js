const GoogleAPIKey = process.env.REACT_APP_GOOGLE_CLOUD_API; // Replace with your actual API key

// GET ZIP
const fetchZipFromCoords = async (lat, lng) => {
  const apiKey = GoogleAPIKey;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("No results found from Google Maps API.");
  }

  const postalComponent = data.results[0].address_components.find((component) =>
    component.types.includes("postal_code")
  );

  return postalComponent ? postalComponent.long_name : null;
};

// GET CITY & STATE
const fetchCityStateFromZip = async (zipCode) => {
  const apiKey = GoogleAPIKey;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`
  );
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("No results found from Google Maps API.");
  }

  const components = data.results[0].address_components;

  const city = components.find((c) => c.types.includes("locality"))?.long_name;

  const state = components.find((c) =>
    c.types.includes("administrative_area_level_1")
  )?.short_name;

  return { city, state };
};

export { fetchZipFromCoords, fetchCityStateFromZip };
