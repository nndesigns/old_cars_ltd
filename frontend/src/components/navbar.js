import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { ReactComponent as Logo } from "../icons/nav_icons/logo.svg";
import { useSelector } from "react-redux";
import { CiLocationOn } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { BsCaretDownFill } from "react-icons/bs";

import { Link } from "react-router-dom";
import { RiArrowDownSFill } from "react-icons/ri";
import LocationModal from "./locationModal";
import { createPortal } from "react-dom";
import LocationChangeModal from "./locationChangeModal.js";

function Navbar({ darkRoute, inv }) {
  const [smallNav, setSmallNav] = useState(window.innerWidth < 850);
  const location = useSelector((state) => state.location); //redux user
  const [isLocationHovered, setIsLocationHovered] = useState(false);
  const [showLocationChangeModal, setShowLocationChangeModal] = useState(false);
  const [locObjs, setLocObjs] = useState(null);

  const mousedownInsideLCM = useRef(false); //mousedown event ref

  const locationRef = useRef(null); //<LocationSpan/> REF
  const locationModalRef = useRef(null); // <LocationModal/> REF
  const locationChangeRef = useRef(null); //<LocationChangeModal/> REF
  const locationFocusRef = useRef(false); //NB > LM >SB input focus
  const locationValueRef = useRef(""); //NB > LM > SB input value

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

  const Nav = styled("nav")(({ theme }) => ({
    height: "48px",
    width: "100%",
    marginBottom: ".2rem",
    background: "transparent",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "visible",

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
    "&:hover": {
      cursor: "pointer",
    },
  }));

  const sectionRightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0",
    height: "100%",
  };

  const RightBtn = styled(Link, {
    shouldForwardProp: (prop) => prop !== "disableHoverBg",
  })(({ theme, disableHoverBg }) => ({
    textDecoration: "none",
    color: darkRoute ? "var(--iconColor)" : "#f4f5f7",
    height: "40px",
    width: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: "50%",
    fontSize: "1.65em",
    zIndex: 10,

    "&:hover": {
      backgroundColor: disableHoverBg
        ? "transparent"
        : "rgba(83, 105, 177, .3)",
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

  //PAGEWRAPPER (LOCATIONCHANGEMODAL)
  const PageWrapper = styled("div")(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,.4)",
    zIndex: "20",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }));

  const LocationSpan = styled("span")(({ theme }) => ({
    display: "flex",
    position: "relative",
    alignItems: "center",
    paddingBlock: "1.5rem",
    zIndex: "10",
  }));

  // console.log("redux location object (navbar)", location);

  // DOM 'CLICK' LISTENER WHEN LOCATIONMODAL ACTIVE (for mobile)
  useEffect(() => {
    if (!isLocationHovered && !showLocationChangeModal) return;

    const handleMouseDown = (e) => {
      if (showLocationChangeModal) {
        if (!locationChangeRef.current.contains(e.target)) {
          setShowLocationChangeModal(false);
        } else {
          mousedownInsideLCM.current = true;
        }
      }
    };

    const handleClickOutside = (event) => {
      if (isLocationHovered && !showLocationChangeModal) {
        locationValueRef.current = "";
      }

      // LOCATION MODAL
      if (
        isLocationHovered &&
        locationRef.current && //<LocationSpan/> exists in the DOM
        !locationRef.current.contains(event.target) && //click that triggered HCO wasn't in it
        !showLocationChangeModal && //LCM not currently displayed
        !locationValueRef.current //
      ) {
        setIsLocationHovered(false);
        locationFocusRef.current = false;
        locationValueRef.current = "";
      }

      // LOCATION CHANGE MODAL
      if (
        showLocationChangeModal &&
        locationChangeRef.current &&
        !locationChangeRef.current.contains(event.target) &&
        !mousedownInsideLCM.current //if mousedown didn't occur inside of LCM
      ) {
        // console.log("THIS WAS TRIGGERED");
        setShowLocationChangeModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("mousedown", handleMouseDown);
    // console.log("handleClickOutside click listener on DOM");
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("mousedown", handleMouseDown);
      mousedownInsideLCM.current = false;
    };
  }, [
    isLocationHovered,
    showLocationChangeModal,
    locationValueRef,
    locationRef,
    locationFocusRef,
    locationChangeRef,
  ]);

  return (
    <>
      {showLocationChangeModal &&
        createPortal(
          <PageWrapper>
            {/****** LOCATION CHANGE MODAL ******/}
            <LocationChangeModal
              ref={locationChangeRef}
              location={location} //user Redux location passed from LocationModal
              locationValueRef={locationValueRef}
              setShowLocationChangeModal={setShowLocationChangeModal}
              inv={inv}
              locObjs={locObjs}
              setLocObjs={setLocObjs}
            />
          </PageWrapper>,
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
            ref={locationRef}
            onMouseEnter={() => setIsLocationHovered(true)}
            onMouseLeave={() => {
              //HIDE LOC MODAL ONLY IF ITS SEARCHBAR NOT FOCUSED
              if (!locationFocusRef.current) {
                setIsLocationHovered(false);
              }
            }}
          >
            <RightBtn
              disableHoverBg={smallNav ? false : true}
              style={{
                marginLeft: smallNav ? "" : "-.5rem",
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
            {(isLocationHovered === true ||
              // showLocationChangeModal ||
              locationValueRef.current) && (
              <LocationModal
                ref={locationModalRef}
                smallNav={smallNav}
                location={location}
                locationFocusRef={locationFocusRef} //to track Searchbar focus state from Navbar
                locationValueRef={locationValueRef} //to track type value to send to LocationChangeModal here
                setShowLocationChangeModal={setShowLocationChangeModal}
                setLocObjs={setLocObjs}
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
