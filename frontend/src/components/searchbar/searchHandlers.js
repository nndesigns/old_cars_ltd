// import {
//   MakeFilter,
//   ModelFilter,
//   BodyTypeFilter,
//   YearFilter,
// } from "../carsFilters/carsFilters";

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
    return result;
  } catch (err) {
    console.error("handleLocationSearch error:", err);
    return [];
  }
};

function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

///dedupe objects helper fn
function dedupeByKey(array, keyFn) {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// INV SEARCH
export const handleInvSearch = (invSearch, inv) => {
  const allStyles = [
    "convertible",
    "coupe",
    "hatchback",
    "luxury",
    "muscle car",
    "pickup",
    "sedan",
    "station wagon",
    "SUV / 4x4",
    "van",
  ];

  const invMatches = { Make: [], Model: [], Style: [], Year: [] };
  if (!invSearch || !Array.isArray(inv)) return invMatches;

  const search = invSearch.toLowerCase();

  // ----------- MAKE MATCHES -----------
  /*   let makeMatches = inv
    .filter(
      (item) =>
        item.make &&
        item.make.toLowerCase().includes(search.trim().toLowerCase())
    )
    .map((item) => item.make);
  makeMatches = [...new Set(makeMatches)];

  invMatches.Make = makeMatches;

  //CHECKING whether COMPLETE MAKE provided
  //adding all make models to invMatches.Models if so
  const uniqueMakesLower = [
    ...new Set(inv.map((item) => item.make.toLowerCase())),
  ];
  const isFullMakeWithSpace = uniqueMakesLower.some(
    (make) => search === `${make} `
  );

  //include all models (written as 'make+model') for all matching 'makes', add those to invMatches.Model too (in addition to models for matching models) (also written as 'make+model')
  let dedupedMakeModelMatches;
  if (isFullMakeWithSpace) {
    const makeModelMatches = inv
      .filter((item) => makeMatches.includes(item.make))
      .map((item) => ({
        display: `${item.make} ${item.model}`,
        make: item.make,
        model: item.model,
      }));

    dedupedMakeModelMatches = dedupeByKey(
      makeModelMatches,
      (item) => item.display
    );
  }

  // ----------- MODEL MATCHES -----------
  const modelMatches = inv
    .filter((item) => item.model && item.model.toLowerCase().includes(search))
    .map((item) => ({
      display: `${item.make} ${item.model}`,
      make: item.make,
      model: item.model,
    }));

  //dedupe all modelMatches objects
  const dedupedModelMatches = dedupeByKey(modelMatches, (item) => item.display);

  //combine the two individual arrays, and dedupe their combination, assign to invMatches.Model
  invMatches.Model = dedupeByKey(
    [...(dedupedMakeModelMatches || []), ...dedupedModelMatches],
    (item) => item.display
  ); */
  // ----------- MAKE MATCHES (partial) -----------
  let makeMatches = inv
    .filter(
      (item) =>
        item.make &&
        item.make.toLowerCase().includes(search.trim().toLowerCase())
    )
    .map((item) => item.make);
  makeMatches = [...new Set(makeMatches)];
  invMatches.Make = makeMatches;

  // Create lowercase makes list for quick comparison
  const uniqueMakesLower = [
    ...new Set(inv.map((item) => item.make.toLowerCase())),
  ];

  // Recognize "full make + space"
  const isFullMakeWithSpace = uniqueMakesLower.some(
    (make) => search === `${make} `
  );

  // Recognize "full make + space + at least one more letter"
  let makeFromSearch = null;
  const isFullMakeWithExtra = uniqueMakesLower.some((make) => {
    if (search.startsWith(`${make} `) && search.length > make.length + 1) {
      makeFromSearch = make; // store matched make
      return true;
    }
    return false;
  });

  // ----------- MODELS when "full make + space" -----------
  let dedupedMakeModelMatches;
  if (isFullMakeWithSpace) {
    const makeModelMatches = inv
      .filter((item) => makeMatches.includes(item.make))
      .map((item) => ({
        display: `${item.make} ${item.model}`,
        make: item.make,
        model: item.model,
      }));
    dedupedMakeModelMatches = dedupeByKey(
      makeModelMatches,
      (item) => item.display
    );
  }

  // ----------- MODEL MATCHES -----------
  let modelMatches;

  if (isFullMakeWithExtra && makeFromSearch) {
    // Trim make + space from search
    const modelSearchTerm = search.slice(makeFromSearch.length + 1);

    // Find models that start with the trimmed term
    modelMatches = inv
      .filter(
        (item) =>
          item.make.toLowerCase() === makeFromSearch &&
          item.model &&
          item.model.toLowerCase().startsWith(modelSearchTerm)
      )
      .map((item) => ({
        display: `${item.make} ${item.model}`,
        make: item.make,
        model: item.model,
      }));

    // Also keep the make in Make matches
    invMatches.Make = [
      ...new Set([...invMatches.Make, capitalizeWords(makeFromSearch)]),
    ];
  } else {
    // Normal model search (still contains match, not starts-with)
    modelMatches = inv
      .filter((item) => item.model && item.model.toLowerCase().includes(search))
      .map((item) => ({
        display: `${item.make} ${item.model}`,
        make: item.make,
        model: item.model,
      }));
  }

  const dedupedModelMatches = dedupeByKey(modelMatches, (item) => item.display);

  // Merge dedupedMakeModelMatches (if present) with dedupedModelMatches
  invMatches.Model = dedupeByKey(
    [...(dedupedMakeModelMatches || []), ...dedupedModelMatches],
    (item) => item.display
  );
  // ----------- STYLE MATCHES -----------
  const styleMatches = allStyles.filter((item) =>
    item.toLowerCase().includes(search)
  );

  invMatches.Style = styleMatches.map((match) => capitalizeWords(match));

  // ----------- YEAR MATCHES -----------
  const yearMatches = inv
    .filter((item) => item.year && item.year.toString().includes(search))
    .sort((a, b) => a.year - b.year) // sort by year ascending
    .map((item) => ({
      display: `${item.year} ${item.make} ${item.model}`,
      make: item.make,
      model: item.model,
      year: item.year,
    }));

  invMatches.Year = dedupeByKey(yearMatches, (item) => item.display);

  return invMatches;
};

////////  INV STRING SEARCH (hitting 'enter')
export const invStringSearch = (
  navigate,
  currentRoute,
  setAppliedFilters,
  setOrderedFilters,
  handleClearFilters,
  dropMatches,
  string
) => {
  if (currentRoute !== "cars") {
    navigate("/cars");
  }
  // handleClearFilters();
  console.log("dropMatches", dropMatches);
  setAppliedFilters((prev) => {
    // const cleared = handleClearFilters("return-only"); // Get cleared filters without setting state
    const nextFilters = { ...prev };

    if (dropMatches.Make.length) {
      nextFilters.Make = dropMatches.Make;
    }
    return nextFilters;
  });

  setOrderedFilters((prev) => {
    const nextOrdered = [...prev];
    if (dropMatches.Make.length) {
      nextOrdered.push("makes");
    }
    return nextOrdered;
  });
};

///////// MAKE MODEL SEARCH (clicking a droplist item)
export const makeModelSearch = (
  navigate,
  currentRoute,
  setAppliedFilters,
  setOrderedFilters,
  handleClearFilters,
  key,
  item,
  inputRef,
  setInvSearch,
  lastArg
) => {
  handleClearFilters();
  if (currentRoute !== "cars") {
    navigate("/cars");
  }
  if (key === "Make") {
    setAppliedFilters((prev) => ({
      ...prev, // keep all the other filters the same
      makes: [item], // replace makes array with just this item
    }));
    setOrderedFilters(["makes"]);
  } else if (key === "Model") {
    setAppliedFilters((prev) => ({
      ...prev, // keep all the other filters the same
      makes: [item.make],
      models: { [item.make]: [item.model] }, // replace makes array with just this item
    }));
    setOrderedFilters(["makes", "models"]);
  } else if (key === "Style") {
    if (Array.isArray(item)) {
      // in case 'see all CROSSOVERS' btn (3 styles at once)
      setAppliedFilters((prev) => ({
        ...prev,
        styles: item.map((style) => style),
      }));
    } else {
      // if item is just a string
      setAppliedFilters((prev) => ({
        ...prev,
        styles: [item],
      }));
    }
    setOrderedFilters(["styles"]);
  } else if (key === "Year") {
    setAppliedFilters((prev) => ({
      ...prev, // keep all the other filters the same
      makes: [item.make],
      models: { [item.make]: [item.model] }, // replace makes array with just this item
      yearFrom: Number(item.year),
      yearTo: Number(item.year),
    }));
    setOrderedFilters(["makes", "models", "yearFrom", "yearTo"]);
  }

  //change input text to reflect selected 'item'
  if (setInvSearch) {
    setInvSearch(
      key === "Model" ? item.display : key === "Year" ? item.display : item
    );
  }

  if (inputRef?.current) {
    inputRef.current.value =
      key === "Model" ? item.display : key === "Year" ? item.display : item;
  }

  lastArg && console.log("lastArg", lastArg);
};

///redux applied filters are not getting updated with this search
