import React, { useState, useEffect, useMemo } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { AiFillMinusCircle } from "react-icons/ai";

const capitalizeWords = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

//////// FILTER PILLS BOX
const FilterPillsBox = ({ appliedFilters, closePill, mobile }) => {
  const [showAll, setShowAll] = useState(false);

  ////////////// ADJUST 'CLOSE PILL'  TO ACCOUNT FOR CLOSING A MODEL PILL CORRECTLY

  const formatPillLabel = ({ key, label }) => {
    if (key.includes("minPrice")) {
      return `Over $${label.toLocaleString()}`;
    } else if (key.includes("maxPrice")) {
      return `Under $${label.toLocaleString()}`;
    } else if (key.includes("yearFrom")) {
      return `${label} and Newer`;
    } else if (key.includes("yearTo")) {
      return `${label} and Older`;
    } else if (key.includes("mileage")) {
      return `Under ${label / 1000}K Miles`;
    } else if (key.includes("models")) {
      return label; // now just a single model name
    } else {
      return capitalizeWords(label);
    }
  };

  // Create a flat array of all valid filter pills (excluding 'sort')
  const allPills = useMemo(() => {
    const pills = [];

    const { minPrice, maxPrice, yearFrom, yearTo, ...restFilters } =
      appliedFilters;

    const hasMinPrice =
      minPrice !== undefined && minPrice !== null && minPrice !== "";
    const hasMaxPrice =
      maxPrice !== undefined && maxPrice !== null && maxPrice !== "";
    const hasYearFrom =
      yearFrom !== undefined && yearFrom !== null && yearFrom !== "";
    const hasYearTo = yearTo !== undefined && yearTo !== null && yearTo !== "";

    // Handle price range
    if (hasMinPrice && hasMaxPrice) {
      pills.push({
        key: `priceRange-${minPrice}-${maxPrice}`,
        label: `$${Number(minPrice).toLocaleString()} - $${Number(
          maxPrice
        ).toLocaleString()}`,
        onClick: () => {
          closePill("minPrice", minPrice);
          closePill("maxPrice", maxPrice);
        },
      });
    } else {
      if (hasMinPrice) {
        pills.push({
          key: `minPrice-${minPrice}`,
          label: `${Number(minPrice).toLocaleString()}`,
          onClick: () => closePill("minPrice", minPrice),
        });
      }
      if (hasMaxPrice) {
        pills.push({
          key: `maxPrice-${maxPrice}`,
          label: `${Number(maxPrice).toLocaleString()}`,
          onClick: () => closePill("maxPrice", maxPrice),
        });
      }
    }

    // Handle year range
    if (hasYearFrom && hasYearTo) {
      pills.push({
        key: `yearRange-${yearFrom}-${yearTo}`,
        label: `${yearFrom} - ${yearTo}`,
        onClick: () => {
          closePill("yearFrom", yearFrom);
          closePill("yearTo", yearTo);
        },
      });
    } else {
      if (hasYearFrom) {
        pills.push({
          key: `yearFrom-${yearFrom}`,
          label: `${yearFrom}`,
          onClick: () => closePill("yearFrom", yearFrom),
        });
      }
      if (hasYearTo) {
        pills.push({
          key: `yearTo-${yearTo}`,
          label: `${yearTo}`,
          onClick: () => closePill("yearTo", yearTo),
        });
      }
    }

    // Process the rest of the filters
    Object.entries(restFilters).forEach(([key, value]) => {
      if (
        key === "sort" ||
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0)
      ) {
        return; // skip
      }

      /// MODELS
      if (
        key === "models" &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        Object.entries(value).forEach(([make, modelsArray]) => {
          modelsArray.forEach((model) => {
            pills.push({
              key: `models-${make}-${model.replace(/\s+/g, "_")}`,
              label: model,
              onClick: () => closePill("models", { [make]: [model] }),
            });
          });
        });
        return; // models handled
      }
      //MAKES
      if (Array.isArray(value)) {
        value.forEach((arrValue) => {
          pills.push({
            key: `${key}-${arrValue}`,
            label: arrValue,
            onClick: () => closePill(key, arrValue),
          });
        });
      } else {
        pills.push({
          key: `${key}-${value}`,
          label: value,
          onClick: () => closePill(key, value),
        });
      }
    });

    return pills;
  }, [appliedFilters, closePill]);

  const totalCount = allPills.length;
  const visiblePills = mobile
    ? allPills
    : showAll
    ? allPills
    : allPills.slice(0, 5);
  const hiddenCount = totalCount - 5;

  return (
    totalCount > 0 && (
      <div className="filterPillsBox">
        {visiblePills.map(({ key, label, onClick }) => (
          <span key={key} className="filterPill">
            {formatPillLabel({ key, label })}
            <IoCloseCircleSharp onClick={onClick} />
          </span>
        ))}

        {totalCount > 5 && !mobile && (
          <span className="filterPill togglePill">
            {showAll ? "Show fewer" : `Show ${hiddenCount} more`}
            {showAll ? (
              <AiFillMinusCircle onClick={() => setShowAll((prev) => !prev)} />
            ) : (
              <HiMiniPlusCircle onClick={() => setShowAll((prev) => !prev)} />
            )}
          </span>
        )}
      </div>
    )
  );
};

export default FilterPillsBox;
