// import zipcodes from "zipcodes";
import { getDistance } from "geolib";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FullPageLoader from "../pages/fullpageLoader";

export function handleScroll(scrollContainerRef, direction, mobileRow) {
  const scrollContainer = scrollContainerRef.current;
  if (scrollContainer) {
    const scrollAmount = mobileRow
      ? window.innerWidth * 0.15
      : window.innerWidth * 0.75;
    const duration = 1200; // Longer duration for smooth, gradual taper-off
    const startTime = performance.now();
    const startScrollLeft = scrollContainer.scrollLeft;
    const endScrollLeft = startScrollLeft + direction * scrollAmount;
    const distance = endScrollLeft - startScrollLeft;

    // Stronger ease-out for a more gradual stop
    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4); // Quartic ease-out (smoother than cubic)
    }

    function animateScroll(time) {
      const timeElapsed = time - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Clamp progress between 0 and 1
      const easedProgress = easeOutQuart(progress);

      scrollContainer.scrollLeft = startScrollLeft + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }
}

// stateToStateMap.js
export const stateToStateMap = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

export const cityToZipMap = {
  "New Orleans, LA": "70124",
  "Los Angeles, CA": "90001",
  "Miami, FL": "33101",
  "Phoenix, AZ": "85003",
  "Charlotte, NC": "28202",
  "Seattle, WA": "98101",
  "Chicago, IL": "60601",
  "Tampa, FL": "33602",
  "Denver, CO": "80202",
  "Austin, TX": "78701",
  "Atlanta, GA": "30303",
  "Houston, TX": "77002",
  "Louisville, KY": "40202",
  "Portland, OR": "97201",
  "Richmond, VA": "23219",
  "San Diego, CA": "92101",
  "Savannah, GA": "31401",
  "Dallas, TX": "75201",
  "Nashville, TN": "37201",
  "Indianapolis, IN": "46204",
  "New York, NY": "10001",
  "Birmingham, AL": "35203",
  "Bozeman, MT": "59715",
  "Boston, MA": "02108",
  "San Francisco, CA": "94102",
  "Huntsville, AL": "35801",
  "Lexington, KY": "40502",
  "Haines City, FL": "33844",
  "Smyrna, TN": "37167",
  "Greenville, SC": "29601",
  "New Bern, NC": "28560",
  "Memphis, TN": "38103",
  "Goldsboro, NC": "27530",
  "Dothan, AL": "36301",
  "Knoxville, TN": "37902",
  "Marietta, GA": "30060",
  "Greensboro, NC": "27401",
  "Clayton, NC": "27520",
  "Norfolk, VA": "23510",
  "Wilmington, NC": "28401",
  "Jackson, MS": "39201",
  "Chattanooga, TN": "37402",
  "Bessemer, AL": "35020",
  "Durham, NC": "27701",
  "Pensacola, FL": "32501",
  "Southaven, MS": "38671",
  "Mechanicsburg, PA": "17055",
  "Augusta, GA": "30901",
  "Gastonia, NC": "28052",
  "Germantown, TN": "38138",
  "Charleston, SC": "29401",
  "Hoover, AL": "35226",
  "Florence, AL": "35630",
  "Summerville, SC": "29483",
  "Philadelphia, PA": "19103",
  "Macon, GA": "31201",
  "Franklin, TN": "37064",
  "Fayetteville, NC": "28301",
  "Martinsburg, WV": "25401",
  "Roswell, GA": "30075",
  "Statesboro, GA": "30458",
  "Syracuse, NY": "13202",
  "Alpharetta, GA": "30009",
  "Brentwood, TN": "37027",
  "Decatur, GA": "30030",
  "Hanover, PA": "17331",
  "Mobile, AL": "36602",
  "Asheville, NC": "28801",
  "Goose Creek, SC": "29445",
  "Kenner, LA": "70062",
  "Ocoee, FL": "34761",
  "Montgomery, AL": "36104",
  "Burlington, NC": "27215",
  "Tallahassee, FL": "32301",
  "Opelika, AL": "36801",
  "Roanoke, VA": "24011",
  "Raleigh, NC": "27601",
  "Pittsburgh, PA": "15222",
  "Cleveland, OH": "44114",
  "Toledo, OH": "43604",
  "Cary, NC": "27511",
  "North Charleston, SC": "29405",
  "Bayonne, NJ": "07002",
  "Florence, SC": "29501",
  "Mount Pleasant, SC": "29464",
  "Columbia, SC": "29201",
  "Peachtree City, GA": "30269",
  "Vestavia Hills, AL": "35216",
  "Watertown, NY": "13601",
  "Columbus, GA": "31901",
  "Little Rock, AR": "72201",
  "Metairie, LA": "70001",
  "Buffalo, NY": "14202",
  "Madison, AL": "35758",
  "Scranton, PA": "18503",
  "Harrisburg, PA": "17101",
  "Concord, NC": "28025",
  "Albany, NY": "12207",
  "Hattiesburg, MS": "39401",
  "Newark, NJ": "07102",
};

// function parseCsv(text) {
//   const lines = text.trim().split("\n");
//   const headers = lines[0].split(",");
//   return lines.slice(1).map((line) => {
//     const cols = line.split(",");
//     return Object.fromEntries(
//       headers.map((h, i) => [h.trim(), cols[i]?.trim()])
//     );
//   });
// }

// // Main function
// export async function processCityToZipMap() {
//   // fetch from frontend/public folder
//   const response = await fetch("/us_zips.csv");
//   const csvText = await response.text();
//   const csvData = parseCsv(csvText);

//   console.log("parsed 'csvData'", csvData);

//   // Build quick lookup structures
//   const zipSet = new Set(csvData.map((row) => row.zip));

//   // Convert city+state combos to their zips for easy lookup
//   const cityStateToZip = {};
//   for (const row of csvData) {
//     const key = `${row.city}, ${row.state_id}`;
//     if (!cityStateToZip[key]) cityStateToZip[key] = [];
//     cityStateToZip[key].push(row.zip);
//   }

//   const updatedMap = {};
//   let replacedCount = 0;

//   // Loop through the cityToZipMap entries
//   for (const [cityState, zip] of Object.entries(cityToZipMap)) {
//     // ✅ Case 1: The ZIP exists in the CSV → keep it
//     if (zipSet.has(zip)) {
//       updatedMap[cityState] = zip;
//       continue;
//     }

//     // ❌ Case 2: ZIP not found → try to find one by city/state
//     const [cityPart, statePart] = cityState.split(",").map((s) => s.trim());

//     // Look for a matching row in the CSV
//     const match = csvData.find(
//       (row) =>
//         row.city.toLowerCase() === cityPart.toLowerCase() &&
//         row.state_id.toLowerCase() === statePart.toLowerCase()
//     );

//     if (match) {
//       updatedMap[cityState] = match.zip;
//       replacedCount++;
//       console.warn(
//         `⚠️ Replaced missing ZIP ${zip} → ${match.zip} for ${cityState}`
//       );
//     } else {
//       updatedMap[cityState] = zip; // keep original
//       console.error(`❌ No ZIP found in CSV for ${cityState}, keeping ${zip}`);
//     }
//   }

//   console.log(`✅ Updated ${replacedCount} ZIPs`);
//   return updatedMap;
// }

// (async () => {
//   const updatedMap = await processCityToZipMap();
//   console.log(updatedMap);
// })();

//uses provided 'radius', location.latitude & .longitude, to
//// OFFER COUNT //
//each 'location' is a matching us_zip.csv obj

// async function lookupZip(zip) {
//   const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
//   if (!response.ok) return null;

//   const data = await response.json();
//   return {
//     latitude: parseFloat(data.places[0].latitude),
//     longitude: parseFloat(data.places[0].longitude),
//     city: data.places[0]["place name"],
//     state: data.places[0]["state abbreviation"],
//   };
// }

//////// GET LOCAL
/* export function getLocalOffers(inventory, location, radiusInMiles, countOnly) {
  console.log("getLocalOffers rec'd location", location);
  console.log("getlocalOffers rec'd inventory", inventory);
  console.log("getlocalOffers rec'd radiusInMiles", radiusInMiles);
  console.log("getlocalOffers rec'd countOnly", countOnly);
  //create array of uniq  city + state strings from inv
  const inv_cities = Array.from(
    new Set(inventory.map((item) => `${item.city}, ${item.state}`))
  );

  //For each unique city  string in from inv_cities, grab its 'zip' value from map, get city obj w/ lat & long (loc)
  const cities = inv_cities
    .filter((inv_cities) => {
      const zip = cityToZipMap[inv_cities]; //get zip for city
      if (!zip) return false;

      // const loc = zipcodes.lookup(zip); //retrieve a full location obj using zip
      const loc = await lookupZip(zip);
      console.log("loc (getLocalOffers", loc);
      if (!loc || !loc.latitude || !loc.longitude) return false;

      if (!location || location.latitude == null || location.longitude == null)
        return false;

      //use rtnd loc obj .lat & .long inside of npm pkg,
      const distInMeters = getDistance(
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        { latitude: loc.latitude, longitude: loc.longitude }
      );

      const distInMiles = distInMeters / 1609.34;
      return distInMiles <= radiusInMiles;
    })
    .map((cityState) => cityState.split(",")[0].trim());

  const finalArray = inventory.filter((veh) => cities.includes(veh.city));

  return countOnly ? finalArray.length : finalArray;
} */

// take zip from location,
//get zips for all 'activeInv' (using 'cityToStateMap')
//get 'lat' & 'lng' for each of the 'activeInv' zips
// put 'activeInv' lat, lng into 'getDistance()' w/ location.lat/lng, to  determine if w/in  'radiusInMiles' (ex; 100)
//if is, push 'activeInv' obj into 'nearbyCities'
export function getLocalOffers(
  inventory,
  uniqueLocs,
  location,
  radiusInMiles,
  countOnly
) {
  // console.log("getlocalOffers rec'd inventory", inventory);
  // console.log("getLocalOffers rec'd location", location);
  // console.log("getlocalOffers rec'd radiusInMiles", radiusInMiles);
  // console.log("getlocalOffers rec'd countOnly", countOnly);

  if (!location || location.latitude == null || location.longitude == null) {
    return countOnly ? 0 : [];
  }

  // Create array of unique city + state strings from inventory
  const nearbyCities = [];

  for (const loc of uniqueLocs) {
    // Calculate distance in miles
    const distInMeters = getDistance(
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: loc.latitude, longitude: loc.longitude }
    );

    const distInMiles = distInMeters / 1609.34;

    if (distInMiles <= radiusInMiles) {
      nearbyCities.push(loc.city);
    }
  }

  // Filter inventory based on nearby cities
  const finalArray = inventory.filter((veh) => nearbyCities.includes(veh.city));

  return countOnly ? finalArray.length : finalArray;
}

/////////////// SORT INV BY DISTANCE
export function sortInventoryByDistance(
  inventory,
  userLocation,
  uniqueLocationsMap
) {
  if (!userLocation?.latitude || !userLocation?.longitude) {
    return inventory;
  }

  const enriched = [];

  for (const item of inventory) {
    const key = `${item.city}|${item.state}`;
    const loc = uniqueLocationsMap[key];

    if (!loc) {
      // No coordinates found, keep item unsorted at bottom
      enriched.push({ ...item, distance: Infinity });
      continue;
    }

    const distance = getDistance(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
      {
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
      }
    );

    enriched.push({ ...item, distance });
  }

  enriched.sort((a, b) => a.distance - b.distance);

  return enriched.map(({ distance, ...rest }) => rest);
}

///////////////.  SORT INV BY BEST MATCH
/* export function sortInventoryByBestMatch(inventory, userLocation) {
  if (!userLocation?.latitude || !userLocation?.longitude) return inventory;

  const userLat = parseFloat(userLocation.latitude);
  const userLon = parseFloat(userLocation.longitude);

  const enriched = inventory.map((car) => {
    const cityKey = `${car.city}, ${car.state}`;
    const zip = cityToZipMap[cityKey];
    // const loc = zipcodes.lookup(zip);
    const loc = lookupZip(zip);

    let distance = Number.MAX_SAFE_INTEGER;
    if (loc?.latitude && loc?.longitude) {
      distance = getDistance(
        { latitude: userLat, longitude: userLon },
        { latitude: loc.latitude, longitude: loc.longitude }
      );
    }

    return {
      ...car,
      _distance: distance, // meters
    };
  });

  // Sort by distance, then price
  enriched.sort((a, b) => {
    if (a._distance !== b._distance) {
      return a._distance - b._distance;
    } else {
      return parseFloat(a.price) - parseFloat(b.price);
    }
  });

  return enriched.map(({ _distance, ...rest }) => rest); // remove _distance after sorting
} */
export function sortInventoryByBestMatch(
  inventory,
  userLocation,
  uniqueLocationsMap
) {
  if (!userLocation?.latitude || !userLocation?.longitude) return inventory;

  const userLat = parseFloat(userLocation.latitude);
  const userLon = parseFloat(userLocation.longitude);

  // Convert array → key-value map
  const locMap = Object.fromEntries(
    uniqueLocationsMap.map((item) => [item.city_state, item])
  );
  const enriched = [];

  for (const item of inventory) {
    const key = `${item.city}|${item.state}`;
    const loc = locMap[key];

    let distance = Number.MAX_SAFE_INTEGER;

    distance = getDistance(
      { latitude: userLat, longitude: userLon },
      { latitude: loc.latitude, longitude: loc.longitude }
    );

    enriched.push({ ...item, _distance: distance });
  }

  // Sort by distance first, then price
  enriched.sort((a, b) => {
    if (a._distance !== b._distance) {
      return a._distance - b._distance;
    } else {
      return parseFloat(a.price) - parseFloat(b.price);
    }
  });

  return enriched.map(({ _distance, ...rest }) => rest); // remove _distance
}

// SCROLL TO TOP
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // runs every time the route changes

  return null; // this component renders nothing
}
/// FORMAT PRICE
export const formatPrice = (value) => {
  if (isNaN(value)) return null;
  const number = Math.floor(parseFloat(value));
  return (
    <>
      <i>$</i>
      {number.toLocaleString()}*
    </>
  );
};

// MILEAGE FORMATTER
export const mileageFormatter = (mil) => {
  if (mil == null || isNaN(mil)) return ""; // handle invalid or null inputs
  return mil.toLocaleString(); // adds commas in the thousandths place
};

// GET UNIQUE STYLES
export const getUniqueStyles = (vehArr) => {
  const uniqueStyles = [
    ...new Set(
      vehArr.flatMap((obj) => obj.style.split(",").map((s) => s.trim()))
    ),
  ];
  return uniqueStyles;
};

export function useClickOutside(ref, isActive, onClose) {
  const mouseDownInside = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseDown = (e) => {
      if (!ref.current.contains(e.target)) {
        onClose(e);
      } else {
        mouseDownInside.current = true;
      }
    };

    const handleClick = (e) => {
      if (
        isActive &&
        ref.current &&
        !ref.current.contains(e.target) &&
        !mouseDownInside.current
      ) {
        onClose(e);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("click", handleClick);
      mouseDownInside.current = false;
    };
  }, [ref, isActive, onClose]);
}

export function truncateString(string, limit) {
  // If the string is shorter than or equal to the limit, return it as-is
  if (string.length <= limit) return string;
  // Otherwise, truncate to the limit and append "..."
  return string.slice(0, limit) + "...";
}

/// CALC DISTANCE IN MILES
const toRad = (deg) => (deg * Math.PI) / 180;
export function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // radius of Earth in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

//DELAY RENDER (FOR <SUSPENSE/>, APP.JS)
export function DelayedRender({ delay = 400, children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return ready ? children : <FullPageLoader />;
}

/// TEST INPUT FOCUS STATE
export function isInputFocused(ref) {
  return ref.current === document.activeElement;
}
