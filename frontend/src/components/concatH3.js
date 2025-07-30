import React from "react";

// Helper function to format arrays with 'and' or 'or'
const formatList = (list, conjunction = "and") => {
  if (!Array.isArray(list) || list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} ${conjunction} ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, ${conjunction} ${
    list[list.length - 1]
  }`;
};

const pluralize = (word) => {
  // Basic rule: add 's' (this won't handle irregular plurals like 'coupe' → 'coupes')
  if (!word) return word;
  if (word.endsWith("s")) return word; // already plural
  return `${word}s`;
};

const ConcatH3 = ({ appliedFilters }) => {
  const {
    carSize,
    yearFrom,
    yearTo,
    transmission,
    exteriorColor,
    fuelType,
    makes,
    models,
    styles,
    distance,
    interiorColor,
    minPrice,
    maxPrice,
    mileage,
    MPGHwy,
    drivetrain,
    doors,
    cylinders,
  } = appliedFilters;

  const segments = [];

  // 1. Car Size
  if (carSize?.length) segments.push(formatList(carSize));

  // 2. Year Range
  if (yearFrom && yearTo) {
    segments.push(`${yearFrom} - ${yearTo}`);
  } else if (yearFrom) {
    segments.push(`${yearFrom} & newer`);
  } else if (yearTo) {
    segments.push(`${yearTo} & older`);
  }

  // 3. Transmission
  if (transmission?.length) segments.push(formatList(transmission));

  // 4. Exterior Color
  if (exteriorColor?.length) segments.push(formatList(exteriorColor, "or"));

  // 5. Fuel Type
  if (fuelType?.length) segments.push(formatList(fuelType, "and"));

  // 6. Makes (+ Model)
  if (makes?.length) {
    const makesWithModels = makes.map((make) => {
      const makeModels = models?.[make];
      if (makeModels?.length) {
        return `${make} ${formatList(makeModels, "and")}`;
      }
      return make;
    });

    segments.push(formatList(makesWithModels, "and"));
  }

  // 7. Body Type
  if (styles?.length) {
    const pluralStyles = styles.map(pluralize).map((style) =>
      style
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
    segments.push(formatList(pluralStyles, "and"));
  }

  // 8. Distance
  if (typeof distance === "number") segments.push(`within ${distance} miles`);

  // 9. Interior Color
  if (interiorColor?.length)
    segments.push(`with ${formatList(interiorColor, "or")} interior`);

  // 10. Price Range
  if (minPrice != null && maxPrice != null) {
    segments.push(
      `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`
    );
  } else if (minPrice != null) {
    segments.push(`over $${minPrice.toLocaleString()}`);
  } else if (maxPrice != null) {
    segments.push(`under $${maxPrice.toLocaleString()}`);
  }

  // 11. Mileage
  if (typeof mileage === "number")
    segments.push(`under ${mileage / 1000}K miles`);

  // 12. MPG Hwy
  if (typeof MPGHwy === "number") segments.push(`over ${MPGHwy} MPG`);

  // 13. Drivetrain
  if (drivetrain?.length) segments.push(formatList(drivetrain, "and"));

  // 14. Doors
  if (doors?.length)
    segments.push(`with ${formatList(doors.map(String), "or")} doors`);

  // 15. Cylinders
  if (cylinders?.length)
    segments.push(`with ${formatList(cylinders.map(String), "or")} cylinders`);

  // Final label
  const resultString = `Used ${segments.join(" ")} for sale`;

  return (
    <h3
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        margin: 0,
      }}
      title={resultString} // Optional tooltip with full text
    >
      {resultString}
    </h3>
  );
};

export default ConcatH3;
