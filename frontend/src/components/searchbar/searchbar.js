import React, { useState, useEffect, useRef, useCallback } from "react";
import "./searchbar.css";
import { useNavigate } from "react-router-dom";

import { CiSearch } from "react-icons/ci";
import {
  SearchInput,
  InputWrapper,
  InputWrapperBorder,
  SearchBtn,
} from "./searchInput.js";
import {
  handleLocationSearch,
  handleInvSearch,
  invStringSearch,
  makeModelSearch,
} from "./searchHandlers.js";
import { Box } from "@mui/material";
import Button from "../buttons/button.js";

function Searchbar({
  currentRoute,
  darkRoute,
  mode,
  inv,
  locationFocusRef,
  locationValueRef,
  setAppliedFilters,
  setOrderedFilters,
  handleClearFilters,
  ...props //setLocaObjs
}) {
  const [border, setBorder] = useState(false);
  const isFocused = useRef(false);
  const inputRef = useRef(null); // element ref
  // const listItemRef = useRef(null)
  const [invSearch, setInvSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState(
    props.searchedValue //search from LCM?
      ? props.searchedValue.current //use if so
      : locationValueRef //search from LocationModal?
      ? locationValueRef.current //use if so
      : ""
  );

  //Invenotry Search
  const [dropMatches, setDropMatches] = useState();
  const [showDroplist, setShowDroplist] = useState(false);

  const navigate = useNavigate();

  const activeSearch =
    mode === "location" || mode === "locationChange"
      ? locationSearch
      : invSearch;

  const setActiveSearch =
    // if it's either location modal, set 'locationSearch' useState
    mode === "location" || mode === "locationChange"
      ? setLocationSearch
      : setInvSearch;
  // STYLE CHANGES
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
  const handleOnBlur = (e) => {
    setBorder(false);
    isFocused.current = false;
    inputRef.current.blur();
    setShowDroplist(false);
    if (locationFocusRef && locationFocusRef.current) {
      locationFocusRef.current = false;
    }
  };
  ///////// HANDLE FOCUS
  const handleFocus = (e) => {
    if (locationFocusRef) {
      //if focus ref was passed into SB as itself (NB > LM > SB)
      locationFocusRef.current = true; // set NB ref state to true
    }
    isFocused.current = true; //local comp focus Ref
    if (!border) {
      setBorder(true);
    }
    if (mode === "inventory" && inputRef.current.value.length > 0) {
      handleSubmit(e.key);
      setShowDroplist(true);
    }
  };
  ///////// HANDLE CHANGE
  const handleChange = (e) => {
    if (inputRef.current.value.length == 0) {
      if (mode === "inventory") {
        setShowDroplist(false);
      }
    }
    setActiveSearch(e.target.value);
  };

  ///////// HANDLE SUBMIT /////////////
  const handleSubmit = useCallback(
    async (key) => {
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
        if (key === "Enter") {
          handleOnBlur();
          if (inputRef.current.value.length) {
            // invStringSearch(
            //   navigate,
            //   currentRoute,
            //   setAppliedFilters,
            //   setOrderedFilters,
            //   handleClearFilters,
            //   dropMatches,
            //   inputRef.current.value
            // );
          }
        } else {
          // if key is not enter (ex; letter or backspace)
          if (inputRef.current.value.length) {
            const matches = handleInvSearch(invSearch, inv);
            setDropMatches(matches);
            setShowDroplist(true);
          } else {
            setShowDroplist(false);
          }
        }
      }
    },
    [mode, locationSearch, invSearch, inv, locationValueRef, props]
  );

  useEffect(() => {
    //local focus ref is true & input rendered
    if (isFocused.current && inputRef.current) {
      inputRef.current.focus(); // keeps the input focused despite comp re-render ( w/ setActiveSearch() <-- search value change)
      if (inputRef.current.value.length == 0) {
        setShowDroplist(false);
      }
    }
  }, [isFocused, activeSearch]); // Runs when isFocused state updates

  return (
    <InputWrapper
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      darkRoute={darkRoute}
    >
      <InputWrapperBorder
        darkRoute={darkRoute}
        border={border}
        showDroplist={showDroplist}
      />
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
        onKeyUp={(e) => {
          if (mode === "location" || mode === "locationChange") {
            if (e.key === "Enter") {
              handleSubmit();
            }
          } else {
            handleSubmit(e.key);
          }
        }}
        showDroplist={showDroplist}
      />
      {/* SEARCH BTN */}
      <SearchBtn
        onClick={handleSubmit}
        darkRoute={darkRoute}
        showDroplist={showDroplist}
      >
        <CiSearch
          style={{
            transform: "scale(1.6)",
            fill: border ? "var(--offBlue)" : "var(--iconColor)",
          }}
        />
      </SearchBtn>
      {showDroplist && (
        <Box className="droplist">
          <div className="droplist_item search_val">
            Search for: "{inputRef.current.value}"
          </div>
          {Object.entries(dropMatches).map(
            ([key, values]) =>
              values.length > 0 && (
                <div className="droplist_section" key={key}>
                  <h3>{key}</h3>
                  <ul>
                    {values.slice(0, 7).map((item, index) => (
                      <li
                        className="droplist_item"
                        key={index}
                        onMouseDown={() => {
                          makeModelSearch(
                            navigate,
                            currentRoute,
                            setAppliedFilters,
                            setOrderedFilters,
                            handleClearFilters,
                            key,
                            item,
                            inputRef,
                            setInvSearch
                          );
                          handleOnBlur();
                        }}
                      >
                        {key === "Model"
                          ? item.display
                          : key === "Year"
                          ? item.display
                          : item}
                      </li>
                    ))}
                  </ul>
                  {values.length > 7 && (
                    <Button
                      text={`View ${values.length - 7} more..`}
                      outlineStyle2={true}
                      style={{
                        marginLeft: ".25rem",
                        marginTop: ".5rem",
                        transform: "scale(.85)",
                      }}
                    />
                  )}
                </div>
              )
          )}
        </Box>
      )}
    </InputWrapper>
  );
}
export default Searchbar;
