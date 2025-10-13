import { searchInventory } from "../axiosCalls.js";

//LOCATION SEARCH
export const handleLocationSearch = async (loc, distFilter = false) => {
  const isZip = /^\d{5}$/.test(loc.trim());
  const param = isZip ? `zip=${loc}` : `city=${encodeURIComponent(loc)}`;

  // add distFilter as a query param
  const query = `${param}&distFilter=${distFilter}`;

  const url = `http://localhost:5001/api/locations/search?${query}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("handleLocationSearch error:", err);
    return [];
  }
};

////////  INV STRING SEARCH (hitting 'enter')
export const invStringSearch = async (
  navigate,
  currentRoute,
  setAppliedFilters,
  setOrderedFilters,
  handleClearFilters,
  string
) => {
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

  if (!string) return;

  if (currentRoute !== "cars") navigate("/cars");

  handleClearFilters();

  const lower = string.toLowerCase().trim();

  try {
    // 🔹 Step 1: Ask backend for filtered inventory
    const filteredCars = await searchInventory(lower);

    if (!filteredCars || filteredCars.length === 0) {
      console.log("No matches found.");
      return;
    }

    // 🔹 Step 2: Build matchFlags from all filtered results
    const matchFlags = {};

    for (const car of filteredCars) {
      const { year, make, model, style, vin } = car;
      const lowerStyle = style?.toLowerCase();
      const lowerMake = make?.toLowerCase();
      const lowerModel = model?.toLowerCase();
      const lowerVin = vin?.toLowerCase();

      if (!lowerMake && !lowerModel && !lowerStyle && !lowerVin) continue;

      // --- STYLE ---
      const styleMatch =
        lowerStyle &&
        (lowerStyle.includes(lower) ||
          (lower === "truck" && lowerStyle.includes("pickup")));
      if (styleMatch) {
        const matchedStyle = allStyles.find(
          (s) =>
            s.toLowerCase().includes(lower) ||
            (lower === "truck" && s.toLowerCase() === "pickup")
        );
        if (matchedStyle) {
          matchFlags.style = matchedStyle;
          break; // style overrides all
        }
      }

      // --- MAKE ---
      const makeMatch = lowerMake === lower;
      if (makeMatch) {
        matchFlags.make = make;
      }

      // --- MODEL ---
      let modelSearch = lower;
      if (lowerMake && lower.startsWith(lowerMake + " ")) {
        modelSearch = lower.replace(lowerMake + " ", "");
      }

      const modelMatch = lowerModel && lowerModel.includes(modelSearch);
      if (modelMatch) {
        matchFlags.make = make;
        if (!matchFlags.models) matchFlags.models = {};
        if (!matchFlags.models[make]) matchFlags.models[make] = [];
        if (!matchFlags.models[make].includes(model)) {
          matchFlags.models[make].push(model);
        }
      }

      // --- YEAR ---
      if (String(year) === string) {
        matchFlags.year = year;
      }

      // --- VIN ---
      if (lowerVin === lower) {
        matchFlags.vin = vin;
      }
    }

    if (Object.keys(matchFlags).length === 0) return;

    // 🔹 Step 3: Apply filters as before
    setAppliedFilters((prev) => {
      const next = { ...prev };

      if (matchFlags.make) {
        next.makes = [...new Set([...(prev.makes || []), matchFlags.make])];
      }

      if (matchFlags.models) {
        next.models = { ...prev.models };
        for (const [make, models] of Object.entries(matchFlags.models)) {
          next.models[make] = [
            ...new Set([...(prev.models?.[make] || []), ...models]),
          ];
        }
      }

      if (matchFlags.style) {
        next.styles = [...new Set([...(prev.styles || []), matchFlags.style])];
      }

      if (matchFlags.year) {
        next.yearFrom = matchFlags.year;
        next.yearTo = matchFlags.year;
      }

      if (matchFlags.vin) {
        next.vin = matchFlags.vin;
      }

      return next;
    });

    setOrderedFilters((prev) => {
      const keys = [];

      if (matchFlags.make) keys.push("makes");
      if (matchFlags.models) keys.push("models");
      if (matchFlags.style) keys.push("styles");
      if (matchFlags.year) keys.push("yearFrom", "yearTo");
      if (matchFlags.vin) keys.push("vin");

      return [...new Set([...prev, ...keys])];
    });
  } catch (err) {
    console.error("Error searching inventory:", err);
  }
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
