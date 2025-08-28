import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import FilterPillsBox from "./filterPillsBox";
import { handleScroll } from "../utils.js";

const MobileFilterRow = ({
  appliedFilters,
  closePill,
  setActiveFilter,
  setShowMobileFilterPanel,
  activeFiltersList,
}) => {
  const mobileFilterRowWrapperRef = useRef(null);
  const mobileFilterRowRef = useRef(null);
  const [atScrollStart, setAtScrollStart] = useState(true);
  const [atScrollEnd, setAtScrollEnd] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const checkScrollPosition = () => {
    const el = mobileFilterRowRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;

    setAtScrollStart(scrollLeft === 0);
    setAtScrollEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  // Run on mount and whenever the applied filters change (which may affect content width)
  useEffect(() => {
    const wrapper = mobileFilterRowWrapperRef.current;
    const row = mobileFilterRowRef.current;

    if (!wrapper || !row) return;

    const wrapperWidth = wrapper.clientWidth;
    const rowScrollWidth = row.scrollWidth;

    setIsScrollable(rowScrollWidth > wrapperWidth);

    // Check scroll positions on mount/layout
    checkScrollPosition();

    // Optional: listen for resize to adjust button visibility dynamically
    const resizeObserver = new ResizeObserver(() => {
      const newWrapperWidth = wrapper.clientWidth;
      const newRowScrollWidth = row.scrollWidth;
      setIsScrollable(newRowScrollWidth > newWrapperWidth);
      checkScrollPosition();
    });

    resizeObserver.observe(wrapper);
    resizeObserver.observe(row);

    return () => resizeObserver.disconnect();
  }, [appliedFilters, activeFiltersList]);

  const handleOpenMobileFilters = (btn_cat) => {
    setShowMobileFilterPanel(true);
    if (btn_cat === "makes") {
      setActiveFilter("Make");
    } else if (btn_cat === "price") {
      setActiveFilter("Price");
    } else if (btn_cat === "features") {
      setActiveFilter("Features");
    } else {
      setActiveFilter(null);
    }
  };

  return (
    <div className="mobileFilterRowWrapper" ref={mobileFilterRowWrapperRef}>
      {!atScrollStart && isScrollable && (
        <button
          className="scrollLeftBtn"
          onClick={() => handleScroll(mobileFilterRowRef, -1, true)}
        >
          <IoIosArrowBack />
        </button>
      )}

      <div
        className="mobileFilterRow"
        ref={mobileFilterRowRef}
        onScroll={checkScrollPosition}
      >
        <FilterPillsBox
          appliedFilters={appliedFilters}
          closePill={closePill}
          mobile={true}
        />
        {!activeFiltersList.includes("makes") && (
          <button
            className="filterPill"
            onClick={() => handleOpenMobileFilters("makes")}
          >
            Make <MdOutlineKeyboardArrowDown />
          </button>
        )}
        {!activeFiltersList.includes("price") && (
          <button
            className="filterPill"
            onClick={() => handleOpenMobileFilters("price")}
          >
            Price <MdOutlineKeyboardArrowDown />
          </button>
        )}
        {!activeFiltersList.includes("features") && (
          <button
            className="filterPill"
            onClick={() => handleOpenMobileFilters("features")}
          >
            Features <MdOutlineKeyboardArrowDown />
          </button>
        )}
        <button
          className="filterPill"
          onClick={() => handleOpenMobileFilters("allFilters")}
        >
          All Filters <MdOutlineKeyboardArrowDown />
        </button>
      </div>

      {!atScrollEnd && isScrollable && (
        <button
          className="scrollRightBtn"
          onClick={() => handleScroll(mobileFilterRowRef, 1, true)}
        >
          <IoIosArrowForward />
        </button>
      )}
    </div>
  );
};

export default MobileFilterRow;
