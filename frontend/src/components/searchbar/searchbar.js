import React, { useState, useEffect, useRef, useCallback } from "react";
import "./searchbar.css";
import { useNavigate } from "react-router-dom";
import { TfiClose } from "react-icons/tfi";
import { CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchInput,
  InputWrapper,
  InputWrapperBorder,
  SearchBtn,
  droplistStyle,
} from "./searchInput.js";
import {
  handleLocationSearch,
  invStringSearch,
  makeModelSearch,
} from "./searchHandlers.js";
import { smartSearch } from "../axiosCalls.js";
import { Box } from "@mui/material";
import Button from "../buttons/button.js";

function Searchbar({
  currentRoute,
  darkRoute,
  mode,
  inv, ////WHY  DOES SEARCHBAR NEED INV (THIS ISN'T BEING USED)
  locationInputValue,
  setLocationInputValue,
  shopByValue,
  setShopByValue,
  inputRef,
  setAppliedFilters,
  setOrderedFilters,
  handleClearFilters,
  ...props
}) {
  const [border, setBorder] = useState(false);
  const [isActive, setIsActive] = useState(
    mode === "location" || mode === "locationChange"
      ? locationInputValue.length > 0
      : false
  );

  const [invSearch, setInvSearch] = useState("");
  const [isFocused, setIsFocused] = useState(
    inputRef.current === document.activeElement
  );
  const [dropMatches, setDropMatches] = useState({});
  const [showDroplist, setShowDroplist] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [flatMatches, setFlatMatches] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [typedValue, setTypedValue] = useState("");
  const navigate = useNavigate();

  //prevent  'searchInv'-triggered useEffect from resetting 'showDroplist' to true after "enter" onKeyDown functions run (eg; handleOnBlur setting it to false) & after 'onMouseDown' clicking an option.
  // 'onKeyDown': MMS (setInvSearch), HOB (setShowDroplist), invSearch-triggered useEffect
  const suppressDroplistRef = useRef(false);

  //auto-scrolling w/ ArrowDown & ArrowUp
  const droplistRef = useRef(null);
  const itemRefs = useRef([]);

  // Hover border styling
  const handleHover = () => setBorder(true);
  const handleMouseLeave = () => {
    if (!isFocused) setBorder(false);
  };

  const handleOnBlur = (e) => {
    if (e.relatedTarget && e.relatedTarget.closest(".droplist")) return;
    setBorder(false);
    setIsFocused(false);
    setShowDroplist(false);
    setHighlightedIndex(-1);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (!border) setBorder(true);
  };

  const toggleExpand = (e, key) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // setHighlightedIndex(-1);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length && !isActive) setIsActive(true);
    if (!value.length && isActive) setIsActive(false);

    if (mode === "location" || mode === "locationChange") {
      setLocationInputValue(value);
    } else if (mode === "distLocFilter") {
      setShopByValue(value);
    } else if (mode === "inventory") {
      setInvSearch(value); // triggers droplist useEffect
    }
  };

  // HANDLE SUBMIT
  const handleSubmit = useCallback(
    async (e) => {
      const key = e.key;
      const isClick = e.type === "click";
      const searchValue = e.value ?? inputRef.current.value ?? "";

      if (mode === "location" || mode === "locationChange") {
        if (!searchValue) {
          setLocationInputValue("");
          return;
        }
        setLocationInputValue(searchValue);
        const results = await handleLocationSearch(searchValue);
        props.setLocObjs(results);
        if (mode === "location") {
          props.setPreventScroll(true);
        }
      } else {
        if (key === "Enter" || isClick) {
          handleOnBlur(e);
          invStringSearch(
            navigate,
            currentRoute,
            setAppliedFilters,
            setOrderedFilters,
            handleClearFilters,
            invSearch
          );
        }
      }
    },
    [
      mode,
      invSearch,
      navigate,
      currentRoute,
      setAppliedFilters,
      setOrderedFilters,
      handleClearFilters,
      props,
    ]
  );

  // AUTO SCROLLING
  const scrollHighlightedIntoView = (index) => {
    const container = droplistRef.current;
    const item = itemRefs.current[index];
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const isAbove = itemRect.top < containerRect.top;
    const isBelow = itemRect.bottom > containerRect.bottom;

    if (isAbove) {
      // scroll up just enough
      container.scrollTop -= containerRect.top - itemRect.top + 4; // small padding
    } else if (isBelow) {
      // scroll down just enough
      // container.scrollTop += itemRect.bottom - containerRect.bottom + 4;
      container.scrollTo({
        top: container.scrollTop + (itemRect.bottom - containerRect.bottom + 4),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (dropMatches && Object.keys(dropMatches).length) {
      const flattened = [
        { type: "search_val", key: "search_val", value: invSearch },
        ...Object.entries(dropMatches)
          .filter(([key]) => key.toLowerCase() !== "vin")
          .flatMap(([key, values]) => {
            const visibleValues = expandedKeys[key]
              ? values
              : values.slice(0, 7);

            const baseItems = visibleValues.map((item) => ({
              type: "item",
              key,
              value: key === "Model" || key === "Year" ? item.display : item,
              raw: item,
            }));

            if (values.length > 7) {
              baseItems.push({
                type: "button",
                key,
                value: expandedKeys[key]
                  ? "Show less"
                  : `View ${values.length - 7} more..`,
              });
            }

            return baseItems;
          }),
      ];

      setFlatMatches(flattened);
    } else {
      setFlatMatches([]);
      setHighlightedIndex(-1);
    }
  }, [dropMatches, expandedKeys, invSearch]);

  useEffect(() => {
    if (
      mode === "inventory" &&
      invSearch.length > 0 &&
      !suppressDroplistRef.current
    ) {
      const fetchMatches = async () => {
        const matches = await smartSearch(invSearch);
        setDropMatches(matches);
        setShowDroplist(true);
      };
      fetchMatches();
    } else {
      setShowDroplist(false);
    }
    // Reset the suppression after the effect runs once
    suppressDroplistRef.current = false;
  }, [invSearch, mode]);

  // Focus/blur management
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    } else if (!isFocused && inputRef.current === document.activeElement) {
      inputRef.current.blur();
    }
  }, [isFocused]);

  return (
    <InputWrapper
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      darkRoute={darkRoute}
      distLocFilter={mode === "distLocFilter"}
    >
      <InputWrapperBorder
        darkRoute={darkRoute}
        border={border}
        showDroplist={showDroplist}
        rightPanelError={props.rightPanelError}
      />

      <SearchInput
        darkRoute={darkRoute}
        border={border}
        ref={inputRef}
        rightPanel={true}
        onChange={
          mode === "rightPanel"
            ? (e) => props.handleOnChange(e.target.value)
            : handleChange
        }
        value={
          mode === "inventory"
            ? invSearch
            : mode === "rightPanel"
            ? props.inputValue
            : locationInputValue
        }
        onFocus={handleFocus}
        onBlur={handleOnBlur}
        placeholder={
          mode === "location" || mode === "locationChange"
            ? "Search City or Zip"
            : mode === "distLocFilter"
            ? "Search by City or State"
            : mode === "rightPanel"
            ? "Search by URL or Stock #"
            : "Search by make, model, or keyword"
        }
        onKeyDown={(e) => {
          if (mode === "inventory" && showDroplist && flatMatches.length > 0) {
            if (e.key === "ArrowDown") {
              ///// ARROW DOWN /////////////
              e.preventDefault();
              if (highlightedIndex === -1) setTypedValue(invSearch);
              setHighlightedIndex((prev) => {
                const nextIndex =
                  prev < flatMatches.length - 1 ? prev + 1 : prev;
                scrollHighlightedIntoView(nextIndex); // ✅ auto-scroll
                return nextIndex;
              });
              const next = flatMatches[highlightedIndex + 1];
              if (next) inputRef.current.value = next.value;
            } else if (e.key === "ArrowUp") {
              //// ARROW UP ///////////////
              e.preventDefault();
              if (highlightedIndex > 0) {
                const prevIndex = highlightedIndex - 1;
                setHighlightedIndex(prevIndex);
                scrollHighlightedIntoView(prevIndex); // ✅ auto-scroll
                const prevItem = flatMatches[prevIndex];
                if (prevItem) inputRef.current.value = prevItem.value;
              } else if (highlightedIndex === 0) {
                setHighlightedIndex(-1);
                inputRef.current.value = typedValue;
              }
            } else if (e.key === "Enter") {
              //// ENTER ////////////////
              e.preventDefault();
              if (highlightedIndex >= 0) {
                const selected = flatMatches[highlightedIndex];

                if (selected.type === "button") {
                  // 🔘 Trigger expand/collapse
                  toggleExpand(e, selected.key);
                  // Optionally keep droplist open (don’t blur)
                } else if (selected.type === "item") {
                  // 🔹 Normal item behavior
                  suppressDroplistRef.current = true;
                  const { key, raw } = selected;
                  makeModelSearch(
                    navigate,
                    currentRoute,
                    setAppliedFilters,
                    setOrderedFilters,
                    handleClearFilters,
                    key,
                    raw,
                    inputRef,
                    setInvSearch
                  );
                  handleOnBlur(e);
                }
              } else {
                handleSubmit(e);
              }
            }
          } else if (
            mode === "location" ||
            mode === "locationChange" ||
            mode === "distLocFilter"
          ) {
            if (e.key === "Enter") handleSubmit(e);
          }
        }}
        showDroplist={showDroplist}
      />

      {isActive && (
        <button
          className="clearInputBtn"
          style={{ right: mode === "distLocFilter" ? ".5rem" : "" }}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current.value = null;

            if (mode === "locationChange" || mode === "location") {
              setLocationInputValue("");
              if (mode === "locationChange") props.setLocObjs([]);
            } else if (mode === "inventory") {
              setInvSearch("");
            } else if (mode === "distLocFilter") {
              setShopByValue("");
            }

            setIsActive(false);
            inputRef.current.focus();
          }}
        >
          <TfiClose />
        </button>
      )}

      {mode !== "rightPanel" && mode !== "distLocFilter" && (
        <SearchBtn
          onClick={(e) => handleSubmit(e)}
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
      )}

      {showDroplist && (
        <Box
          ref={droplistRef} // auto-scrolling
          className="droplist"
          style={droplistStyle({ darkRoute })}
        >
          <div
            ref={(el) => (itemRefs.current[0] = el)}
            className="droplist_item search_val"
          >
            Search for: "{/* invSearch */ inputRef.current.value}"
          </div>

          {Object.entries(dropMatches)
            .filter(([key]) => key.toLowerCase() !== "vin")
            .map(
              ([key, values]) =>
                values.length > 0 && (
                  <div className="droplist_section" key={key}>
                    <h3>{key}</h3>
                    <ul>
                      {values.slice(0, 7).map((item, index) => {
                        const flatIndex = flatMatches.findIndex(
                          (m) =>
                            m.key === key &&
                            m.value ===
                              (key === "Model" || key === "Year"
                                ? item.display
                                : item)
                        );
                        return (
                          <li
                            ref={(el) => (itemRefs.current[flatIndex] = el)} //auto scrolling
                            className={`droplist_item ${
                              flatIndex === highlightedIndex
                                ? "highlighted"
                                : ""
                            }`}
                            key={index}
                            onMouseDown={(e) => {
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
                              suppressDroplistRef.current = true;
                              handleOnBlur(e);
                            }}
                          >
                            {key === "Model" || key === "Year"
                              ? item.display
                              : item}
                          </li>
                        );
                      })}
                    </ul>

                    <AnimatePresence initial={false}>
                      {expandedKeys[key] && (
                        <motion.ul
                          key={`${key}-expanded`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          {values.slice(7).map((item, index) => {
                            const flatIndex = flatMatches.findIndex(
                              (m) =>
                                m.key === key &&
                                m.value ===
                                  (key === "Model" || key === "Year"
                                    ? item.display
                                    : item)
                            );
                            return (
                              <li
                                ref={(el) => (itemRefs.current[flatIndex] = el)} //auto scrolling
                                className={`droplist_item ${
                                  flatIndex === highlightedIndex
                                    ? "highlighted"
                                    : ""
                                }`}
                                key={index + 7}
                                onMouseDown={(e) => {
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
                                  handleOnBlur(e);
                                }}
                              >
                                {key === "Model" || key === "Year"
                                  ? item.display
                                  : item}
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>

                    {values.length > 7 && (
                      // <Button
                      //   ref={(el) => {
                      //     const buttonIndex = flatMatches.findIndex(
                      //       (m) => m.type === "button" && m.key === key
                      //     );
                      //     if (buttonIndex !== -1)
                      //       itemRefs.current[buttonIndex] = el;
                      //   }}
                      //   onClick={(e) => toggleExpand(e, key)}
                      //   text={
                      //     expandedKeys[key]
                      //       ? "Show less"
                      //       : `View ${values.length - 7} more..`
                      //   }
                      //   outlineStyle2={true}
                      //   style={{
                      //     marginLeft: ".25rem",
                      //     marginTop: ".5rem",
                      //     transform: "scale(.85)",
                      //     color:
                      //       flatMatches.findIndex(
                      //         (m) => m.type === "button" && m.key === key
                      //       ) === highlightedIndex
                      //         ? "white" // 🔘 highlight color
                      //         : "var(--btnBG)",
                      //     backgroundColor:
                      //       flatMatches.findIndex(
                      //         (m) => m.type === "button" && m.key === key
                      //       ) === highlightedIndex
                      //         ? "var(--btnBG)" // 🔘 highlight color
                      //         : "transparent",
                      //   }}
                      // />
                      <Button
                        ref={(el) => {
                          const buttonIndex = flatMatches.findIndex(
                            (m) => m.type === "button" && m.key === key
                          );
                          if (buttonIndex !== -1)
                            itemRefs.current[buttonIndex] = el;
                        }}
                        onClick={(e) => toggleExpand(e, key)}
                        text={
                          expandedKeys[key]
                            ? "Show less"
                            : `View ${values.length - 7} more..`
                        }
                        outlineStyle2={true}
                        // className={
                        //   flatMatches.findIndex(
                        //     (m) => m.type === "button" && m.key === key
                        //   ) === highlightedIndex
                        //     ? "highlighted-btn"
                        //     : ""
                        // }
                        style={{
                          marginLeft: ".25rem",
                          marginTop: ".5rem",
                          transform: "scale(.85)",
                          color:
                            flatMatches.findIndex(
                              (m) => m.type === "button" && m.key === key
                            ) === highlightedIndex
                              ? "white" // 🔘 highlight color
                              : "var(--btnBG)",
                          backgroundColor:
                            flatMatches.findIndex(
                              (m) => m.type === "button" && m.key === key
                            ) === highlightedIndex
                              ? "var(--btnBG)" // 🔘 highlight color
                              : "transparent",
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
