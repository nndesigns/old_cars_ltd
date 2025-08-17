import React, { useState, useEffect, useRef } from "react";
import "./cars.css";
import Box from "@mui/joy/Box";
import Carousels from "../components/carousels";

import CarsToolbar from "../components/carsToolbar/carsToolbar";
import InventoryGrid from "../components/inventoryGrid/inventoryGrid";
import { useSelector, useDispatch } from "react-redux";
import {
  FilterMenu,
  SortByFilter,
  DistanceShippingFilter,
  MakeFilter,
  ModelFilter,
  BodyTypeFilter,
  YearFilter,
  PriceFilter, //maybe should just import this one as direct component instead
  MileageFilter,
  FuelTypeFilter,
  TaxCreditFilter,
  FeaturesFilter,
  CarSizeFilter,
  DoorsFilter,
  ExteriorColorFilter,
  InteriorColorFilter,
  DrivetrainFilter,
  TransmissionFilter,
  CylindersFilter,
  MPGFilter,
  AdvancedSearchFilter,
} from "../components/carsFilters/carsFilters";
import FilterPanel from "../components/carsFilters/filterPanel.js";
// import { saveFilter } from "../user/filtersSlice";
import MobileFilterRow from "../components/carsFilters/mobileFilterRow.js";
import ConcatH3 from "../components/concatH3.js";
import { getUniqueStyles } from "../components/utils";

import {
  sortInventoryByDistance,
  sortInventoryByBestMatch,
} from "../components/utils";

const Cars = ({
  inventory,
  below820,
  above375,
  defaultFilterState,
  appliedFilters,
  setAppliedFilters, /// setter
  orderedFilters,
  setOrderedFilters, ////setter
}) => {
  const dispatch = useDispatch();

  // console.log("CARS JUST RE-RENDERED");
  const carsToolbarRef = useRef();
  const h3Ref = useRef();
  const mobileRowRef = useRef();
  //// REDUX STATES
  const userLocation = useSelector((state) => state.location);
  //// USESTATES
  const [matchesArray, setMatchesArray] = useState([]); ////setter

  //MOBILE FILTER PANEL
  const [showMobileFilterPanel, setShowMobileFilterPanel] = useState(false); ///setter

  //ACTIVE FILTER
  const [activeFilter, setActiveFilter] = useState(null); ///// setter

  const hasAppliedFilters = Object.entries(appliedFilters)
    .filter(([key]) => key !== "sort")
    .some(
      ([, value]) =>
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0) &&
        !(
          typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0
        )
    );

  //NOTE : TRY TO MAKE  ORDERED FILTERS A USEREF INSTEAD, SO RESETTING WON'T CASUSE FILTER TO RE-RENDER W/ ONLY SELECTED OPTIONS.
  const [filterStageArrays, setFilterStageArrays] = useState({});
  // const cleanedOrderedFilters = useMemo(() => {
  //   return orderedFilters.filter((key) => {
  //     const value = appliedFilters[key];
  //     return !(
  //       value === undefined ||
  //       value === null ||
  //       value === "" ||
  //       (Array.isArray(value) && value.length === 0) ||
  //       (typeof value === "object" &&
  //         !Array.isArray(value) &&
  //         Object.keys(value).length === 0)
  //     );
  //   });
  // }, [orderedFilters, appliedFilters]);

  // const pillCount = useMemo(() => {
  //   return Object.entries(appliedFilters)
  //     .filter(([key, value]) => {
  //       if (key === "sort") return false;
  //       if (
  //         value === undefined ||
  //         value === null ||
  //         value === "" ||
  //         (Array.isArray(value) && value.length === 0) ||
  //         (typeof value === "object" &&
  //           !Array.isArray(value) &&
  //           Object.keys(value).length === 0)
  //       )
  //         return false;
  //       return true;
  //     })
  //     .reduce(
  //       (count, [_, value]) =>
  //         Array.isArray(value) ? count + value.length : count + 1,
  //       0
  //     );
  // }, [appliedFilters]);

  // CATEGORIES FOR SORT FILTER
  const sortCats = [
    "Best match",
    "Nearest distance",
    "Lowest price",
    "Highest price",
    "Lowest mileage",
    "Highest mileage",
    "Newest year",
    "Oldest year",
    "New match",
  ];

  const getCountsObj = (inv, ppty) => {
    return inv.reduce((acc, item) => {
      let value = item[ppty];

      if (value) {
        if (ppty === "style") {
          value
            .split(",")
            .map((v) => v.trim())
            .forEach((v) => {
              if (v) {
                acc[v] = (acc[v] || 0) + 1;
              }
            });
        } else if (ppty === "model") {
          const make = item.make || "Unknown Make";
          const model = value;

          // Ensure the make array exists
          if (!acc[make]) {
            acc[make] = [];
          }

          // Check if the model already exists under that make
          const existingModel = acc[make].find(
            (entry) => entry.model === model
          );

          if (existingModel) {
            existingModel.count += 1;
          } else {
            acc[make].push({ model, count: 1 });
          }
        } else {
          acc[value] = (acc[value] || 0) + 1;
        }
      }

      return acc;
    }, {});
  };

  ///////  USE EFFECT REACTION TO filterState CHANGES (RESET matchesArray)
  useEffect(() => {
    // console.log("CARS received orderedFilters", orderedFilters);
    ////// Remove empty appliedFilters keys from orderedFilters ///////
    /*  const cleanedOrderedFilters = orderedFilters.filter((key) => {
      const value = appliedFilters[key];
      return !(
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0)
      );
    });

    console.log("cleanedOrderedFilters", cleanedOrderedFilters);
    // If cleaned list is different, update it:
    if (cleanedOrderedFilters.length !== orderedFilters.length) {
      setOrderedFilters(cleanedOrderedFilters);
    } */

    let filtered = [...inventory];
    const newFilterStageArrays = {};
    //MAP OVER ORDERED FILTERS
    orderedFilters.forEach((filterKey) => {
      //ASSIGN KEYS INTO FILTER STAGE ARRAYS
      newFilterStageArrays[filterKey] = [...filtered]; //for each string (key name) in 'orderedFilters' array, reassign
      const value = appliedFilters[filterKey]; // ["AMC"]
      if (
        value == null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      )
        return;

      switch (
        filterKey // "makes"
      ) {
        case "makes":
          filtered = filtered.filter((car) => value.includes(car.make));
          break;

        case "models":
          filtered = filtered.filter((car) => {
            const makeKey = car.make;
            const selectedModelsForMake = value[makeKey];

            if (selectedModelsForMake && selectedModelsForMake.length > 0) {
              // If this make has models selected, only include those models
              return selectedModelsForMake.includes(car.model);
            }

            // If no models are selected for this make, include all models for it
            return appliedFilters.makes.includes(makeKey);
          });
          break;

        case "styles": //Body Type
          filtered = filtered.filter(
            (item) =>
              item.style &&
              item.style
                .split(",")
                .map((s) => s.trim())
                .some((s) => appliedFilters.styles.includes(s))
          );
          break;

        case "minPrice":
          filtered = filtered.filter((car) => car.price >= value);
          break;
        case "maxPrice":
          filtered = filtered.filter((car) => car.price <= value);
          break;
        case "yearFrom":
          filtered = filtered.filter((car) => car.year >= value);
          break;
        case "yearTo":
          filtered = filtered.filter((car) => car.year <= value);
          break;
        case "mileage":
          filtered = filtered.filter((car) => car.mileage <= value);
          break;
        // add others...
      }
    });
    /////// SORT (last) ///////
    if (appliedFilters.sort === "Best match") {
      filtered = sortInventoryByBestMatch(filtered, userLocation);
    } else if (appliedFilters.sort === "Nearest distance") {
      filtered = sortInventoryByDistance(filtered, userLocation);
    } else if (appliedFilters.sort === "Lowest price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (appliedFilters.sort === "Highest price") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (appliedFilters.sort === "Lowest mileage") {
      filtered.sort((a, b) => a.mileage - b.mileage);
    } else if (appliedFilters.sort === "Highest mileage") {
      filtered.sort((a, b) => b.mileage - a.mileage);
    } else if (appliedFilters.sort === "Newest year") {
      filtered.sort((a, b) => new Date(b.year) - new Date(a.year));
    } else if (appliedFilters.sort === "Oldest year") {
      filtered.sort((a, b) => new Date(a.year) - new Date(b.year));
    } /* else if (filterState.sort === "New match") {
      filtered.sort((a, b) => new Date(b.year) - new Date(a.year));
    } */

    setMatchesArray(filtered);
    setFilterStageArrays(newFilterStageArrays);
  }, [
    appliedFilters,
    orderedFilters,
    hasAppliedFilters,
    inventory,
    dispatch,
    userLocation,
  ]);

  // Update orderedFilters only if needed
  // useEffect(() => {
  //   if (cleanedOrderedFilters.length !== orderedFilters.length) {
  //     setOrderedFilters(cleanedOrderedFilters);
  //   }
  // }, [cleanedOrderedFilters, orderedFilters]);

  // Filter and sort inventory
  // const { filteredInventory, computedFilterStageArrays } = useMemo(() => {
  //   let filtered = [...inventory];
  //   const newFilterStageArrays = {};

  //   orderedFilters.forEach((filterKey) => {
  //     newFilterStageArrays[filterKey] = [...filtered];
  //     const value = appliedFilters[filterKey];
  //     if (
  //       value == null ||
  //       value === "" ||
  //       (Array.isArray(value) && value.length === 0)
  //     )
  //       return;

  //     switch (filterKey) {
  //       case "makes":
  //         filtered = filtered.filter((car) => value.includes(car.make));
  //         break;
  //       case "models":
  //         filtered = filtered.filter((car) => {
  //           const selectedModelsForMake = value[car.make];
  //           return selectedModelsForMake?.length
  //             ? selectedModelsForMake.includes(car.model)
  //             : appliedFilters.makes.includes(car.make);
  //         });
  //         break;
  //       case "styles":
  //         filtered = filtered.filter((car) =>
  //           car.style
  //             ?.split(",")
  //             .map((s) => s.trim())
  //             .some((s) => appliedFilters.styles.includes(s))
  //         );
  //         break;
  //       case "minPrice":
  //         filtered = filtered.filter((car) => car.price >= value);
  //         break;
  //       case "maxPrice":
  //         filtered = filtered.filter((car) => car.price <= value);
  //         break;
  //       case "yearFrom":
  //         filtered = filtered.filter((car) => car.year >= value);
  //         break;
  //       case "yearTo":
  //         filtered = filtered.filter((car) => car.year <= value);
  //         break;
  //       case "mileage":
  //         filtered = filtered.filter((car) => car.mileage <= value);
  //         break;
  //     }
  //   });

  //   // Sorting
  //   switch (appliedFilters.sort) {
  //     case "Best match":
  //       filtered = sortInventoryByBestMatch(filtered, userLocation);
  //       break;
  //     case "Nearest distance":
  //       filtered = sortInventoryByDistance(filtered, userLocation);
  //       break;
  //     case "Lowest price":
  //       filtered.sort((a, b) => a.price - b.price);
  //       break;
  //     case "Highest price":
  //       filtered.sort((a, b) => b.price - a.price);
  //       break;
  //     case "Lowest mileage":
  //       filtered.sort((a, b) => a.mileage - b.mileage);
  //       break;
  //     case "Highest mileage":
  //       filtered.sort((a, b) => b.mileage - a.mileage);
  //       break;
  //     case "Newest year":
  //       filtered.sort((a, b) => b.year - a.year);
  //       break;
  //     case "Oldest year":
  //       filtered.sort((a, b) => a.year - b.year);
  //       break;
  //   }

  //   return {
  //     filteredInventory: filtered,
  //     computedFilterStageArrays: newFilterStageArrays,
  //   };
  // }, [orderedFilters, appliedFilters, inventory, userLocation]);
  // const { filteredInventory, computedFilterStageArrays } = useMemo(() => {
  //   let filtered = [...inventory];
  //   const newFilterStageArrays = {};

  //   orderedFilters.forEach((filterKey) => {
  //     newFilterStageArrays[filterKey] = [...filtered]; // snapshot before filtering
  //     const value = appliedFilters[filterKey];
  //     if (!value || (Array.isArray(value) && value.length === 0)) return;

  //     // Filter logic by type
  //     switch (filterKey) {
  //       case "makes":
  //         filtered = filtered.filter((car) => value.includes(car.make));
  //         break;
  //       case "models":
  //         filtered = filtered.filter((car) => {
  //           const selectedModelsForMake = value[car.make];
  //           return selectedModelsForMake?.length
  //             ? selectedModelsForMake.includes(car.model)
  //             : appliedFilters.makes.includes(car.make);
  //         });
  //         break;
  //       case "styles":
  //         filtered = filtered.filter((car) =>
  //           car.style
  //             ?.split(",")
  //             .map((s) => s.trim())
  //             .some((s) => appliedFilters.styles.includes(s))
  //         );
  //         break;
  //       // Numeric ranges
  //       case "minPrice":
  //         filtered = filtered.filter((car) => car.price >= value);
  //         break;
  //       case "maxPrice":
  //         filtered = filtered.filter((car) => car.price <= value);
  //         break;
  //       case "yearFrom":
  //         filtered = filtered.filter((car) => car.year >= value);
  //         break;
  //       case "yearTo":
  //         filtered = filtered.filter((car) => car.year <= value);
  //         break;
  //       case "mileage":
  //         filtered = filtered.filter((car) => car.mileage <= value);
  //         break;
  //     }
  //   });

  //   // Sorting
  //   switch (appliedFilters.sort) {
  //     case "Lowest price":
  //       filtered.sort((a, b) => a.price - b.price);
  //       break;
  //     case "Highest price":
  //       filtered.sort((a, b) => b.price - a.price);
  //       break;
  //     case "Lowest mileage":
  //       filtered.sort((a, b) => a.mileage - b.mileage);
  //       break;
  //     case "Highest mileage":
  //       filtered.sort((a, b) => b.mileage - a.mileage);
  //       break;
  //     case "Newest year":
  //       filtered.sort((a, b) => b.year - a.year);
  //       break;
  //     case "Oldest year":
  //       filtered.sort((a, b) => a.year - b.year);
  //       break;
  //     case "Best match":
  //       filtered = sortInventoryByBestMatch(filtered, userLocation);
  //       break;
  //     case "Nearest distance":
  //       filtered = sortInventoryByDistance(filtered, userLocation);
  //       break;
  //   }

  //   return {
  //     filteredInventory: filtered,
  //     computedFilterStageArrays: newFilterStageArrays,
  //   };
  // }, [orderedFilters, appliedFilters, inventory, userLocation]);

  // useEffect(() => {
  //   setMatchesArray(filteredInventory);
  //   setFilterStageArrays(computedFilterStageArrays);
  // }, [filteredInventory, computedFilterStageArrays]);

  /////////       FILTER COMPONENTS MAP      //////////
  //pass 'matchesArray' into here
  const filterComponentsMap = {
    "Filter Menu": () => {
      const { ["Filter Menu"]: _, ...rest } = filterComponentsMap;
      const filterNames = Object.keys(rest);
      return (
        <FilterMenu
          setActiveFilter={setActiveFilter} //only invoked when used (not on initial mount)
          filters={filterNames}
          appliedFilters={appliedFilters}
        />
      );
    },

    "Sort by": () => (
      <SortByFilter
        sortCats={sortCats}
        chosenSortCategory={appliedFilters.sort}
        setAppliedFilters={setAppliedFilters}
      />
    ),

    "Distance or Shipping": () => <DistanceShippingFilter />,
    Price: () => (
      <PriceFilter
        options={[
          ...(filterStageArrays["minPrice"]
            ? filterStageArrays["minPrice"]
            : orderedFilters.length > 0
            ? matchesArray
            : inventory),
          ...(filterStageArrays["maxPrice"]
            ? filterStageArrays["maxPrice"]
            : orderedFilters.length > 0
            ? matchesArray
            : inventory),
        ]}
        setAppliedFilters={setAppliedFilters}
        appliedFilters={appliedFilters}
        leftPanel={true}
        setOrderedFilters={setOrderedFilters}
      />
    ),

    Make: () => (
      <MakeFilter
        currentMakes={appliedFilters.makes}
        setAppliedFilters={setAppliedFilters}
        options={
          filterStageArrays["makes"]
            ? getCountsObj(filterStageArrays["makes"], "make")
            : orderedFilters.length > 0
            ? getCountsObj(matchesArray, "make")
            : getCountsObj(inventory, "make")
        }
        orderedFilters={orderedFilters}
        setOrderedFilters={setOrderedFilters}
      />
    ),

    Model: () => (
      <ModelFilter
        currentMakes={appliedFilters.makes}
        currentModels={Object.values(appliedFilters.models || {}).flat()}
        setAppliedFilters={setAppliedFilters}
        options={
          filterStageArrays["models"]
            ? getCountsObj(filterStageArrays["models"], "model")
            : orderedFilters.length > 0
            ? getCountsObj(matchesArray, "model")
            : getCountsObj(inventory, "model")
        }
        orderedFilters={orderedFilters}
        setOrderedFilters={setOrderedFilters}
      />
    ),

    "Body Type": () => (
      <BodyTypeFilter
        currentBodyTypes={appliedFilters.styles}
        setAppliedFilters={setAppliedFilters}
        options={
          filterStageArrays["styles"]
            ? getCountsObj(filterStageArrays["styles"], "style")
            : orderedFilters.length > 0
            ? getCountsObj(matchesArray, "style")
            : getCountsObj(inventory, "style")
        }
        orderedFilters={orderedFilters}
        setOrderedFilters={setOrderedFilters}
      />
    ),
    Year: () => (
      <YearFilter
        options={[
          ...(filterStageArrays["yearFrom"]
            ? filterStageArrays["yearFrom"]
            : orderedFilters.length > 0
            ? matchesArray
            : inventory),
          ...(filterStageArrays["yearTo"]
            ? filterStageArrays["yearTo"]
            : orderedFilters.length > 0
            ? matchesArray
            : inventory),
        ]}
        setAppliedFilters={setAppliedFilters}
        appliedFilters={appliedFilters}
        setOrderedFilters={setOrderedFilters}
      />
    ),
    Mileage: () => (
      <MileageFilter
        setAppliedFilters={setAppliedFilters}
        appliedFilters={appliedFilters}
        options={
          filterStageArrays["mileage"]
            ? filterStageArrays["mileage"]
            : orderedFilters.length > 0
            ? matchesArray
            : inventory
        }
        // leftPanel =
        setOrderedFilters={setOrderedFilters}
      />
    ),
    "Fuel Type": () => <FuelTypeFilter setAppliedFilters={setAppliedFilters} />,
    "Used EV Tax Credit": () => (
      <TaxCreditFilter setAppliedFilters={setAppliedFilters} />
    ),
    Features: () => <FeaturesFilter setAppliedFilters={setAppliedFilters} />,
    "Car Size": () => <CarSizeFilter setAppliedFilters={setAppliedFilters} />,
    Doors: () => <DoorsFilter setAppliedFilters={setAppliedFilters} />,
    "Exterior Color": () => (
      <ExteriorColorFilter setAppliedFilters={setAppliedFilters} />
    ),
    "Interior Color": () => (
      <InteriorColorFilter setAppliedFilters={setAppliedFilters} />
    ),
    Drivetrain: () => (
      <DrivetrainFilter setAppliedFilters={setAppliedFilters} />
    ),
    Transmission: () => (
      <TransmissionFilter setAppliedFilters={setAppliedFilters} />
    ),
    Cylinders: () => <CylindersFilter setAppliedFilters={setAppliedFilters} />,
    "MPG Highway": () => <MPGFilter setAppliedFilters={setAppliedFilters} />,
    "Advanced Search": () => (
      <AdvancedSearchFilter setAppliedFilters={setAppliedFilters} />
    ),
  };

  //add setOrderedFilters() to this and remove 'cleanOrderedFilters' from useEffect above
  ///// CLOSE PILL
  const closePill = (key, value) => {
    setAppliedFilters((prev) => {
      const newFilters = { ...prev };

      // Handle array-based filters (like 'makes', 'styles', etc.)
      if (Array.isArray(newFilters[key])) {
        newFilters[key] = newFilters[key].filter((item) => item !== value);
        if (newFilters[key].length === 0) {
          setOrderedFilters((prevOrdered) =>
            prevOrdered.filter((item) => item !== key)
          );
        }
        // If MAKE pill was removed, remove all ASSOC'D MODELS (if present)
        if (key === "makes" && prev.models.hasOwnProperty(value)) {
          const { [value]: _, ...modelsWithoutValue } = prev.models;
          //assign new entry-removed version of obj to newFilters[key]
          newFilters["models"] = modelsWithoutValue;
          //if no other keys exist in prev.models object (iow appliedFilters.models = empty obj)
          if (Object.keys(modelsWithoutValue).length === 0) {
            //take 'models' out of 'orderedFilters array
            setOrderedFilters((prevOrdered) =>
              prevOrdered.filter((item) => item !== "models")
            );
          }
        }
      } else if (
        // if prev[key] is an object
        typeof newFilters[key] === "object" &&
        newFilters[key] !== null &&
        !Array.isArray(newFilters[key])
      ) {
        //get 'key' from 'value' arg (also object)
        const objKey = Object.keys(value)[0];
        // if received 'value' object's value is an array (ex; {AMC:["Gremlin"]} )
        if (Array.isArray(Object.values(value)[0])) {
          //get  'value' obj's array's item (ex; "Gremlin") [there will only be 1]
          const arrayItemToRemove = Object.values(value)[0][0];
          //filter it our of the array value
          const updatedArray = prev[key][objKey].filter(
            (item) => item !== arrayItemToRemove
          );
          //if value obj's array value becomes empty from filter (ex; {AMC:[]} )
          if (updatedArray.length === 0) {
            //remove entire key entry from value obj (ex: {} )
            const { [objKey]: _, ...objWithoutKey } = prev[key];
            //assign new entry-removed version of obj to newFilters[key]
            newFilters[key] = objWithoutKey;
            // if removing that key entry was last key entry and value obj is now empty
            if (Object.keys(objWithoutKey).length === 0) {
              //// remove key from 'orderedFilters' array
              setOrderedFilters((prevOrdered) =>
                prevOrdered.filter((item) => item !== key)
              );
            }
          } else {
            //if val obj's filtered array (updatedArray) not empty, assign them
            newFilters[key] = {
              ...prev[key], // clone nested object
              [objKey]: updatedArray, // replace key's array
            };
          }
        } else {
          //if received 'value' object's value is a string or a number (ex; {} )
        }
      } else {
        // For scalar or object filters (like mileage, yearFrom, etc.)
        newFilters[key] = null;
      }
      console.log("newFilters", newFilters);
      return newFilters;
    });

    // Close ModelFilter UI if no makes are left
    if (
      appliedFilters.makes.length === 1 &&
      key === "makes" &&
      activeFilter === "Model"
    ) {
      console.log("this was triggered");
      setActiveFilter(null);
    }
  };

  useEffect(() => {
    if (below820 === false) {
      setShowMobileFilterPanel(false);
      setActiveFilter(null);
    }
  }, [below820]);

  return (
    <div className="page_container cars_container">
      {/* FULL PAGE FILTER PANEL (from .mobileFilterRow btn click) */}
      {showMobileFilterPanel && below820 && (
        <FilterPanel
          activeFiltersList={orderedFilters}
          setOrderedFilters={setOrderedFilters}
          orderedFilterCount={orderedFilters.length}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
          closePill={closePill}
          defaultFilterState={defaultFilterState}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterComponentsMap={filterComponentsMap}
          //EXTRA MOBILE ARGS
          mobile={true}
          setShowMobileFilterPanel={setShowMobileFilterPanel}
          matchesTotal={matchesArray.length}
        />
      )}
      <Box className="center_box">
        {" "}
        {/* flex row (index.css) for centering .middle_content*/}
        <div className="middle_content cars_content">
          {/********* LEFT PANEL **********/}

          {!below820 && (
            //container to hold 'sticky' (left_panel) to  top of page (just like .right_panel holds child section (sticky) to its top)

            <FilterPanel
              activeFiltersList={orderedFilters}
              setOrderedFilters={setOrderedFilters}
              orderedFilterCount={orderedFilters.length}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              closePill={closePill}
              defaultFilterState={defaultFilterState}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              filterComponentsMap={filterComponentsMap}
            />
          )}
          {/***************RIGHT PANEL *************/}

          <div
            className="right_panel"
            style={hasAppliedFilters ? { width: "1600px" } : undefined}
          >
            {below820 && orderedFilters.length > 0 && (
              <MobileFilterRow
                appliedFilters={appliedFilters}
                closePill={closePill}
                setActiveFilter={setActiveFilter}
                setShowMobileFilterPanel={setShowMobileFilterPanel}
                activeFiltersList={orderedFilters}
              />
            )}
            {/* <h3>Used cars near me for sale</h3> */}
            <ConcatH3 appliedFilters={appliedFilters} />
            {!hasAppliedFilters && (
              <Carousels
                carStyles={true}
                carsPage={true}
                setAppliedFilters={setAppliedFilters}
                setOrderedFilters={setOrderedFilters}
              />
            )}
            <CarsToolbar
              matchesTotal={matchesArray.length}
              below820={below820}
              above375={above375}
              setShowMobileFilterPanel={setShowMobileFilterPanel}
              orderedFilterCount={orderedFilters.length}
              setActiveFilter={setActiveFilter}
              sortCats={sortCats}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
            />

            {matchesArray.length > 0 ? (
              <InventoryGrid cars={matchesArray} below820={below820} />
            ) : (
              <div
                className="no_results"
                style={{
                  height: "calc(100% - 8rem)",
                }}
              >
                <ConcatH3 appliedFilters={appliedFilters} noResults={true} />
              </div>
            )}
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Cars;
