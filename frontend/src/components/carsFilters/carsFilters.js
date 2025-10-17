import React, { useState, useEffect, useRef, useMemo } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import "./filterMenu.css";
import "./filters.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { handleScroll, useClickOutside } from "../utils.js";
import CustomSelect from "../customSelect";
import { createPortal } from "react-dom";
import LocationChangeModal from "../locationChangeModal.js";

import { handleLocationSearch } from "../searchbar/searchHandlers.js";
import { stateToStateMap } from "../utils.js";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../buttons/button.js";
import Searchbar from "../searchbar/searchbar.js";
import { LoadingSpinner } from "../inventoryGrid/loadingSpinner.js";

// import useFilterHistory from "./useFilterHistory";
//EMBEDDED COMPONENTS
import PriceSlider from "../price_slider";
import RangeSelect from "../rangeSelect";

function FilterMenu({ setActiveFilter, filters, appliedFilters }) {
  // Create a filtered list before rendering
  const visibleFilters = filters.filter((filter) => {
    if (filter === "Model") {
      return appliedFilters.makes && appliedFilters.makes.length > 0;
    }
    return true; // keep all other filters
  });

  return (
    <div className="filterMenuStyle">
      {visibleFilters.map((filter) => (
        <button
          className="filterBtnStyle"
          key={filter}
          onClick={() => setActiveFilter(filter)}
        >
          <span>
            {filter}{" "}
            {filter === "Sort by" && <span>{appliedFilters.sort}</span>}
          </span>
          <RiArrowRightSLine />
        </button>
      ))}
    </div>
  );
}

function SortByFilter({ sortCats, chosenSortCategory, setAppliedFilters }) {
  return (
    <div className="filter_root">
      <form>
        {sortCats.map((cat) => (
          <label key={cat} className="radioLabelStyle">
            <input
              type="radio"
              name="sortCategory"
              value={cat}
              checked={chosenSortCategory === cat}
              onChange={() =>
                setAppliedFilters((prevState) => ({
                  ...prevState,
                  sort: cat,
                }))
              }
              className="radioInputHidden"
            />
            <span className="customRadio"></span>
            {cat}
          </label>
        ))}
      </form>
    </div>
  );
}

function DistanceLocationFilter({
  inv,
  location,
  currentVehLocations, //appliedFilters.veh_locations
  appliedFilters,
  setAppliedFilters,
  orderedFilters,
  setOrderedFilters,
}) {
  // console.log("received appliedFilters", appliedFilters);
  // console.log("received orderedFilters", orderedFilters);
  /// DISTANCE (.dist_radius)
  const custStyle = {
    fontSize: "1rem",
    paddingInline: ".75rem 2.25rem",
    height: "45px",
  };
  const dist_amts = [
    "Nationwide",
    "25 miles",
    "50 miles",
    "75 miles",
    "100 miles",
    "250 miles",
    "500 miles",
  ];
  //APPLIED FILTERS .DIST_RADIUS STATE
  const [selectedDistance, setSelectedDistance] = useState(
    appliedFilters.dist_radius ? appliedFilters.dist_radius : dist_amts[0]
  );
  //SHOP NEARBY STATE
  const [nearbyList, setNearbyList] = useState([]);
  //SHOP BY STATE  REF /STATE
  const shopByRef = useRef(null);
  const [shopByValue, setShopByValue] = useState("");
  const [shopByObjs, setShopByObjs] = useState([]);

  //LOC CHANGE MODAL REF / STATE
  const [locationInputValue, setLocationInputValue] = useState("");
  const [showLocationChangeModal, setShowLocationChangeModal] = useState(false);
  const [locObjs, setLocObjs] = useState([]);
  const locationChangeRef = useRef(null); //Modal ref
  const locationChangeInputRef = useRef(null); //Modal input Ref

  const changeBtnRef = useRef(null);

  console.log("showLocationChangeModal", showLocationChangeModal);

  //SET SHOP BY OBJS STATE
  useEffect(() => {
    const matchAbbrev = Object.entries(stateToStateMap).find(
      ([abbrev, fullName]) =>
        fullName.toLowerCase().includes(shopByValue.toLowerCase())
    )?.[0];

    const filteredInv = inv
      .filter((obj) => {
        const stateMatches = matchAbbrev ? obj.state === matchAbbrev : false;
        const cityMatches = obj.city
          .toLowerCase()
          .includes(shopByValue.toLowerCase());
        return stateMatches || cityMatches;
      })
      .sort((a, b) => a.state.localeCompare(b.state));

    const filteredLocs = [
      ...new Map(
        filteredInv.map((obj) => [
          `${obj.city}-${obj.state}`, // unique key
          { city: obj.city, state: obj.state },
        ])
      ).values(),
    ];

    setShopByObjs(filteredLocs);
  }, [shopByValue]);

  // LOC CHANGE MODAL
  useClickOutside(locationChangeRef, showLocationChangeModal, (e) => {
    if (
      !changeBtnRef.current.contains(e.target) &&
      !locationChangeRef.current.contains(e.target)
    ) {
      setShowLocationChangeModal(false);
      locationChangeInputRef.current = "";
    }
  });
  // SET SELECTED DISTANCE & NEARBY LIST STATE
  useEffect(() => {
    if (!appliedFilters.dist_radius) {
      // if changed TO 'nationwide' (so 'null' now)
      setSelectedDistance(dist_amts[0]); //'Nationwide' default
    }
    //GENERATE 'NEARBY LIST' OBJ ARRAY FROM REDUX 'LOCATION' ZIP
    const fetchPlaces = async () => {
      const returnedPlaces = await handleLocationSearch(location.zip, true);
      const placesWithOffers = returnedPlaces.filter((obj) => obj.offerCt > 0);

      // Haversine formula
      const toRad = (deg) => (deg * Math.PI) / 180;

      const getDistanceMiles = (lat1, lon1, lat2, lon2) => {
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
        return R * c;
      };

      // Add distance field to each place
      const placesWithDistance = placesWithOffers.map((obj) => ({
        ...obj,
        distance: getDistanceMiles(
          parseFloat(location.latitude),
          parseFloat(location.longitude),
          parseFloat(obj.latitude),
          parseFloat(obj.longitude)
        ),
      }));

      // Sort by distance ascending
      const sortedPlaces = placesWithDistance.sort(
        (a, b) => a.distance - b.distance
      );

      setNearbyList(sortedPlaces); // save if you want to use later in UI
    };

    fetchPlaces();
  }, [appliedFilters.dist_radius, location]);

  // SET APPLIED FILTERS .DIST_RADIUS STATE (drop down handler)
  const handleDistChange = (value) => {
    if (value === "Nationwide") {
      setAppliedFilters((prev) => ({
        ...prev,
        dist_radius: null,
      }));
      console.log("this was triggered here");
      setOrderedFilters((prev) => prev.filter((f) => f !== "dist_radius"));
    } else {
      const valNum = Number(value.slice(0, -6));
      setAppliedFilters((prev) => ({
        ...prev,
        dist_radius: valNum,
      }));
      setOrderedFilters(
        (prev) =>
          prev.includes("dist_radius") ? prev : [...prev, "dist_radius"] // add it if not present
      );
    }
  };
  /// LOCATION  CHECKBOXES (.veh_locations state)
  const handleVehLocChange = (city) => {
    setAppliedFilters((prev) => {
      let newVehLocations = [...prev.veh_locations];

      //if prev AF.veh_locations already includes rec'd 'loc'
      if (prev.veh_locations.includes(city)) {
        //then clicking meant 'remove', filter it out, reassign filtered out
        newVehLocations = prev.veh_locations.filter((m) => m !== city);
      } else {
        //otherwise if it didn't, add it in, reassign added in
        newVehLocations = [...prev.veh_locations, city];
      }
      //if taken out & now it's empty, remove 'makes' orderedFilter
      if (newVehLocations.length === 0) {
        setOrderedFilters((prevOrdered) =>
          prevOrdered.filter((filter) => filter !== "veh_locations")
        );
        //otherwise if it's not empty & orderedFilters doesn't yet include 'makes', incude it
      } else if (!orderedFilters.includes("veh_locations")) {
        setOrderedFilters([...orderedFilters, "veh_locations"]);
      }

      return {
        ...prev,
        veh_locations: newVehLocations,
      };
    });
  };

  //
  const [showAllNearby, setShowAllNearby] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const visibleNearby = showAllNearby ? nearbyList : nearbyList.slice(0, 5);

  return (
    <div className="filter_root distance_root">
      {showLocationChangeModal &&
        createPortal(
          <AnimatePresence>
            <motion.div
              className="modal_overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <motion.div
                className="modal_wrapper"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <LocationChangeModal
                  distMode={true}
                  ref={locationChangeRef}
                  location={location}
                  locationInputValue={locationInputValue}
                  setLocationInputValue={setLocationInputValue}
                  locationChangeInputRef={locationChangeInputRef}
                  setShowLocationChangeModal={setShowLocationChangeModal}
                  inv={inv}
                  locObjs={locObjs}
                  setLocObjs={setLocObjs}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      {/***  CURR LOC BOX ****/}
      <div className="currLocBox">
        <div className="currLocLeft">
          <span>Your Location: {location.zip}</span>
          <br />
          <strong>
            <span style={{ whiteSpace: "nowrap" }}>
              {location.city}, {location.state}
            </span>
          </strong>
        </div>
        <button
          ref={changeBtnRef}
          className="changeBtn"
          onClick={() => setShowLocationChangeModal(true)} // 👈 open modal
        >
          Change
        </button>
      </div>

      <CustomSelect
        prop={selectedDistance}
        setProp={setSelectedDistance}
        array={dist_amts}
        label="Max Miles Away"
        selectStyle={custStyle}
        onChange={handleDistChange}
      />
      <small className="dist_helper_text">
        The maximum number of miles you're willing to travel to pick up a car.
      </small>
      <hr />

      <h3 className="checkbox_h3" style={{ marginBottom: "1.5rem" }}>
        Shop Nearby
      </h3>
      <div
        className={`checkboxes_container shopNearbyCheckboxes ${
          nearbyList.length === 0 ? "flexCenter" : ""
        }`}
      >
        {nearbyList.length ? (
          nearbyList.slice(0, 5).map((obj) => (
            <label
              key={obj.zip}
              className="custom_checkbox_label distance_label"
            >
              <input
                type="checkbox"
                className="custom_checkbox_input"
                onChange={() => handleVehLocChange(obj.city)} //appear in SHOP BY LIST Checkboxes inputs too
                checked={
                  Array.isArray(currentVehLocations) && //appear in SHOP BY LIST Checkboxes inputs too
                  currentVehLocations.includes(obj.city)
                }
              />
              <span className="custom_checkbox_visual" />
              <span className="checkbox_text places_text">
                {`${obj.city} (~${obj.distance.toFixed(1)}mi)`}
                <br />
                <p className="checkbox_subtext">{`${obj.city}, ${
                  stateToStateMap[obj.state]
                }`}</p>
              </span>
            </label>
          ))
        ) : (
          <LoadingSpinner />
        )}

        <AnimatePresence>
          {showAllNearby && (
            <motion.div
              key="extra"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {nearbyList.slice(5).map((obj) => (
                <label
                  key={obj.zip}
                  className="custom_checkbox_label distance_label"
                >
                  <input
                    type="checkbox"
                    className="custom_checkbox_input"
                    onChange={() => handleVehLocChange(obj.city)}
                    checked={
                      Array.isArray(currentVehLocations) &&
                      currentVehLocations.includes(obj.city)
                    }
                  />
                  <span className="custom_checkbox_visual" />
                  <span className="checkbox_text places_text">
                    {`${obj.city} (~${obj.distance.toFixed(1)}mi)`}
                    <br />
                    <p className="checkbox_subtext">{`${obj.city}, ${
                      stateToStateMap[obj.state]
                    }`}</p>
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {nearbyList.length > 5 && (
          <Button
            text={
              showAllNearby ? "See less" : `See ${nearbyList.length - 5} more`
            }
            outlineStyle2={true}
            onClick={() => setShowAllNearby((prev) => !prev)}
            style={{
              fontSize: ".9em",
              padding: ".75rem 1.25rem",
              height: "unset",
              display: "block",
              margin: "0 auto",
              transform: "translateX(-.5rem)",
            }}
          />
        )}
      </div>
      <div className="shopByStateWrapper">
        <button
          className="shopByStateBtn"
          onClick={() => setShowSearch((prev) => !prev)}
        >
          SHOP BY STATE {!showSearch ? <GoChevronDown /> : <GoChevronUp />}
        </button>
        <AnimatePresence>
          {showSearch && (
            <motion.div
              key="searchExtra"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <Searchbar
                darkRoute={true}
                mode="distLocFilter"
                shopByValue={shopByValue}
                setShopByValue={setShopByValue}
                inputRef={shopByRef}
                style={{ marginBottom: "1rem" }}
              />
              <div
                className="checkboxes_container"
                style={{ paddingLeft: ".5rem" }}
              >
                {shopByObjs.map((obj, idx) => {
                  const prevState = idx > 0 ? shopByObjs[idx - 1].state : null;
                  const showHeader = obj.state !== prevState; // true if new state group
                  return (
                    <React.Fragment key={idx}>
                      {showHeader && (
                        <h3 className="shopBy_h3">
                          {stateToStateMap[obj.state]}
                        </h3>
                      )}
                      <label className="custom_checkbox_label distance_label">
                        <input
                          type="checkbox"
                          className="custom_checkbox_input"
                          onChange={() => handleVehLocChange(obj.city)}
                          checked={
                            Array.isArray(currentVehLocations) &&
                            currentVehLocations.includes(obj.city)
                          }
                        />
                        <span className="custom_checkbox_visual" />
                        <span className="checkbox_text places_text">
                          {`${obj.city}`}
                          <br />
                          <p className="checkbox_subtext">{`${obj.city}, ${
                            stateToStateMap[obj.state]
                          }`}</p>
                        </span>
                      </label>
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PriceFilter({
  options,
  setAppliedFilters,
  appliedFilters,
  leftPanel,
  setOrderedFilters,
}) {
  return (
    <div className="filter_root">
      <PriceSlider
        inventory={options}
        setAppliedFilters={setAppliedFilters}
        appliedFilters={appliedFilters}
        leftPanel={leftPanel}
        setOrderedFilters={setOrderedFilters}
      />
    </div>
  );
}

function MakeFilter({
  currentMakes,
  setAppliedFilters,
  options,
  orderedFilters,
  setOrderedFilters,
}) {
  //click handler took 292ms
  const handleCheckboxChange = (make) => {
    setAppliedFilters((prev) => {
      let newMakes = [...prev.makes];
      let newModels = { ...prev.Models };
      let newStyles = [...prev.styles];
      //if prev AF.makes already includes rec'd 'make'
      if (prev.makes.includes(make)) {
        //then clicking meant 'remove', filter it out, reassign filtered out
        newMakes = prev.makes.filter((m) => m !== make);
        //if the removed make is a 'key' in prev.models obj
        if (prev.models.hasOwnProperty(make)) {
          const { [make]: _, ...modelsWithoutMake } = prev.models;
          //reassign prev.models obj excluding that 'make' key entry
          newModels = modelsWithoutMake;
          //if removal made prev.models obj empty, remove 'models' from orderedFilters
          if (Object.keys(modelsWithoutMake).length === 0) {
            setOrderedFilters((prevOrdered) =>
              prevOrdered.filter((item) => item !== "models")
            );
          }
        }
      } else {
        //otherwise if it didn't, add it in, reassign added in
        newMakes = [...prev.makes, make];
      }

      //if taken out & now it's empty, remove 'makes' orderedFilter
      if (newMakes.length === 0) {
        setOrderedFilters((prevOrdered) =>
          prevOrdered.filter((filter) => filter !== "makes")
        );
        //otherwise if it's not empty & orderedFilters doesn't yet include 'makes', incude it
      } else if (!orderedFilters.includes("makes")) {
        setOrderedFilters([...orderedFilters, "makes"]);
      }

      return { ...prev, makes: newMakes, models: newModels, styles: newStyles };
    });
  };

  return (
    <div className="filter_root">
      <div className="checkboxes_container">
        {Object.entries(options)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([make, count]) => (
            <label key={make} className="custom_checkbox_label">
              <input
                className="custom_checkbox_input"
                type="checkbox"
                checked={
                  Array.isArray(currentMakes) && currentMakes.includes(make)
                }
                onChange={() => handleCheckboxChange(make)}
              />
              <span className="custom_checkbox_visual" />
              <span className="checkbox_text">{`${make} (${count})`}</span>
            </label>
          ))}
      </div>
    </div>
  );
}

function ModelFilter({
  currentMakes,
  currentModels,
  setAppliedFilters,
  options,
  setOrderedFilters,
}) {
  // OVERFLOW SCROLL
  const wrapperRef = useRef(null);
  const tabHeadersRef = useRef(null);
  const [atScrollStart, setAtScrollStart] = useState(true);
  const [atScrollEnd, setAtScrollEnd] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const checkScrollPosition = () => {
    const el = tabHeadersRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;

    setAtScrollStart(scrollLeft === 0);
    setAtScrollEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const row = tabHeadersRef.current;

    if (!wrapper || !row) return;

    const wrapperWidth = wrapper.clientWidth;
    const rowScrollWidth = row.scrollWidth;

    setIsScrollable(rowScrollWidth > wrapperWidth);

    // Check scroll positions on mount/layout
    checkScrollPosition();

    // Optional: listen for resize to adjust button visibility dynamically
    const resizeObserver = new ResizeObserver(() => {
      const newWrapperWidth = wrapper.clientWidth;
      const newRowScrollWidth = row.scrollWidth;
      setIsScrollable(newRowScrollWidth > newWrapperWidth);
      checkScrollPosition();
    });

    resizeObserver.observe(wrapper);
    resizeObserver.observe(row);

    return () => resizeObserver.disconnect();
  }, [tabHeadersRef, wrapperRef]);

  const [activeTab, setActiveTab] = useState(currentMakes[0]);

  useEffect(() => setActiveTab(currentMakes[0]), [currentMakes]);

  const handleCheckboxChange = (model) => {
    // Step 1: Find the make (key) for the given model by scanning the 'options' object
    const make = Object.keys(options).find((makeKey) =>
      options[makeKey]?.some((entry) => entry.model === model)
    );

    if (!make) return; // fail-safe, model not found

    // Step 2: Update appliedFilters.models as a nested object
    setAppliedFilters((prev) => {
      const prevModels = prev.models || {};
      const makeModels = prevModels[make] || [];

      let newModelsForMake;
      if (makeModels.includes(model)) {
        newModelsForMake = makeModels.filter((m) => m !== model);
      } else {
        newModelsForMake = [...makeModels, model];
      }

      const updatedModels = {
        ...prevModels,
        [make]: newModelsForMake,
      };

      if (updatedModels[make].length === 0) {
        delete updatedModels[make];
      }

      // Decide if any models exist across all makes
      const anyModelsSelected = Object.values(updatedModels).some(
        (arr) => arr.length > 0
      );

      // Update orderedFilters accordingly
      setOrderedFilters((prevOrdered) => {
        if (anyModelsSelected) {
          return prevOrdered.includes("models")
            ? prevOrdered
            : [...prevOrdered, "models"];
        } else {
          return prevOrdered.filter((f) => f !== "models");
        }
      });

      return {
        ...prev,
        models: updatedModels,
      };
    });
  };

  return (
    <div className="filter_root" ref={wrapperRef}>
      <div
        className="tab_headers"
        ref={tabHeadersRef}
        onScroll={checkScrollPosition}
      >
        {!atScrollStart && isScrollable && (
          <button
            className="scrollLeftBtn"
            onClick={() => handleScroll(tabHeadersRef, -1, true)}
          >
            <IoIosArrowBack />
          </button>
        )}
        {currentMakes.map((make) => (
          <button
            key={make}
            onClick={() => setActiveTab(make)}
            className={`tab_button ${activeTab === make ? "active" : ""}`}
          >
            {make}
          </button>
        ))}
        {!atScrollEnd && isScrollable && (
          <button
            className="scrollRightBtn"
            onClick={() => handleScroll(tabHeadersRef, 1, true)}
          >
            <IoIosArrowForward />
          </button>
        )}
      </div>
      <h4 className="makes_h4">{activeTab} Models</h4>
      <div className="checkboxes_container">
        {options[activeTab]
          ?.sort((a, b) => a.model.localeCompare(b.model))
          .map(({ model, count }) => (
            <label key={model} className="custom_checkbox_label">
              <input
                className="custom_checkbox_input"
                type="checkbox"
                checked={
                  Array.isArray(currentModels) && currentModels.includes(model)
                }
                onChange={() => handleCheckboxChange(model)}
              />
              <span className="custom_checkbox_visual" />
              <span className="checkbox_text">
                {model} ({count})
              </span>
            </label>
          ))}
      </div>
    </div>
  );
}

//// BODY  TYPE FILTER
function BodyTypeFilter({
  currentBodyTypes,
  setAppliedFilters,
  options,
  orderedFilters,
  setOrderedFilters,
}) {
  const handleCheckboxChange = (style) => {
    setAppliedFilters((prevState) => {
      const newStyles = prevState.styles.includes(style)
        ? prevState.styles.filter((m) => m !== style)
        : [...prevState.styles, style];

      if (newStyles.length === 0) {
        setOrderedFilters((prevOrdered) =>
          prevOrdered.filter((filter) => filter !== "styles")
        );
      } else if (!orderedFilters.includes("styles")) {
        setOrderedFilters([...orderedFilters, "styles"]);
      }

      return { ...prevState, styles: newStyles };
    });
  };
  return (
    <div className="filter_root">
      <div className="checkboxes_container">
        {Object.entries(options)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([style, count]) => (
            <label key={style} className="custom_checkbox_label">
              <input
                className="custom_checkbox_input"
                type="checkbox"
                checked={
                  Array.isArray(currentBodyTypes) &&
                  currentBodyTypes.includes(style)
                }
                onChange={() => handleCheckboxChange(style)}
              />
              <span className="custom_checkbox_visual" />
              <span className="checkbox_text">{`${style} (${count})`}</span>
            </label>
          ))}
      </div>
    </div>
  );
}

/// YEAR FILTER /////
function YearFilter({
  options,
  setAppliedFilters,
  setOrderedFilters,
  appliedFilters,
}) {
  const years = options.map((option) => option.year);
  const [range, setRange] = useState([Math.min(...years), Math.max(...years)]);

  const computedRange = useMemo(() => {
    if (!options || options.length === 0) return null;

    const years = options.map((car) => car.year);
    const min = Math.min(...years);
    const max = Math.max(...years);
    return { min, max };
  }, [options]);

  const yearOptions = useMemo(() => {
    if (!computedRange) return [];
    const years = [];
    for (let y = computedRange.min; y <= computedRange.max; y++) {
      years.push(y);
    }
    return years;
  }, [computedRange]);

  const clampValue = (value, min, max) => Math.max(min, Math.min(value, max));

  const updateFilters = (newRange, changedKey) => {
    setAppliedFilters((prev) => ({
      ...prev,
      ...(changedKey === "yearFrom" ? { yearFrom: newRange[0] } : {}),
      ...(changedKey === "yearTo" ? { yearTo: newRange[1] } : {}),
    }));
    setOrderedFilters((prev) =>
      prev.includes(changedKey) ? prev : [...prev, changedKey]
    );
  };

  const handleUpdateRange = (event, newValue, placeholder, activeSelect) => {
    if (!computedRange) return;

    const minYear = computedRange.min;
    const maxYear = computedRange.max;
    if (activeSelect) {
      setRange((prev) => {
        const updated =
          activeSelect === "minSelect"
            ? [clampValue(newValue, minYear, maxYear), prev[1]]
            : [prev[0], clampValue(newValue, minYear, maxYear)];
        updateFilters(
          updated,
          activeSelect === "minSelect" ? "yearFrom" : "yearTo"
        );
        return updated;
      });
    }
  };

  // 🔑 Sync external appliedFilters → local range
  useEffect(() => {
    if (!computedRange) return;

    const minYear = appliedFilters.yearFrom ?? computedRange.min;
    const maxYear = appliedFilters.yearTo ?? computedRange.max;

    setRange([minYear, maxYear]);
  }, [appliedFilters.yearFrom, appliedFilters.yearTo, computedRange]);

  return (
    <div className="filter_root">
      <RangeSelect
        range={range}
        setRange={setRange}
        yearOptions={yearOptions}
        adjCounts={computedRange.counts}
        leftPanel={true}
        yearFilter={true}
        handleUpdateRange={handleUpdateRange}
      />
    </div>
  );
}

function MileageFilter({
  options,
  setAppliedFilters,
  appliedFilters,
  // leftPanel,
  setOrderedFilters,
}) {
  const mileageValues = options
    .map((vehicle) => vehicle.mileage)
    .filter((m) => typeof m === "number");

  let mileageOptions = ["Any"]; // Add 'Any' as the default option

  if (mileageValues.length) {
    const minMileage = Math.min(...mileageValues);
    const maxMileage = Math.max(...mileageValues);

    // Round down min to nearest 10,000, round up max to nearest 10,000
    const start = Math.floor(minMileage / 10000) * 10000;
    const end = Math.ceil(maxMileage / 10000) * 10000;

    for (let value = start + 10000; value <= end + 10000; value += 10000) {
      mileageOptions.push(`${value.toLocaleString()} or less`);
    }
  }

  const [selectedMileage, setSelectedMileage] = useState(
    appliedFilters.mileage
      ? `${appliedFilters.mileage.toLocaleString()} or less`
      : ""
  );

  const handleUpdateMiles = (value) => {
    if (value === "Any") {
      // Remove mileage filter if 'Any' is selected
      setAppliedFilters((prev) => {
        const { mileage, ...rest } = prev;
        return rest;
      });
    } else {
      // Parse "50,000 and less" into 50000
      const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
      setAppliedFilters((prev) => ({
        ...prev,
        mileage: numericValue,
      }));
      setOrderedFilters((prev) =>
        prev.includes("mileage") ? prev : [...prev, "mileage"]
      );
    }
  };

  return (
    <div className="filter_root">
      <CustomSelect
        prop={selectedMileage}
        setProp={setSelectedMileage}
        array={mileageOptions}
        label="From"
        onChange={handleUpdateMiles}
      />
    </div>
  );
}

function FuelTypeFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Fuel Type Filter</h3>
    </div>
  );
}

function TaxCreditFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Tax Credit Filter</h3>
    </div>
  );
}

function FeaturesFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Features Filter</h3>
    </div>
  );
}

function CarSizeFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Car Size Filter</h3>
    </div>
  );
}

function DoorsFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Doors Filter</h3>
    </div>
  );
}

function ExteriorColorFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Exterior Color Filter</h3>
    </div>
  );
}

function InteriorColorFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Interior Color Filter</h3>
    </div>
  );
}

function DrivetrainFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>DriveTrain Filter</h3>
    </div>
  );
}

function TransmissionFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Transmission Filter</h3>
    </div>
  );
}

function CylindersFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Cylinders Filter</h3>
    </div>
  );
}

function MPGFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>MPG Filter</h3>
    </div>
  );
}

function AdvancedSearchFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Advanced Search Filter</h3>
    </div>
  );
}

export {
  FilterMenu,
  SortByFilter,
  DistanceLocationFilter,
  MakeFilter,
  ModelFilter,
  BodyTypeFilter,
  YearFilter,
  PriceFilter,
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
};
