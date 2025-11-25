import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { ReactComponent as Logo } from "../icons/nav_icons/logo.svg";
import { useSelector } from "react-redux";
import { CiLocationOn } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { BsCaretDownFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import "./carsFilters/filters.css";

import { Link } from "react-router-dom";
import { RiArrowDownSFill } from "react-icons/ri";
import LocationModal from "./locationModal";
import { createPortal } from "react-dom";
import LocationChangeModal from "./locationChangeModal.js";

function Navbar({
  darkRoute,
  inv,
  setAppliedFilters,
  setOrderedFilters,
  setPreventScroll,
}) {
  const [smallNav, setSmallNav] = useState(window.innerWidth < 850);
  const location = useSelector((state) => state.location); //redux user
  const [isLocationHovered, setIsLocationHovered] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInputValue, setLocationInputValue] = useState("");
  const [locObjs, setLocObjs] = useState(null);

  const locationRef = useRef(null); // track clicking in or out of <LocationSpan/> REF (parent of LM)
  const locationInputRef = useRef(null); //NB > LM > SB input value

  const locationChangeRef = useRef(null); // track clicking in or out of <LocationChangeModal/> REF

  const locationChangeInputRef = useRef(null);

  //RESIZE HANDLER
  useEffect(() => {
    const handleResize = () => {
      setSmallNav(window.innerWidth < 850);
    };
    window.addEventListener("resize", handleResize);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const LocationSpan = styled("span")(({ theme }) => ({
    display: "flex",
    position: "relative",
    alignItems: "center",
    // border: "1px solid orange",
    paddingBottom: ".75rem",
    marginTop: ".9rem",

    // "& > *": {  },
    "&:hover": {
      cursor: "pointer",
    },
  }));

  const Nav = styled("nav")(({ theme }) => ({
    height: "48px",
    width: "100%",
    marginBottom: ".2rem",
    background: "transparent",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "visible",
    zIndex: 20, //overtake sibling  SearchBar & its dropdown (15)
    position: "relative",

    [`@media (min-width: 850px)`]: {
      height: "70px", // Change background color on wider screens
    },
  }));

  const LocationBox = styled(Box)(() => ({
    fontSize: ".7em",
    lineHeight: "11px",
    marginLeft: "-.05rem",
    marginRight: ".25rem",

    color: darkRoute ? "var(--iconColor)" : "#f4f5f7",
    // border: "1px solid blue",
  }));

  const sectionRightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0",
    height: "100%",
  };

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

  const LeftBtn = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: darkRoute ? "var(--iconColor)" : "#f4f5f7",
    height: "48px",
    display: "flex",
    alignItems: "center",
    paddingInline: "10px 12px",
    border: "2px solid transparent",
    borderRadius: "8px",

    "&:onClick": {
      border: "2px solid white",
    },
    "&:hover": {
      cursor: "pointer",
    },
    [theme.breakpoints.down("md")]: {
      paddingInline: "7px 9px",
    },
  }));

  useEffect(() => {
    function handleClickOutside(event) {
      if (showLocationModal && locObjs) {
        //BOTH modals showing
        if (
          !locationRef.current.contains(event.target) && // click is ouside Loc Span
          !locationChangeRef.current.contains(event.target) // & outside Loc Change Mod
        ) {
          setLocObjs(null); // close LCM
          setPreventScroll(false);
          locationInputRef.current.focus(); // re-focus Loc Mod input
        }
      } else if (!locObjs && showLocationModal) {
        //only LM showing
        if (!locationRef.current.contains(event.target)) {
          //click is outside LS
          setShowLocationModal(false); //close LM
        }
      }
    }
    // ADD / REMOVE EVENT LISTENER WHEN 'SHOWLOCATIONMODAL' CHANGES
    if (showLocationModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // cleanup on unmount or when showLocationModal changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationModal, locObjs]);

  return (
    <>
      {/* LOCATION CHANGE MODAL */}
      {createPortal(
        /****** LOCATION CHANGE MODAL ******/
        <AnimatePresence>
          {locObjs !== null && (
            <motion.div
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
                  locationInputValue={locationInputValue}
                  setLocationInputValue={setLocationInputValue}
                  locationChangeInputRef={locationChangeInputRef}
                  inv={inv}
                  locObjs={locObjs}
                  setLocObjs={setLocObjs}
                  setPreventScroll={setPreventScroll}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <Nav>
        {/******* LEFT SECTION NAV *******/}
        <section
          style={{
            display: smallNav ? "" : "flex",
            width: smallNav ? "230px" : "",
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "flex-end" }}>
            <Logo
              style={{
                fill: darkRoute ? "var(--invCardTitle)" : "#f4f5f7",
                width: smallNav ? "" : "250px",
                marginRight: smallNav ? "" : ".6rem",
              }}
            />
          </Link>
          {!smallNav && (
            <>
              <LeftBtn to="/cars">Shop</LeftBtn>
              <LeftBtn>Trade/Sell</LeftBtn>
              <LeftBtn>Finance</LeftBtn>
              <LeftBtn>Research</LeftBtn>
              <LeftBtn>
                More{" "}
                <BsCaretDownFill
                  style={{ marginLeft: "8px", fontSize: ".7em" }}
                />
              </LeftBtn>
            </>
          )}
        </section>

        {/******* RIGHT SECTION  NAV*******/}
        <section style={sectionRightStyle}>
          {/* LOCATION BTN SPAN */}
          <LocationSpan
            ref={locationRef} //for  'mousedown' tracking
            onMouseEnter={() => setShowLocationModal(true)}
            onMouseLeave={() => {
              if (
                !locObjs &&
                locationInputRef.current !== document.activeElement //not getting recog as untrue once typed into SB in LM
              ) {
                //hide the LM
                setShowLocationModal(false);
              }
            }}
          >
            <RightBtn
              // disableHoverBg={smallNav ? false : true}
              style={{
                marginLeft: smallNav ? "" : "-.5.5rem",
                marginRight: smallNav ? "" : ".25rem",
                backgroundColor: showLocationModal
                  ? "rgba(83, 105, 177, .3)"
                  : "",
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
                locationInputValue={locationInputValue}
                setLocationInputValue={setLocationInputValue}
                locationInputRef={locationInputRef} //to track type value to send to LocationChangeModal here
                setLocObjs={setLocObjs}
                setAppliedFilters={setAppliedFilters}
                setOrderedFilters={setOrderedFilters}
                setPreventScroll={setPreventScroll}
              />
            )}
          </LocationSpan>

          {/* FAVORITES BUTTON */}
          <RightBtn to="/favorites">
            <CiHeart />
          </RightBtn>
          {/* USER BUTTON */}
          <RightBtn>
            <CiUser />
          </RightBtn>
        </section>
      </Nav>
    </>
  );
}
export default Navbar;
