import React, { useState, useEffect, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { CiSearch } from "react-icons/ci";
import SearchInput from "./searchInput.js";
import { handleLocationSearch, handleInvSearch } from "./searchHandlers.js";

function Searchbar({
  darkRoute,
  mode,
  locationFocusRef,
  locationValueRef,
  ...props //setLocaObjs
}) {
  const [border, setBorder] = useState(false);
  const isFocused = useRef(false);
  const inputRef = useRef(null); // element ref
  const [invSearch, setInvSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState(
    props.searchedValue //search from LCM?
      ? props.searchedValue.current //use if so
      : locationValueRef //search from LocationModal?
      ? locationValueRef.current //use if so
      : ""
  );

  const activeSearch =
    mode === "location" || mode === "locationChange"
      ? locationSearch
      : invSearch;
  const setActiveSearch =
    // if it's either location modal, set 'locationSearch' useState
    mode === "location" || mode === "locationChange"
      ? setLocationSearch
      : setInvSearch;

  const handleHover = () => {
    setBorder(true); // Or any action you want to take on hover
  };

  const handleMouseLeave = () => {
    if (isFocused.current) {
      return; //leave the border present
    } else {
      setBorder(false); // Reset or handle mouse leave
    }
  };

  ///////// HANDLE ON BLUR (LocationModal Searchbar)
  const handleOnBlur = () => {
    setBorder(false);
    isFocused.current = false;
    if (locationFocusRef && locationFocusRef.current) {
      locationFocusRef.current = false;
    }
  };
  ///////// HANDLE FOCUS
  const handleFocus = () => {
    if (locationFocusRef) {
      //if focus ref was passed into SB as itself (NB > LM > SB)
      locationFocusRef.current = true; // set NB ref state to true
    }
    isFocused.current = true; //local comp focus Ref
  };
  ///////// HANDLE CHANGE
  const handleChange = (e) => {
    setActiveSearch(e.target.value);
  };

  ///////// HANDLE SUBMIT /////////////
  const handleSubmit = useCallback(async () => {
    if (mode === "location") {
      //before setting the props.setShowLocationChangeModal useState to true,
      if (locationSearch.length === 0) {
        locationValueRef.current = ""; //reflect that in the Navbar useState
      } else {
        props.setShowLocationChangeModal(true); //update Navbar modal useState
        locationValueRef.current = locationSearch; //assign curr search value to Navbar useRef (to shared  to LCM)
        //RUN API  TO RETRIEVE LOC OBJS (from us_zips.csv)
        const results = await handleLocationSearch(locationSearch);
        // console.log("results", results);
        props.setLocObjs(results); //<-- assigns to locObjs Navbar useState
      }
    } else if (mode === "locationChange") {
      locationValueRef.current = locationSearch;
      //RUN API  TO RETRIEVE LOC OBJS
      const results = await handleLocationSearch(locationSearch);
      // console.log("results", results);
      props.setLocObjs(results); //<-- parent Navbar useState update
    } else {
      // handleInvSearch(invSearch);
    }
  }, [mode, locationSearch, invSearch, locationValueRef, props]);

  useEffect(() => {
    //local focus ref is true & input rendered
    if (isFocused.current && inputRef.current) {
      inputRef.current.focus(); // keeps the input focused despite comp re-render ( w/ setActiveSearch() <-- search value change)
    }
  }, [isFocused, activeSearch]); // Runs when isFocused state updates

  const InputWrapper = styled(Box)(({ theme }) => ({
    position: "relative",
    border: "none",
    height: "48px",
    width: "100%",
    padding: 0,
    boxShadow: darkRoute ? "none" : "10px 10px 10px rgba(0,0,0,.2)",
    borderRadius: "8px",
    boxSizing: "border-box",
  }));

  const InputWrapperBorder = styled(Box, {
    shouldForwardProp: (prop) => prop !== "darkRoute",
  })(({ theme, darkRoute }) => ({
    position: "absolute",
    width: !darkRoute ? "calc(100% - 8px)" : "100%",
    height: !darkRoute ? "calc(100% - 8px)" : "100%",
    top: !darkRoute ? "4px" : "0",
    left: !darkRoute ? "4px" : "0",
    backgroundColor: "transparent",
    outline: border
      ? "2px solid var(--invCardTitle)"
      : darkRoute
      ? "1px solid lightGrey"
      : "2px solid transparent",
    paddingTop: 0,
    borderRadius: "5px",
    display: "flex",
    transition: "outline 0.5s ease-in-out",
    pointerEvents: "none",
  }));

  const SearchBtn = styled("button")(({ theme }) => ({
    height: "48px" /*  "100%" */,
    width: "100%",
    verticalAlign: "middle",
    display: "inline-block",
    maxWidth: "57px",
    border: "none",
    backgroundColor: darkRoute ? "var(--tileBG)" : "white",
    borderRadius: "0px 8px 8px 0px",
    padding: "unset",
    "&:hover": {
      backgroundColor: "white",
    },
  }));

  return (
    <InputWrapper onMouseEnter={handleHover} onMouseLeave={handleMouseLeave}>
      <InputWrapperBorder darkRoute={darkRoute}></InputWrapperBorder>
      <SearchInput
        darkRoute={darkRoute}
        border={border}
        ref={inputRef}
        onChange={handleChange}
        value={activeSearch}
        onFocus={handleFocus}
        onBlur={handleOnBlur}
        placeholder={
          mode === "location" || mode === "locationChange"
            ? "Search City or Zip"
            : "Search by make, model, or keyword"
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      {/* SEARCH BTN */}
      <SearchBtn onClick={handleSubmit}>
        <CiSearch
          style={{
            transform: "scale(1.6)",
            fill: border ? "var(--offBlue)" : "var(--iconColor)",
          }}
        />
      </SearchBtn>
    </InputWrapper>
  );
}
export default Searchbar;
