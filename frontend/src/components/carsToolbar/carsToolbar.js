import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { TiArrowSortedDown } from "react-icons/ti";
import { MdOutlineSort } from "react-icons/md";
import { PiLineVerticalLight } from "react-icons/pi";
import { BsSliders } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import "./carsToolbar.css";

const CarsToolbar = ({
  matchesTotal,
  below820,
  above375,
  setShowMobileFilterPanel,
  orderedFilterCount,
  setActiveFilter,
  sortCats,
  appliedFilters,
  setAppliedFilters,
  setShowCompare,
  showCompare,
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  //LOCAL STATE RE SHOW COMPARE
  const [localChecked, setLocalChecked] = useState(showCompare);
  useEffect(() => {
    setLocalChecked(showCompare);
  }, [showCompare]);

  //INPUT ON CHANGE HANDLER
  const handleToggle = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLocalChecked((prev) => !prev);
      });
    });
    setTimeout(() => setShowCompare((prev) => !prev), 100);
  };

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const Toolbar = styled("section")(({ theme }) => ({
    position: "sticky",
    top: 0,
    zIndex: 4,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    paddingInline: below820 ? "1rem" : "none",
    paddingBlock: below820 ? ".85rem" : "1.5rem",
    borderBottom: below820 ? "1px solid lightgrey" : "none",

    "& > span": {
      color: "grey",
      fontWeight: "400",
    },
    "& >button": {
      cursor: "pointer",
    },
  }));

  useEffect(() => {
    // console.log("showSortDropdown", showSortDropdown);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      } else if (
        /* (dropdownRef.current && dropdownRef.current.contains(event.target)) || */
        dropdownRef.current &&
        buttonRef.current.contains(event.target)
      ) {
        setShowSortDropdown(false);
      } else if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowSortDropdown(false);
      }
    };

    if (below820) {
      setShowSortDropdown(false);
    }

    if (showSortDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortDropdown, below820]);

  const handleOpenMobileFilters = () => {
    setShowMobileFilterPanel(true);
  };

  const handleOpenSort = () => {
    if (below820) {
      setShowMobileFilterPanel(true);
      setActiveFilter("Sort by");
    } else {
      setShowSortDropdown(true);
    }
  };
  // SORT DROPDOWN
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }, // moves down when closing
  };

  const SortDropdownBase = ({
    sortCats,
    appliedSort,
    setAppliedFilters,
    className,
  }) => {
    return (
      <motion.ul
        variants={dropdownVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className={className}
        ref={dropdownRef}
      >
        {sortCats.map((cat) => (
          <li
            key={cat}
            className="dropdownItem"
            onClick={() => {
              setAppliedFilters((prev) => ({
                ...prev,
                sort: cat,
              }));
              // setShowSortDropdown(false);
              setTimeout(() => setShowSortDropdown(false), 300);
            }}
          >
            <span className="checkmarkSpace">
              {appliedSort === cat && <FiCheck />}
            </span>
            {cat}
          </li>
        ))}
      </motion.ul>
    );
  };

  const SortDropdown = styled(SortDropdownBase)(({ theme }) => ({
    position: "absolute",
    top: 40,
    width: "max-content",

    right: 0,
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow:
      "0 7px 8px -4px rgba(0, 38, 77, .14), 0 12px 17px 2px rgba(0, 38, 77, .1), 0 5px 22px 4px rgba(0, 38, 77, .08);",
    paddingTop: "0.5rem",
    zIndex: 10,

    ".dropdownItem": {
      height: "2.5rem",
      fontSize: ".975em",
      padding: ".25rem 2.2rem",
      paddingLeft: "0",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      transition: "background-color 0.2s ease",

      "&:hover": {
        backgroundColor: "var(--tileBG)",
      },
    },

    ".checkmarkSpace": {
      width: "1.25rem",
      fontSize: "1.25em",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginInline: ".5rem",
    },
  }));

  return (
    <Toolbar>
      {!below820 && (
        <span>
          {matchesTotal} {matchesTotal !== 1 ? "Matches" : "Match"}
        </span>
      )}
      {below820 && (
        <button className="btnStyle" onClick={() => handleOpenMobileFilters()}>
          {above375 && (
            <BsSliders style={{ fontSize: "1.3rem", marginRight: ".5rem" }} />
          )}{" "}
          Filters
          {orderedFilterCount > 0 && (
            <span className="filterBtnSpan">{orderedFilterCount}</span>
          )}
        </button>
      )}
      {/* SORT BTN */}
      {below820 && (
        <PiLineVerticalLight style={{ fontSize: "2rem", opacity: ".4" }} />
      )}
      <button
        ref={buttonRef}
        className="btnStyle"
        style={{ marginLeft: !below820 ? "auto" : "none" }}
        onClick={() => handleOpenSort()}
      >
        <MdOutlineSort style={{ fontSize: "1.7rem" }} />
        Sort
        {!below820 && <TiArrowSortedDown />}
        <AnimatePresence>
          {showSortDropdown && (
            <SortDropdown
              key="sort-dropdown"
              sortCats={sortCats}
              appliedSort={appliedFilters.sort}
              setAppliedFilters={setAppliedFilters}
            />
          )}
        </AnimatePresence>
      </button>

      {/* COMPARE */}
      <div
        className="btnStyle"
        style={{ marginLeft: below820 ? "auto" : "1rem" }}
      >
        Compare
        {/* <div className="toggle_container">
          <input
            type="checkbox"
            checked={showCompare}
            onChange={() => {
              setShowCompare((prev) => !prev);
            }}
          />
        </div> */}
        <div className="toggle_container" onClick={handleToggle}>
          <div className={`toggle_track ${localChecked ? "checked" : ""}`}>
            <div className="toggle_thumb" />
          </div>
        </div>
      </div>
    </Toolbar>
  );
};

export default CarsToolbar;
