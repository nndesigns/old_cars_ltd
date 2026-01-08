import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { TiArrowSortedDown } from "react-icons/ti";
import { MdOutlineSort } from "react-icons/md";
import { PiLineVerticalLight } from "react-icons/pi";
import { BsSliders } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
// import { AnimatePresence } from "motion/react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import "./carsToolbar.css";

import { updateFilter } from "../../user/filtersSlice";
import { clearCompare, clearChosenCars } from "../../user/userSlice";

const CarsToolbar = ({
  matchesTotal,
  below820,
  above375,
  setShowMobileFilterPanel,
  // setPreventScroll,
  enableScrollLock,
  orderedFilterCount,
  setActiveFilter,
  sortCats,
  // appliedFilters,
  // setAppliedFilters,
  setShowCompare,
  showCompare,
  // setCompareCars,
  // setChosenCars,
}) => {
  const hasMounted = useRef(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const thumbRef = useRef(null);
  const inputRef = useRef(null);
  // const [hovered, setHovered] = useState(false);

  // console.log("received showCompare (CarsToolbar)", showCompare);
  //REDUX
  const dispatch = useDispatch();
  const appliedFilters = useSelector((s) => s.filters.appliedFilters);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (thumbRef.current) {
      thumbRef.current.animate(
        [
          { transform: `translateX(${showCompare ? 0 : 20}px)` },
          { transform: `translateX(${showCompare ? 20 : 0}px)` },
        ],
        {
          duration: 300,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
    if (inputRef.current) {
      inputRef.current.animate(
        [
          { backgroundColor: showCompare ? "white" : "var(--invCardTitle)" },
          { backgroundColor: showCompare ? "var(--invCardTitle)" : "white" },
        ],
        {
          duration: 300,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
  }, [showCompare]);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const Toolbar = styled("section")(({ theme }) => ({
    position: "sticky",
    top: 0,
    // zIndex: 4,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    paddingInline: below820 ? "1rem" : "none",
    paddingBlock: below820 ? ".85rem" : "1.5rem",
    // borderBottom: below820 ? "1px solid lightgrey" : "none",
    zIndex: 10,
    borderBottom: "1px solid var(--greyBorder)",

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
    // setPreventScroll(true);
    enableScrollLock();
  };

  const handleOpenSort = () => {
    if (below820) {
      setShowMobileFilterPanel(true);
      // setPreventScroll(true);
      enableScrollLock();
      setActiveFilter("Sort by");
    } else {
      console.log("this far was reached");
      setShowSortDropdown(true);
    }
  };

  /// SORT DROP DOWN
  // const MotionDropdownUL = motion.create(
  //   styled("ul")(({ theme }) => ({
  //     position: "absolute",
  //     border: "1px solid var(--greyBorder)",
  //     top: 65,
  //     width: "max-content",
  //     right: 140,

  //     backgroundColor: "white",
  //     borderRadius: "4px",
  //     boxShadow:
  //       "0 7px 8px -4px rgba(0, 38, 77, .14), 0 12px 17px 2px rgba(0, 38, 77, .1), 0 5px 22px 4px rgba(0, 38, 77, .08);",
  //     paddingTop: "0.5rem",
  //     // zIndex: 50,

  //     ".dropdownItem": {
  //       height: "2.5rem",
  //       fontSize: ".975em",
  //       padding: ".25rem 2.2rem",
  //       paddingLeft: "0",
  //       display: "flex",
  //       alignItems: "center",
  //       cursor: "pointer",
  //       transition: "background-color 0.2s ease",

  //       "&:hover": {
  //         backgroundColor: "var(--tileBG)",
  //       },
  //     },

  //     ".checkmarkSpace": {
  //       width: "1.25rem",
  //       fontSize: "1.25em",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       marginInline: ".5rem",
  //     },
  //   }))
  // );
  const MotionDropdownUL = motion(
    styled("ul")(({ theme }) => ({
      position: "absolute",
      border: "1px solid var(--greyBorder)",
      top: 65,
      width: "max-content",
      right: 140,
      backgroundColor: "white",
      borderRadius: "4px",
      boxShadow:
        "0 7px 8px -4px rgba(0, 38, 77, .14), 0 12px 17px 2px rgba(0, 38, 77, .1), 0 5px 22px 4px rgba(0, 38, 77, .08);",
      paddingTop: "0.5rem",

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
    }))
  );

  const SortDropdown = React.forwardRef(
    (
      {
        sortCats,
        appliedSort,
        // setAppliedFilters,
        setShowSortDropdown,
        ...motionProps // 👈 capture motion props here
      },
      ref
    ) => {
      return (
        <MotionDropdownUL ref={ref} {...motionProps}>
          {" "}
          {/* 👈 pass motion props down */}
          {sortCats.map((cat) => (
            <li
              key={cat}
              className="dropdownItem"
              onClick={() => {
                dispatch(
                  updateFilter({
                    key: "sort",
                    value: cat,
                  })
                );

                // setAppliedFilters((prev) => ({
                //   ...prev,
                //   sort: cat,
                // }));
                setShowSortDropdown(false);
              }}
            >
              <span className="checkmarkSpace">
                {appliedSort === cat && <FiCheck />}
              </span>
              {cat}
            </li>
          ))}
        </MotionDropdownUL>
      );
    }
  );

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
        style={{ marginLeft: !below820 ? "auto" : "none", zIndex: 20 }}
        onClick={() => handleOpenSort()}
      >
        <MdOutlineSort style={{ fontSize: "1.7rem" }} />
        Sort
        {!below820 && <TiArrowSortedDown />}
      </button>
      <AnimatePresence mode="wait">
        {showSortDropdown && (
          <SortDropdown
            key="sort-dropdown"
            ref={dropdownRef}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            setShowSortDropdown={setShowSortDropdown}
            sortCats={sortCats}
            appliedSort={appliedFilters.sort}
            // setAppliedFilters={setAppliedFilters}
          />
        )}
      </AnimatePresence>

      {/* COMPARE */}
      <div
        className="btnStyle"
        style={{
          marginLeft: below820 ? "auto" : "1rem",
        }}
      >
        Compare
        <div
          className="toggle_container"
          // style={{ backgroundColor: hovered ? "rgba(83, 105, 117, .3)" : "" }}
          // onMouseEnter={() => setHovered(true)}
          // onMouseLeave={() => setHovered(false)}
        >
          <div className="toggleThumbContainer">
            <input
              ref={inputRef}
              className="toggleInput"
              type="checkbox"
              checked={showCompare}
              onChange={() => {
                if (showCompare) {
                  // setCompareCars([]);
                  // setChosenCars([]);
                  // clearChosen();
                  dispatch(clearChosenCars());
                  dispatch(clearCompare());
                }
                setShowCompare((prev) => !prev);
              }}
            />

            <span
              className="toggleThumb"
              style={{ transform: `translateX(${showCompare ? "20px" : 0})` }}
              ref={thumbRef}
            />
          </div>
        </div>
      </div>
    </Toolbar>
  );
};

export default CarsToolbar;
