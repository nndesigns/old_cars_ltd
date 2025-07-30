import React from "react";

const ClearAllBtn = ({ currFilter, setAppliedFilters, setOrderedFilters }) => {
  const btnStyle = {
    backgroundColor: "transparent",
    border: "none",
    fontWeight: 500,
    fontSize: " .75em",
    color: "var(--invCardTitle)",
    cursor: "pointer",
  };

  const handleFilterRemove = (filter) => {
    setAppliedFilters((prevState) => {
      const newFilters = { ...prevState }; // copy the previous state

      //set back to empty array i fthat was its default state
      if (Array.isArray(prevState[filter])) {
        //might have to test for objects later as well
        newFilters[filter] = [];
      } else {
        newFilters[filter] = null;
      }

      return newFilters;
    });

    setOrderedFilters((prev) => {
      return prev.filter((key) => key !== filter);
    });
  };

  return (
    <button style={btnStyle} onClick={() => handleFilterRemove(currFilter)}>
      Clear All
    </button>
  );
};

export default ClearAllBtn;
///reset ordered list in filter pills when exited too
