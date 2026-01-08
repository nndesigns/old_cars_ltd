import React, { useEffect, useState } from "react";
import { LuListFilter } from "react-icons/lu";
import { RiArrowLeftSLine } from "react-icons/ri";
import Button from "../buttons/button";
import FilterPillsBox from "./filterPillsBox";
import { motion, AnimatePresence } from "framer-motion";
// import { FilterMenu } from "./carsFilters";
import { IoMdClose } from "react-icons/io";
import MobileFilterRow from "./mobileFilterRow";
import ClearAllBtn from "./clearAllBtn.js";
//REDUX
import { /* useSelector, */ useDispatch } from "react-redux";
import { clearFilters } from "../../user/filtersSlice.js";

const FilterPanel = ({
  activeFiltersList, /// orderedFilters from Cars.js
  // setOrderedFilters,
  orderedFilterCount,
  // appliedFilters,
  // setAppliedFilters,
  closePill,
  // defaultFilterState,
  activeFilter,
  setActiveFilter,
  filterComponentsMap,
  //MOBILE-SPECIFIC ARGS
  mobile,
  setShowMobileFilterPanel,
  // setPreventScroll,
  enableScrollLock,
  disableScrollLock,
  matchesTotal,
}) => {
  const dispatch = useDispatch();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  // HANDLE CLEAR FILTERS (ALL)
  /*   const handleClearFilters = (mobile) => {
    const { sort, ...filtersWithoutSort } = defaultFilterState;
    const newApplied = {
      sort: appliedFilters.sort, //keep the sort filter
      ...filtersWithoutSort,
    };
    setAppliedFilters(newApplied);
    setOrderedFilters([]);
    setActiveFilter(null);

    if (mobile) {
      setShowMobileFilterPanel(false);
      setPreventScroll(false);
    }
  };
 */
  const compKeyToReduxKey = {
    Make: "makes",
    "Body Type": "styles",
    //don't need Price bc 'reset btn' in component
    Model: "models",
  };

  return (
    <div
      className="left_panel"
      style={
        mobile
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "white",
              maxWidth: "unset",
              zIndex: 22,
              overflowY: "auto",
            }
          : {}
      }
    >
      {/* FILTER & SORT BTN */}

      {(!mobile || !activeFilter) && (
        <button
          className="filterSortBtn"
          onClick={() => setActiveFilter("Sort by")}
        >
          <LuListFilter style={{ transform: "scale(1.25)" }} /> Filter & Sort{" "}
          <span style={{ opacity: activeFiltersList.length > 0 ? 1 : 0 }}>
            ({orderedFilterCount})
          </span>
        </button>
      )}

      {/* CLEAR FILTER BTN */}
      {activeFiltersList.length > 0 && (!mobile || !activeFilter) && (
        <button
          onClick={() => {
            dispatch(clearFilters());
            if (mobile) {
              setShowMobileFilterPanel(false);
              // setPreventScroll(false);
              disableScrollLock();
            }
          }}
          className="clearFilterBtn"
          style={mobile ? { right: "3rem" } : { right: "0" }}
        >
          Clear Filters
        </button>
      )}
      {/* CLOSE 'X' SVG */}
      {mobile && !activeFilter && (
        <IoMdClose
          onClick={() => {
            setShowMobileFilterPanel(false);
            // setPreventScroll(false);
            disableScrollLock();
          }}
        />
      )}

      {/* MOBILE FILTER ROW */}
      {activeFiltersList.length > 0 && mobile && !activeFilter ? (
        <MobileFilterRow
          // appliedFilters={appliedFilters}
          closePill={closePill}
          setActiveFilter={setActiveFilter}
          setShowMobileFilterPanel={setShowMobileFilterPanel}
          // setPreventScroll={setPreventScroll}
          enableScrollLock={enableScrollLock}
          activeFiltersList={activeFiltersList}
        />
      ) : (
        !mobile && (
          <FilterPillsBox
            // appliedFilters={appliedFilters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            closePill={closePill}
          />
        )
      )}
      <hr />

      {/* SAVE SEARCH BOX */}
      {(!mobile || !activeFilter) && (
        <div
          className="saveSearch_box"
          style={
            mobile
              ? {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: ".2rem",
                }
              : {}
          }
        >
          <p
            style={
              mobile
                ? {
                    marginBottom: 0,
                    textAlign: "left",
                  }
                : {}
            }
          >
            {activeFiltersList.length > 0
              ? "Pick up where you left off or get notified when new inventory arrives."
              : "Add filters to save your search and get notified when new inventory arrives."}
          </p>
          <Button
            text="SAVE SEARCH"
            outlineStyle2={activeFiltersList.length > 0}
            style={{
              height: mobile ? "60px" : "inherit",
              paddingBlock: ".6rem",
              whiteSpace: mobile ? "wrap" : "",
            }}
            disabled={activeFiltersList.length === 0}
          />
        </div>
      )}
      <AnimatePresence mode="wait">
        {activeFilter ? (
          <>
            <button
              className="filterBtnStyle backBtn"
              onClick={() => setActiveFilter(null)}
            >
              <RiArrowLeftSLine /> Back to all filters
            </button>
            <span className="h3ClearWrapper">
              <h3 className="activeFilter_h3">{activeFilter}</h3>
              {activeFilter !== "Sort by" &&
                activeFilter !== "Price" &&
                activeFiltersList.includes(compKeyToReduxKey[activeFilter]) && (
                  <ClearAllBtn
                    currFilter={compKeyToReduxKey[activeFilter]}
                    // setAppliedFilters={setAppliedFilters}
                    // setOrderedFilters={setOrderedFilters}
                  />
                )}
            </span>
            {/* </motion.div> */}
            <motion.div
              initial={hasMounted ? { opacity: 0, x: -50 } : false}
              // initial={{ opacity: 0, x: -50 }} // ✅ this works
              animate={{ opacity: 1, x: 0 }} // move back into view
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="scrollBox_filter"
            >
              {/******* ACTIVE FILTER  CALL********/}
              {filterComponentsMap[activeFilter]()}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={hasMounted ? { opacity: 0, x: -50 } : false}
            // initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }} // move back into view
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="scrollBox_filterMenu"
            style={{
              overflowY: mobile ? "scroll" : "auto", // control scroll behavior
              scrollbarWidth: mobile ? "none" : "auto", // Firefox
              msOverflowStyle: mobile ? "none" : "auto", // IE/Edge legacy
            }}
          >
            {filterComponentsMap["Filter Menu"]()}
          </motion.div>
        )}
      </AnimatePresence>

      {mobile && (
        <div className="mobileFilterPanelFooter">
          <Button
            text={`SEE ${matchesTotal} MATCHES`}
            onClick={() => {
              setShowMobileFilterPanel(false);
              // setPreventScroll(false);
              disableScrollLock();
            }}
          />
        </div>
      )}
    </div>
  );
};

// export default FilterPanel;
export default React.memo(FilterPanel);
