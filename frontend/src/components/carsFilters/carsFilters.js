import React, { useState, useEffect, useRef, useMemo } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import "./filterMenu.css";
import "./filters.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { handleScroll } from "../utils.js";

// import useFilterHistory from "./useFilterHistory";
//EMBEDDED COMPONENTS
import PriceSlider from "../price_slider";
import RangeSelect from "../rangeSelect";
import CustomSelect from "../customSelect";

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

function DistanceShippingFilter({ setAppliedFilters }) {
  return (
    <div className="filter_root">
      <h3>Distance Shipping Filter</h3>
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
  const handleCheckboxChange = (make) => {
    setAppliedFilters((prevState) => {
      const newMakes = prevState.makes.includes(make)
        ? prevState.makes.filter((m) => m !== make)
        : [...prevState.makes, make];

      if (newMakes.length === 0) {
        setOrderedFilters((prevOrdered) =>
          prevOrdered.filter((filter) => filter !== "makes")
        );
      } else if (!orderedFilters.includes("makes")) {
        setOrderedFilters([...orderedFilters, "makes"]);
      }

      return { ...prevState, makes: newMakes };
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
function YearFilter({ options, setAppliedFilters, setOrderedFilters }) {
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

  return (
    <div className="filter_root">
      <RangeSelect
        range={range}
        setRange={setRange}
        yearOptions={yearOptions}
        // adjCounts={computedRange.counts}
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
  DistanceShippingFilter,
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
