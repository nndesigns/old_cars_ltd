import React from "react";
import { LuListFilter } from "react-icons/lu";
import { RiArrowLeftSLine } from "react-icons/ri";
import Button from "../buttons/button";
import FilterPillsBox from "./filterPillsBox";
// import { FilterMenu } from "./carsFilters";
import { IoMdClose } from "react-icons/io";
import MobileFilterRow from "./mobileFilterRow";
import ClearAllBtn from "./clearAllBtn.js";

const FilterPanel = ({
  activeFiltersList,
  setOrderedFilters,
  activeFilterCount,
  appliedFilters,
  setAppliedFilters,
  closePill,
  defaultFilterState,
  activeFilter,
  setActiveFilter,
  filterComponentsMap,
  //MOBILE-SPECIFIC ARGS
  mobile,
  setShowMobileFilterPanel,
  matchesTotal,
}) => {
  // HANDLE CLEAR FILTERS (ALL)
  const handleClearFilters = (mobile) => {
    const { sort, ...filtersWithoutSort } = defaultFilterState;
    const newApplied = {
      sort: appliedFilters.sort,
      ...filtersWithoutSort,
    };
    setAppliedFilters(newApplied);
    setOrderedFilters([]);
    setActiveFilter(null);

    if (mobile) {
      setShowMobileFilterPanel(false);
    }
  };

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
              zIndex: 9999,
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
            ({activeFilterCount})
          </span>
        </button>
      )}

      {/* CLEAR FILTER BTN */}
      {activeFiltersList.length > 0 && (!mobile || !activeFilter) && (
        <button
          onClick={() => handleClearFilters(mobile)}
          className="clearFilterBtn"
          style={mobile ? { right: "3rem" } : { right: "0" }}
        >
          Clear Filters
        </button>
      )}
      {/* CLOSE 'X' SVG */}
      {mobile && !activeFilter && (
        <IoMdClose onClick={() => setShowMobileFilterPanel(false)} />
      )}

      {/* MOBILE FILTER ROW */}
      {activeFiltersList.length > 0 && mobile && !activeFilter ? (
        <MobileFilterRow
          appliedFilters={appliedFilters}
          closePill={closePill}
          setActiveFilter={setActiveFilter}
          setShowMobileFilterPanel={setShowMobileFilterPanel}
          activeFiltersList={activeFiltersList}
        />
      ) : (
        !mobile && (
          <FilterPillsBox
            appliedFilters={appliedFilters}
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

      {/* rec'd 'activeFilter' (Cars) assigned? */}
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
                  setAppliedFilters={setAppliedFilters}
                  setOrderedFilters={setOrderedFilters}
                />
              )}
          </span>
          <div className="scrollBox_filter">
            {" "}
            {/******* ACTIVE FILTER  CALL********/}
            {filterComponentsMap[activeFilter]()}
          </div>
        </>
      ) : (
        <div className="scrollBox_filterMenu">
          {filterComponentsMap["Filter Menu"]()}
        </div>
      )}

      {mobile && (
        <div className="mobileFilterPanelFooter">
          <Button
            text={`SEE ${matchesTotal} MATCHES`}
            onClick={() => setShowMobileFilterPanel(false)}
          />
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
