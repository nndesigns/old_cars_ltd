import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./cars.css";
import Box from "@mui/joy/Box";
import Carousels from "../components/carousels";
import { Helmet } from "react-helmet-async";
import {
  getLocalOffers,
  sortInventoryByDistance,
  sortInventoryByBestMatch,
} from "../components/utils";

import {
  removeFilterValue,
  removeModelFilter,
  clearSingleFilter,
} from "../user/filtersSlice.js";

import CarsToolbar from "../components/carsToolbar/carsToolbar";
import InventoryGrid from "../components/inventoryGrid/inventoryGrid";
import ComparePanel from "../components/comparePanel.js";

import {
  FilterMenu,
  SortByFilter,
  DistanceLocationFilter,
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

import { useSelector, useDispatch } from "react-redux";
//
// PREVENT SCROLL (REDUX)
//
import { lockScroll, unlockScroll } from "../uiSlice.js";
// import { processCityToZipMap } from "../components/utils.js";
// import {
//   selectChosenCars,
//   selectCompareCars,
// } from "../user/userSlice.js";

const Cars = ({
  below820,
  above375,
  // defaultFilterState,
  // appliedFilters,
  // setAppliedFilters, /// setter
  // orderedFilters,
  // setOrderedFilters, ////setter
  // compareCars,
  // setCompareCars,
  // chosenCars,
  // setChosenCars,

  AnimatePresence,
  PageTransition,
  // preventScroll,
}) => {
  // REDUX
  const dispatch = useDispatch();
  const uniqueLocations = useSelector(
    (state) => state.uniqueLocations.items ?? []
  );
  const inventory = useSelector((s) => s.inventory.items);
  const location = useSelector((s) => s.location);
  const appliedFilters = useSelector((s) => s.filters.appliedFilters);
  const orderedFilters = useSelector((s) => s.filters.orderedFilters);

  const [showMobileFilterPanel, setShowMobileFilterPanel] = useState(false);

  //SCROLL
  const enableScrollLock = () => dispatch(lockScroll());
  const disableScrollLock = () => dispatch(unlockScroll());

  //ACTIVE FILTER
  const [activeFilter, setActiveFilter] = useState(null); ///// setter

  //  SHOW COMPARE PREP PANEL
  const [showCompare, setShowCompare] = useState(() => {
    const saved = localStorage.getItem("showCompare");
    return saved ? JSON.parse(saved) : false;
  });
  // CHECKED CARS FROM /CARS (which 2 being compared, for 'More' tool)
  // console.log("showCompare", showCompare);

  // SAVE COMPARE PANEL STATES TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("showCompare", JSON.stringify(showCompare));
  }, [showCompare]);

  const hasAppliedFilters = useMemo(() => {
    //why not just test 'orderedFilters.length' here?????
    return Object.entries(appliedFilters)
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
  }, [appliedFilters]);

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

  const getCountsObj = useCallback((inv, ppty) => {
    return inv.reduce((acc, item) => {
      let value = item[ppty];
      if (value) {
        if (ppty === "style") {
          value
            .split(",")
            .map((v) => v.trim())
            .forEach((v) => {
              if (v) acc[v] = (acc[v] || 0) + 1;
            });
        } else if (ppty === "model") {
          const make = item.make || "Unknown Make";
          const model = value;
          if (!acc[make]) acc[make] = [];
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
  }, []);

  // useEffect(() => {
  //   console.log("appliedFilters (cars)", appliedFilters);
  // }, [appliedFilters]);

  //////// USE MEMO VERIONS OF APPLIED & ORDERED FILTERS  /////////////
  // const stableAppliedFilters = useMemo(() => appliedFilters, [appliedFilters]);
  // const stableOrderedFilters = useMemo(() => orderedFilters, [orderedFilters]);

  //SETTING MATCHES ARRAY &
  const { matchesArray, filterStageArrays } = useMemo(() => {
    let filtered = [...inventory];
    const newFilterStageArrays = {};

    orderedFilters.forEach((filterKey) => {
      newFilterStageArrays[filterKey] = [...filtered];
      const value = appliedFilters[filterKey];

      if (
        value == null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        uniqueLocations.length === 0
      )
        return;

      switch (filterKey) {
        // // DISTANCE
        case "dist_radius":
          filtered = getLocalOffers(
            filtered,
            uniqueLocations,
            location,
            value,
            false
          );
          break;
        // // VEH_LOCATION
        case "veh_locations":
          filtered = filtered.filter((car) => value.includes(car.city));
          break;

        case "makes":
          filtered = filtered.filter((car) => value.includes(car.make));
          break;
        case "models":
          filtered = filtered.filter((car) => {
            const makeKey = car.make;
            const selectedModelsForMake = value[makeKey];
            if (selectedModelsForMake && selectedModelsForMake.length > 0) {
              return selectedModelsForMake.includes(car.model);
            }
            return appliedFilters.makes.includes(makeKey);
          });
          break;
        case "styles":
          filtered = filtered.filter(
            (item) =>
              item.style &&
              item.style
                .split(",")
                .map((s) => s.trim().toLowerCase())
                .some((s) =>
                  appliedFilters.styles.some(
                    (filterStyle) => filterStyle.toLowerCase() === s
                  )
                )
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
        case "vin":
          filtered = filtered.filter((car) => car.vin === value);
          break;
        default:
          break;
      }
    });

    // Sorting
    if (appliedFilters.sort === "Best match") {
      filtered = sortInventoryByBestMatch(filtered, location, uniqueLocations);
    } else if (appliedFilters.sort === "Nearest distance") {
      filtered = sortInventoryByDistance(filtered, location, uniqueLocations);
    } else if (appliedFilters.sort === "Lowest price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (appliedFilters.sort === "Highest price") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (appliedFilters.sort === "Lowest mileage") {
      filtered.sort((a, b) => a.mileage - b.mileage);
    } else if (appliedFilters.sort === "Highest mileage") {
      filtered.sort((a, b) => b.mileage - a.mileage);
    } else if (appliedFilters.sort === "Newest year") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (appliedFilters.sort === "Oldest year") {
      filtered.sort((a, b) => a.year - b.year);
    }

    return {
      matchesArray: filtered,
      filterStageArrays: newFilterStageArrays,
    };
    // 👉 Stringify prevents re-run on reference-only changes
  }, [
    /* stableAppliedFilters, stableOrderedFilters, */ appliedFilters,
    orderedFilters,
    inventory,
    location,
  ]);

  //
  //  FILTER COMPONENTS MAP
  //
  const filterComponentsMap = useMemo(() => {
    const staticComponents = {
      "Sort by": () => (
        <SortByFilter
          sortCats={sortCats}
          chosenSortCategory={appliedFilters.sort}
        />
      ),

      "Distance or Location": () => (
        <DistanceLocationFilter
          location={location}
          currentVehLocations={appliedFilters.veh_locations}
          dist_radius={appliedFilters.dist_radius}
          // setPreventScroll={setPreventScroll}
          enableScrollLock={enableScrollLock}
          disableScrollLock={disableScrollLock}
        />
      ),

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
          appliedFilters={appliedFilters}
          leftPanel={true}
        />
      ),

      Make: () => (
        <MakeFilter
          currentMakes={appliedFilters.makes}
          options={
            filterStageArrays["makes"]
              ? getCountsObj(filterStageArrays["makes"], "make")
              : orderedFilters.length > 0
              ? getCountsObj(matchesArray, "make")
              : getCountsObj(inventory, "make")
          }
        />
      ),

      Model: () => (
        <ModelFilter
          currentMakes={appliedFilters.makes}
          currentModels={appliedFilters.models}
          currentModelsStrings={Object.values(
            appliedFilters.models || {}
          ).flat()}
          options={
            filterStageArrays["models"]
              ? getCountsObj(filterStageArrays["models"], "model")
              : orderedFilters.length > 0
              ? getCountsObj(matchesArray, "model")
              : getCountsObj(inventory, "model")
          }
          //setAppliedFilters = {setAppliedFilters}
          // setOrderedFilters={setOrderedFilters}
        />
      ),

      "Body Type": () => (
        <BodyTypeFilter
          currentBodyTypes={appliedFilters.styles}
          options={
            filterStageArrays["styles"]
              ? getCountsObj(filterStageArrays["styles"], "style")
              : orderedFilters.length > 0
              ? getCountsObj(matchesArray, "style")
              : getCountsObj(inventory, "style")
          }
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
          currYearFrom={appliedFilters.yearFrom}
          currYearTo={appliedFilters.yearTo}
        />
      ),

      Mileage: () => (
        <MileageFilter
          options={
            filterStageArrays["mileage"]
              ? filterStageArrays["mileage"]
              : orderedFilters.length > 0
              ? matchesArray
              : inventory
          }
          currentMileage={appliedFilters.mileage}
        />
      ),

      "Fuel Type": () => (
        <FuelTypeFilter /* setAppliedFilters={setAppliedFilters} */ />
      ),
      "Used EV Tax Credit": () => (
        <TaxCreditFilter /*setAppliedFilters={setAppliedFilters} */ />
      ),
      Features: () => (
        <FeaturesFilter /* setAppliedFilters={setAppliedFilters}  */ />
      ),
      "Car Size": () => (
        <CarSizeFilter /* setAppliedFilters={setAppliedFilters} */ />
      ),
      Doors: () => <DoorsFilter /* setAppliedFilters={setAppliedFilters}  */ />,
      "Exterior Color": () => (
        <ExteriorColorFilter /* setAppliedFilters={setAppliedFilters} */ />
      ),
      "Interior Color": () => (
        <InteriorColorFilter /* setAppliedFilters={setAppliedFilters}  */ />
      ),
      Drivetrain: () => (
        <DrivetrainFilter /*setAppliedFilters={setAppliedFilters}  */ />
      ),
      Transmission: () => (
        <TransmissionFilter /* setAppliedFilters={setAppliedFilters}  */ />
      ),
      Cylinders: () => (
        <CylindersFilter /* setAppliedFilters={setAppliedFilters} */ />
      ),
      "MPG Highway": () => (
        <MPGFilter /* setAppliedFilters={setAppliedFilters} */ />
      ),
      "Advanced Search": () => (
        <AdvancedSearchFilter /*  setAppliedFilters={setAppliedFilters} */ />
      ),
    };

    // wrap everything, adding "Filter Menu" last
    return {
      "Filter Menu": () => {
        const filterNames = Object.keys(staticComponents);
        return (
          <FilterMenu
            setActiveFilter={setActiveFilter}
            filters={filterNames} /*  */
            sort={appliedFilters.sort}
            currentMakes={appliedFilters.makes}
            // appliedFilters={appliedFilters}
          />
        );
      },
      ...staticComponents,
    };
  }, [appliedFilters, orderedFilters, inventory, location]);

  /// CLOSE PILL
  /*   const closePill = useCallback(
    (key, value) => {
      // console.log("received key & value", key, value);
      // console.log("current appliedFilters", appliedFilters);
      setAppliedFilters((prev) => {
        const newFilters = { ...prev };
        console.log("newFilters", newFilters);

        if (Array.isArray(newFilters[key])) {
          newFilters[key] = newFilters[key].filter((item) => item !== value);
          if (newFilters[key].length === 0) {
            setOrderedFilters((prevOrdered) =>
              prevOrdered.filter((item) => item !== key)
            );
          }
          if (key === "makes" && prev.models.hasOwnProperty(value)) {
            const { [value]: _, ...modelsWithoutValue } = prev.models;
            console.log("modelsWithoutValue", modelsWithoutValue);
            newFilters["models"] = modelsWithoutValue;
            if (Object.keys(modelsWithoutValue).length === 0) {
              setOrderedFilters((prevOrdered) =>
                prevOrdered.filter((item) => item !== "models")
              );
            }
          }
        } else {
          if (key === "models") {
            const make = Object.keys(value)[0]; // e.g. "Pontiac"
            const modelToRemove = value[make][0]; // e.g. "Streamliner 8 Silver Streak Woody Wagon"

            if (newFilters.models?.[make]) {
              // Filter out the model
              const updatedModels = newFilters.models[make].filter(
                (m) => m !== modelToRemove
              );

              if (updatedModels.length > 0) {
                // Replace with updated array
                newFilters.models = {
                  ...newFilters.models,
                  [make]: updatedModels,
                };
              } else {
                // Remove the make entirely if no models left
                const { [make]: _, ...remainingModels } = newFilters.models;
                newFilters.models = remainingModels;
              }

              // If no makes remain, clean up the orderedFilters too
              if (Object.keys(newFilters.models).length === 0) {
                setOrderedFilters((prevOrdered) =>
                  prevOrdered.filter((item) => item !== "models")
                );
              }
            }
          } else {
            newFilters[key] = null;
            setOrderedFilters((prevOrdered) =>
              prevOrdered.filter((item) => item !== key)
            );
          }
        }
        return newFilters;
      });
      if (
        appliedFilters.makes.length === 1 &&
        key === "makes" &&
        activeFilter === "Model"
      ) {
        setActiveFilter(null);
      }
    },
    [setAppliedFilters, setOrderedFilters, appliedFilters.makes, activeFilter]
  ); */

  const closePill = useCallback(
    (key, value) => {
      // ARRAY FILTERS (makes, styles, veh_locations, etc)
      if (Array.isArray(appliedFilters[key])) {
        dispatch(removeFilterValue({ key, value }));

        // Special case: removing a make also clears its models
        if (key === "makes" && appliedFilters.models?.hasOwnProperty(value)) {
          const modelsForMake = appliedFilters.models[value] || [];
          modelsForMake.forEach((model) => {
            dispatch(removeModelFilter({ make: value, model }));
          });
        }
      }

      // MODELS (nested object)
      else if (key === "models") {
        const make = Object.keys(value)[0];
        const model = value[make][0];

        dispatch(removeModelFilter({ make, model }));
      }

      // SCALAR FILTERS (price, year, mileage, etc)
      else {
        dispatch(clearSingleFilter(key));
      }

      // UI-only logic stays local
      if (
        appliedFilters.makes.length === 1 &&
        key === "makes" &&
        activeFilter === "Model"
      ) {
        setActiveFilter(null);
      }
    },
    [dispatch, appliedFilters, activeFilter]
  );

  useEffect(() => {
    if (below820 === false) {
      setShowMobileFilterPanel(false);
      setActiveFilter(null);
    }
  }, [below820]);

  return (
    <>
      <Helmet>
        <title>Inventory | Old Cars Ltd</title>
        <meta name="description" content="Welcome to Inventory" />
      </Helmet>

      <AnimatePresence mode="wait">
        <PageTransition key="cars">
          <div className="page_container cars_container">
            {/* FULL PAGE FILTER PANEL (from .mobileFilterRow btn click) */}
            {showMobileFilterPanel && below820 && (
              <FilterPanel
                activeFiltersList={orderedFilters}
                // setOrderedFilters={setOrderedFilters}
                orderedFilterCount={orderedFilters.length}
                // appliedFilters={appliedFilters}
                // setAppliedFilters={setAppliedFilters}
                closePill={closePill}
                // defaultFilterState={defaultFilterState}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                filterComponentsMap={filterComponentsMap}
                //EXTRA MOBILE ARGS
                mobile={true}
                setShowMobileFilterPanel={setShowMobileFilterPanel}
                // setPreventScroll={setPreventScroll}
                enableScrollLock={enableScrollLock}
                disableScrollLock={disableScrollLock}
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
                    // setOrderedFilters={setOrderedFilters}
                    orderedFilterCount={orderedFilters.length}
                    // appliedFilters={appliedFilters}
                    // setAppliedFilters={setAppliedFilters}
                    closePill={closePill}
                    // defaultFilterState={defaultFilterState}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    filterComponentsMap={filterComponentsMap}
                  />
                )}
                {/***************RIGHT PANEL *************/}
                <div
                  className="right_panel"
                  style={{
                    width: "1600px",
                  }}
                >
                  {below820 && orderedFilters.length > 0 && (
                    <MobileFilterRow
                      appliedFilters={appliedFilters}
                      closePill={closePill}
                      setActiveFilter={setActiveFilter}
                      setShowMobileFilterPanel={setShowMobileFilterPanel}
                      // setPreventScroll={setPreventScroll}
                      enableScrollLock={enableScrollLock}
                      disableScrollLock={disableScrollLock}
                      activeFiltersList={orderedFilters}
                    />
                  )}
                  <ConcatH3 appliedFilters={appliedFilters} />
                  {!hasAppliedFilters && (
                    <Carousels
                      carStyles={true}
                      carsPage={true}
                      // setAppliedFilters={setAppliedFilters}
                      // setOrderedFilters={setOrderedFilters}
                    />
                  )}
                  <CarsToolbar
                    matchesTotal={matchesArray.length}
                    below820={below820}
                    above375={above375}
                    setShowMobileFilterPanel={setShowMobileFilterPanel}
                    // setPreventScroll={setPreventScroll}
                    enableScrollLock={enableScrollLock}
                    orderedFilterCount={orderedFilters.length}
                    setActiveFilter={setActiveFilter}
                    sortCats={sortCats}
                    // appliedFilters={appliedFilters}
                    // setAppliedFilters={setAppliedFilters}
                    setShowCompare={setShowCompare}
                    showCompare={showCompare}
                    // setCompareCars={setCompareCars}
                    // setChosenCars={setChosenCars}
                  />
                  <ComparePanel
                    showCompare={showCompare}
                    // compareCars={compareCars}
                    // chosenCars={chosenCars}
                  />
                  <InventoryGrid
                    cars={matchesArray}
                    below820={below820}
                    // appliedFilters={appliedFilters}
                    showCompare={showCompare}
                    setShowCompare={setShowCompare}
                    // addToCompareCars={addToCompareCars}
                    // removeFromCompareCars={removeFromCompareCars}

                    // setCompareCars={setCompareCars}

                    // setPreventScroll={setPreventScroll}
                    // enableScrollLock={enableScrollLock}
                    // disableScrollLock={disableScrollLock}
                    // send 'showCompare' here to change InvCards' <MoreButton/> to 'select' btn when true
                  />
                </div>
              </div>
            </Box>
          </div>
        </PageTransition>
      </AnimatePresence>
    </>
  );
};

export default Cars;
