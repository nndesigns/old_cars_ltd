import React, { useState, useEffect, useMemo } from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import MenuLines from "../icons/Menu_lines.svg";
import RangeSelect from "./rangeSelect";
import Button from "./buttons/button";

const PriceSlider = ({
  inventory,
  appliedFilters,
  setAppliedFilters,
  setOrderedFilters,
  leftPanel, // false = /home only
}) => {
  const [range, setRange] = useState([]);
  const [prevRange, setPrevRange] = useState([]);
  const [grabbing, setGrabbing] = useState(false);

  const StyledBar = styled("div")(
    ({ barKey, height, activeRange, leftPanel }) => ({
      flex: "1",
      height: leftPanel ? `${height * 4}px` : `${height * 10.5}px`,
      backgroundColor: "var(--btnBG)",
      opacity:
        barKey >= activeRange[0] && barKey <= activeRange[1] ? "1" : ".3",
      "&:hover": { opacity: ".3" },
    })
  );

  //  COMPUTED RANGE : Compute bucketed price counts and min/max price
  const computedRange = useMemo(() => {
    if (!inventory || inventory.length === 0) return null;

    const countsByBucket = inventory.reduce((acc, car) => {
      const bucket = Math.floor(car.price / 1000);
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});

    const sortedBuckets = Object.keys(countsByBucket)
      .map(Number)
      .sort((a, b) => a - b);
    const completeBuckets = {};
    for (
      let i = sortedBuckets[0];
      i <= sortedBuckets[sortedBuckets.length - 1];
      i++
    ) {
      completeBuckets[i] = countsByBucket[i] || 0;
    }

    const adjustedCounts = Object.entries(completeBuckets).map(([k, v]) => ({
      name: Number(k) * 1000,
      value: v,
    }));

    return {
      counts: adjustedCounts, //{[name: value}] how many car objs (value) for each 'thousandths place' (3 - 72) (name)
      min: adjustedCounts[0].name,
      max: adjustedCounts[adjustedCounts.length - 1].name,
    };
  }, [inventory]);

  // Initialize range on load or when data changes
  useEffect(() => {
    if (!computedRange) return;

    setRange([
      appliedFilters.minPrice ?? computedRange.min,
      appliedFilters.maxPrice ?? computedRange.max,
    ]);
  }, [computedRange, appliedFilters.minPrice, appliedFilters.maxPrice]);

  // CLAMP VALUE
  const clampValue = (value, min, max) => Math.max(min, Math.min(value, max));

  // console.log("clampValue", clampValue);

  //////////  UPDATE FILTERS   //////
  const updateFilters = (newRange, changedKey, clear) => {
    if (clear) {
      // clear both filters
      setAppliedFilters((prev) => ({
        ...prev,
        minPrice: null,
        maxPrice: null,
      }));
      setOrderedFilters((prev) =>
        prev.filter((key) => key !== "minPrice" && key !== "maxPrice")
      );
      return; // 👈 stop here
    }

    // otherwise, normal update
    setAppliedFilters((prev) => ({
      ...prev,
      ...(changedKey === "minPrice" ? { minPrice: newRange[0] } : {}),
      ...(changedKey === "maxPrice" ? { maxPrice: newRange[1] } : {}),
    }));

    setOrderedFilters((prev) =>
      prev.includes(changedKey) ? prev : [...prev, changedKey]
    );
  };

  // HANDLE UPDATE RANGE

  /// RANGE SELECT HANDLER
  const handleUpdateRange1 = (newValue, activeSelect) => {
    console.log("received activeSelect", activeSelect);
    const minPrice = computedRange.min;
    const maxPrice = computedRange.max;

    setRange((prev) => {
      const updated =
        activeSelect === "minSelect"
          ? [clampValue(newValue, minPrice, maxPrice), prev[1]]
          : [prev[0], clampValue(newValue, minPrice, maxPrice)];
      updateFilters(
        updated,
        activeSelect === "minSelect" ? "minPrice" : "maxPrice"
      );
      return updated;
    });
  };

  //// SLIDER HANDLER (onChangeCommitted)
  const handleUpdateRange2 = (event, newValue) => {
    const minPrice = computedRange.min;
    const maxPrice = computedRange.max;

    const isFullRange =
      newValue.length === 2 &&
      newValue[0] === minPrice &&
      newValue[1] === maxPrice;

    let changedThumb = null;
    if (newValue[0] !== prevRange[0]) {
      changedThumb = "minPrice";
    } else if (newValue[1] !== prevRange[1]) {
      changedThumb = "maxPrice";
    }

    // Fallback — if neither changed (edge case)
    if (!changedThumb) {
      return; // or default to whatever makes sense for your logic
    }

    updateFilters(
      newValue,
      //  activeThumb === 0 ? "minPrice" : "maxPrice",
      changedThumb,
      isFullRange
    );
  };

  const handleClear = () => {
    setAppliedFilters((prev) => ({
      ...prev,
      minPrice: null,
      maxPrice: null,
    }));
    setOrderedFilters((prev) =>
      prev.filter((key) => key !== "minPrice" && key !== "maxPrice")
    );
    if (computedRange) setRange([computedRange.min, computedRange.max]);
    setPrevRange([]);
  };

  if (!computedRange) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
      }}
    >
      {leftPanel && (
        <RangeSelect
          range={range}
          setRange={setRange}
          adjCounts={computedRange.counts}
          leftPanel
          handleUpdateRange={handleUpdateRange1}
        />
      )}

      <div
        style={{
          // overflow: "hidden",
          marginTop: leftPanel ? "1rem" : "",
          display: "flex",
          alignItems: "flex-end",
          minHeight: leftPanel ? null : "250px",
          height: leftPanel ? "250px" : null,
          transform: leftPanel ? "scale(.95)" : null,
          gap: ".25%",
        }}
      >
        {/* MAPPED BARS */}
        {computedRange.counts.map((c) => (
          <StyledBar
            key={c.name}
            barKey={c.name}
            height={c.value}
            activeRange={range}
            leftPanel={leftPanel}
          />
        ))}
      </div>
      {/* MUI SLIDER */}
      <Slider
        value={range}
        min={computedRange.min}
        max={computedRange.max}
        step={1000}
        onChange={(event, newValue) => {
          // This runs *while dragging*, purely to show movement
          setPrevRange(range);
          setRange(newValue);
        }}
        onChangeCommitted={handleUpdateRange2}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `$${v / 1000}k`}
        sx={{
          height: "2px",
          width: "98%",
          alignSelf: "center",
          // transform: "translateY(-12px)",
          transform: `${
            leftPanel ? "translateY(-20px) " : "translateY(-13px) "
          }${leftPanel ? "scale(0.95)" : ""}`,
          color: "var(--disabledBtn)",

          "& .MuiSlider-thumb": {
            backgroundImage: `url(${MenuLines})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "10px",
            height: "10px",
            width: "10px",
            margin: "none",
            backgroundColor: "white",
            border: "1px solid var(--disabledBtn)",
            padding: "15px",
            cursor: grabbing ? "grabbing" : "grab",
            outline: "0px",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: "100%", // ✅ match parent width
              height: "100%", // ✅ match parent height
              // top: 0,
              // left: 0,
              pointerEvents: "none", // keeps them non-interactive
              boxSizing: "border-box",
            },
          },
          "& .MuiSlider-valueLabel": {
            backgroundColor: "teal",
            padding: "0 6px",
            color: "white",
            fontSize: "1.2em",
            opacity: grabbing ? "1" : ".85",
            transform: grabbing ? "translateY(-110%) scale(1.1)" : "",
          },
        }}
        onMouseLeave={() => grabbing && setGrabbing(false)}
        onMouseDown={() => setGrabbing(true)}
        onMouseUp={() => setGrabbing(false)}
        onTouchStart={() => setGrabbing(true)}
        onTouchEnd={() => setGrabbing(false)}
      />

      {/* /home only (leftPanel = false*/}
      {!leftPanel && (
        <RangeSelect
          range={range}
          setRange={setRange}
          adjCounts={computedRange.counts}
          leftPanel={false}
          handleUpdateRange={handleUpdateRange1}
          home={true}
        />
      )}

      {leftPanel && (
        <Button
          disabled={!appliedFilters.minPrice && !appliedFilters.maxPrice}
          text="RESET PRICE RANGE"
          onClick={handleClear}
          style={{
            width: "250px",

            padding: ".5rem",
            marginInline: "auto",
          }}
        />
      )}
    </div>
  );
};

export default PriceSlider;
