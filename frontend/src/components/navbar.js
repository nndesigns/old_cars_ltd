import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import { ReactComponent as Logo } from "../icons/nav_icons/logo.svg";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { BsCaretDownFill } from "react-icons/bs";
import "./carsFilters/filters.css";

import { Link } from "react-router-dom";

import LocationHoverBox from "./locationHoverBox.js";

function Navbar({ darkRoute }) {
  const [smallNav, setSmallNav] = useState(window.innerWidth < 850);

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
    zIndex: 20, //overtake sibling  SearchBar & its dropdown (15)
    position: "relative",

    [`@media (min-width: 850px)`]: {
      height: "70px", // Change background color on wider screens
    },
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

  return (
    <>
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
          <LocationHoverBox darkRoute={darkRoute} smallNav={smallNav} />

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
