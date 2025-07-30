//LOCATION SEARCH
export const handleLocationSearch = async (loc) => {
  const isZip = /^\d{5}$/.test(loc.trim());
  const param = isZip ? `zip=${loc}` : `city=${encodeURIComponent(loc)}`;
  //   console.log("isZip", isZip);
  //   console.log("param", param);
  const url = `http://localhost:5001/api/locations/search?${param}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();

    // Expecting an array of { city, state, zip } objects
    const result = data; // limit to 7 closest matches
    //     console.log("Location search results:", result);
    return result;
  } catch (err) {
    console.error("handleLocationSearch error:", err);
    return [];
  }
};

// INV SEARCH
export const handleInvSearch = (inv) => {
  console.log("handleInvSearch, rec'd inventory", inv);
};
