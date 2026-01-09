import React, { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
//MATERIAL UI
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
//REACT ICONS
import { CiLocationOn } from "react-icons/ci";
import { RiArrowDownSFill } from "react-icons/ri";

import LocationChangeModal from "./locationChangeModal";
import LocationModal from "./locationModal";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import "./carsFilters/filters.css";

//UTILS
import { isInputFocused } from "./utils";

//REDUX
import { useDispatch, useSelector } from "react-redux";
import { unlockScroll } from "../uiSlice";
import { selectLocObjs, clearLocObjs } from "../user/userSlice";

const LocationHoverBox = ({
  darkRoute,
  smallNav, // <----- PASS IN FROM NAV BAR
  inFooter, // <---- PASS IN FROM FOOTER
}) => {
  // REDUX
  const location = useSelector((state) => state.location);
  const locObjs = useSelector(selectLocObjs);
  console.log("locObjs", locObjs);
  // SCROLL
  const dispatch = useDispatch();

  const [isLocationHovered, setIsLocationHovered] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const locationRef = useRef(null); // track clicking in or out of <LocationSpan/> REF (parent of LM)
  const locationInputRef = useRef(""); //NB > LM > SB input value
  const overlayRef = useRef(null);
  const locationChangeRef = useRef(null); // track clicking in or out of <LocationChangeModal/> REF

  /// STYLED COMPONENTS
  const LocationSpan = styled("span")(({ theme }) => ({
    display: "flex",
    position: "relative",
    alignItems: "center",
    border: "1px solid orange",
    paddingBottom: ".75rem",
    marginTop: ".9rem",
    "&:hover": {
      cursor: "pointer",
    },
  }));
  const LocationBox = styled(Box)(() => ({
    fontSize: ".7em",
    lineHeight: "11px",
    marginLeft: "-.05rem",
    marginRight: ".25rem",

    color: darkRoute ? "var(--iconColor)" : "#f4f5f7",
    border: "1px solid blue",
  }));

  const RightBtn = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: darkRoute ? "var(--iconColor)" : "#f4f5f7",
    height: "40px",
    width: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: "50%",
    fontSize: "1.65em",
    // border: "1px solid green",

    "&:hover": {
      backgroundColor: "rgba(83, 105, 177, .3)",
      cursor: "pointer",
    },

    // Responsive styles below 920px
    [theme.breakpoints.down("md")]: {
      height: "30px",
      width: "30px",
    },
  }));

  function handleMouseEnter() {
    if (!showLocationModal) {
      setShowLocationModal(true);
    }
  }
  function handleMouseLeave() {
    if (locObjs !== null) {
      // if LCM IS being returned (don't affect SLM state)
      return;
    } else {
      //logic if LCM is NOT being returned
      if (isInputFocused(locationInputRef)) {
        return;
      } else {
        console.log("👉 handleMouseLeave closed LM");
        setShowLocationModal(false);
      }
    }
  }

  // HANDLE OUTSIDE CLICK
  useEffect(() => {
    function handleClickOutside(event) {
      console.log("HANDLE CLICK OUTSIDE (LHB) WAS JUST TRIGGERED");
      // if LCM is showing
      if (locObjs !== null) {
        if (
          //clicked BG overlay while LCM is open
          overlayRef.current.contains(event.target) &&
          !locationChangeRef.current.contains(event.target)
        ) {
          dispatch(clearLocObjs()); //set Redux locObjs back to 'null' (will cause LCM to close)
          dispatch(unlockScroll()); // Redux 'unlockScroll()' - make scrollable again
          locationInputRef.current.focus(); // re-focus Loc Mod input
        }
      } else if (
        showLocationModal &&
        isInputFocused(locationInputRef) &&
        !locationRef.current.contains(event.target)
      ) {
        // clicked outside of LM while input was active
        console.log("👉 handleClickOutside closed LM");
        setShowLocationModal(false); //close LM
        locationInputRef.current.value = "";
      }
    }
    // ADD / REMOVE EVENT LISTENER WHEN 'SHOWLOCATIONMODAL' CHANGES
    if (showLocationModal) {
      document.addEventListener("mousedown", handleClickOutside);
      console.log("the handleClickOutside 'mousedown' listener has been ADDED");
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      console.log(
        "the handleClickOutside 'mousedown' listener has been REMOVED"
      );
    }

    // cleanup on unmount or when showLocationModal changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationModal, locObjs]);

  return (
    <>
      {/****** LOCATION CHANGE MODAL ******/}
      {createPortal(
        <AnimatePresence>
          {/* LOC OBJS !== NULL */}
          {locObjs !== null && (
            <motion.div
              ref={overlayRef}
              className="modal_overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <motion.div
                className="modal_wrapper"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <LocationChangeModal
                  ref={locationChangeRef}
                  location={location} // user Redux location passed from LocationModal
                  locationInputRef={locationInputRef}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <LocationSpan
        ref={locationRef} //for  'mousedown' tracking
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <RightBtn
          style={{
            marginLeft: smallNav ? "" : "-.5.5rem",
            marginRight: smallNav ? "" : ".25rem",
            backgroundColor: showLocationModal ? "rgba(83, 105, 177, .3)" : "",
          }}
          onClick={(e) => {
            e.stopPropagation();
            isLocationHovered
              ? setIsLocationHovered(false)
              : setIsLocationHovered(true);
          }}
        >
          <CiLocationOn />
        </RightBtn>

        {!smallNav && (
          <LocationBox
            onClick={(e) => {
              e.stopPropagation();
              isLocationHovered
                ? setIsLocationHovered(false)
                : setIsLocationHovered(true);
            }}
          >
            <span style={{ fontSize: ".9em" }}>
              Your Location: {location.zip}
            </span>
            <br />
            <strong>
              <span style={{ whiteSpace: "nowrap", fontSize: "1.1em" }}>
                {location.city}
                <RiArrowDownSFill />
              </span>
            </strong>
          </LocationBox>
        )}
        {/********* LOCATION MODAL *********/}
        {showLocationModal && ( //if Searchbar in LM has a value
          <LocationModal
            smallNav={smallNav}
            location={location}
            locationInputRef={locationInputRef} //to pass to SB
          />
        )}
      </LocationSpan>
    </>
  );
};

export default LocationHoverBox;
