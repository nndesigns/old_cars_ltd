import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

const CustomSelect = ({
  prop,
  setProp,
  array,
  label,
  onChange,
  secondCS,
  leftPanel,
  above601,
}) => {
  const [clickedOn, setClickedOn] = useState(false);
  const selectRef = useRef(null);

  const handleChange = (e) => {
    const rawValue = e.target.value;
    // Try to convert to number if the original array contains numbers
    const parsedValue =
      typeof array[0] === "number" ? Number(rawValue) : rawValue;

    setProp(parsedValue);
    if (onChange) {
      onChange(parsedValue);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if the click is outside of the select component
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setClickedOn(false); // Reset clicked state if clicked outside
      }
    };

    // Add event listener when component mounts
    window.addEventListener("click", handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={selectRef}
      style={{
        position: "relative",
        marginTop:
          secondCS && !leftPanel && !above601
            ? "1rem"
            : leftPanel
            ? "1rem"
            : "0px",
      }}
    >
      <label htmlFor={label}>{label}</label>
      <br />
      <select
        name={label}
        id={`${label}_select`}
        onChange={(e) => {
          handleChange(e);
          setClickedOn(true);
        }}
        value={prop}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          width: "100%",
          fontSize: "1.25rem",
          outline: "none",
          height: "50px",
          borderRadius: "2px",
          fontWeight: "200",
          paddingInline: ".75rem 3rem",
          marginTop: ".4rem",
          color: prop ? "black" : "rgba(0,0,0, .6)",
          border: clickedOn ? "2px solid var(--btnBG)" : "",
        }}
      >
        {label != "From" && (
          <option value="" disabled>
            Select a {label}
          </option>
        )}

        {array.map((item) => (
          <option value={item} key={item}>
            {label === "Min Price" || label === "Max Price"
              ? `$${item.toLocaleString()}`
              : `${item}`}
          </option>
        ))}
      </select>
      <IoIosArrowDown
        style={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          pointerEvents: "none",
          color: "rgb(25, 118, 210)",
          fontSize: "1.5rem",
        }}
      />
    </div>
  );
};

export default CustomSelect;
