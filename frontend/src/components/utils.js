import zipcodes from "zipcodes";
import { getDistance } from "geolib";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

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

const cityToZipMap = {
  "New Orleans, LA": "70124",
  "Los Angeles, CA": "90001",
  "Miami, FL": "33101",
  "Phoenix, AZ": "85001",
  "Charlotte, NC": "28202",
  "Seattle, WA": "98101",
  "Chicago, IL": "60601",
  "Tampa, FL": "33602",
  "Denver, CO": "80202",
  "Austin, TX": "73301",
  "Atlanta, GA": "30301",
  "Houston, TX": "77001",
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
  // Additional cities
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

//uses provided 'radius', location.latitude & .longitude, to
//// OFFER COUNT //
//each 'location' is a matching us_zip.csv obj
export function getOffers(inventory, location, radiusInMiles, countOnly) {
  //create array of uniq  city + state strings from inv
  const inv_cities = Array.from(
    new Set(inventory.map((item) => `${item.city}, ${item.state}`))
  );

  //For each unique city  string in from inv_cities, grab its 'zip' value from map, get city obj w/ lat & long (loc)
  const cities = inv_cities
    .filter((inv_cities) => {
      const zip = cityToZipMap[inv_cities]; //get zip for city
      if (!zip) return false;

      const loc = zipcodes.lookup(zip); //retrieve a full location obj using zip
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
}

export function sortInventoryByDistance(inventory, userLocation) {
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    return inventory; // return unsorted if no user location
  }

  return [...inventory]
    .map((item) => {
      const cityKey = `${item.city}, ${item.state}`;
      const zip = cityToZipMap[cityKey];
      const loc = zip && zipcodes.lookup(zip);

      let distance = Infinity; // default if we can't compute distance
      if (loc && loc.latitude && loc.longitude) {
        distance = getDistance(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          {
            latitude: loc.latitude,
            longitude: loc.longitude,
          }
        );
      }

      return { ...item, distance }; // temporarily store distance
    })
    .sort((a, b) => a.distance - b.distance) // sort by proximity
    .map(({ distance, ...rest }) => rest); // remove distance before returning
}

export function sortInventoryByBestMatch(inventory, userLocation) {
  if (!userLocation?.latitude || !userLocation?.longitude) return inventory;

  const userLat = parseFloat(userLocation.latitude);
  const userLon = parseFloat(userLocation.longitude);

  const enriched = inventory.map((car) => {
    const cityKey = `${car.city}, ${car.state}`;
    const zip = cityToZipMap[cityKey];
    const loc = zipcodes.lookup(zip);

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
}

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // runs every time the route changes

  return null; // this component renders nothing
}

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
