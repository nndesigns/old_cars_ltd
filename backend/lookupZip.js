async function lookupZip(zip) {
  const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
  if (!response.ok) return null;

  const data = await response.json();
  return {
    latitude: parseFloat(data.places[0].latitude),
    longitude: parseFloat(data.places[0].longitude),
    city: data.places[0]["place name"],
    state: data.places[0]["state abbreviation"],
  };
}

module.exports = lookupZip;
