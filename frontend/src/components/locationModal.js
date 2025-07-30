import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoHeart } from "react-icons/io5";
import { MdLocalOffer } from "react-icons/md";
import Button from "./buttons/button";
import Searchbar from "./searchbar/searchbar";

const LocationModal = ({
  smallNav,
  location,
  locationFocusRef,
  locationValueRef,
  setShowLocationChangeModal,
  setLocObjs,
  style = {},
}) => {
  const [favoritesNear, setFavoritesNear] = useState([]);
  const PopupBox = styled(Box)(({ theme }) => ({
    backgroundColor: "var(--tileBG)",
    position: "absolute",
    top: smallNav ? "4rem" : "5em",
    right: "0",
    width: smallNav ? "290px" : "310px",
    borderRadius: "12px",
    boxShadow: "var(--allAroundBoxShadow)",
    // border: "1px solid green",
    display: "flex",
    flexDirection: "column",
    "& > *": {
      padding: "1.25rem",
      paddingRight: ".8rem",
    },
    "& > *:last-child": {
      borderTop: "1px solid lightGrey",
      paddingTop: ".75rem",
    },
    ...style,
  }));

  const heartedCars = useSelector((state) => state.favorites.heartedCars);

  useEffect(() => {
    if (location?.localInv && heartedCars.length > 0) {
      const localFavorites = location.localInv.filter((localCar) =>
        heartedCars.some((favCar) => favCar.id === localCar.id)
      );
      setFavoritesNear(localFavorites);
    } else {
      setFavoritesNear([]); // reset if no matches or empty
    }
  }, [location.localInv, heartedCars]);

  const spanStyle = function (side) {
    return {
      display: "block",
      fontSize: ".85em",
      color: side === "top" ? "grey" : "var(--invCardTitle)",
      paddingBottom: ".2rem",
      marginBottom: side === "bottom" ? ".5rem" : "",
    };
  };

  const Linky = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    fontWeight: "600",
    color: "var(--invCardTitle)",
    transition: "color .2s ease",

    "&:hover": {
      color: "var(--btnBG)",
    },
  }));

  const h3Style = {
    fontWeight: "700",
    color: "var(--invCardTitle)",
    letterSpacing: "0px",
    fontSize: "1.35em",
    marginTop: ".35rem",
    marginBottom: ".5rem",
  };

  const Para = styled("p")(({ theme }) => ({
    fontSize: ".875rem",
    letterSpacing: "-.25px",
    marginLeft: ".35rem",
    marginBottom: ".5rem",
    color: "grey",
    display: "flex",
    gap: ".32rem",
    alignItems: "center",
    padding: "5px 10px",
    lineHeight: "1.45",

    "& > svg": {
      fill: "rgba(255, 92, 92)",
      height: "1.5rem",
      width: "1.5rem",
      verticalAlign: "middle",
      marginRight: ".2rem",
      opacity: ".6",
    },
  }));

  return (
    <PopupBox>
      <Box className="topBox">
        <span style={spanStyle("top")}>Your Results for {location.zip}:</span>

        <h3 style={h3Style}>
          {location.city}, {location.state}
        </h3>
        {/* LINKS */}
        <Para>
          <MdLocalOffer style={{ fill: "var(--offBlue)" }} />
          <span>
            <Linky>{location.localInv.length} offers</Linky> within{" "}
            <b>
              100<span style={{ fontSize: ".8em" }}>mi</span>
            </b>{" "}
            of <strong>{location.city}</strong>
          </span>
        </Para>
        <Para>
          <IoHeart />
          <span>
            <Linky>
              {favoritesNear.length}{" "}
              {favoritesNear.length > 1 || favoritesNear.length === 0
                ? "favorites"
                : "favorite"}
            </Linky>{" "}
            near<strong> {location.city}</strong>
          </span>
        </Para>
        {/* BUTTON */}
        <Button
          text="SEE NEARBY CARS"
          outlineStyle2={true}
          style={{
            marginTop: ".5rem",
            minWidth: "max-content",
            marginLeft: "48%",
            transform: " translateX(-50%)",
            paddingInline: "15px",
          }}
        />
      </Box>

      <Box className="bottomBox">
        <span style={spanStyle("bottom")}>Change Your Location:</span>

        <Searchbar
          darkRoute={true}
          mode="location"
          locationFocusRef={locationFocusRef} // focus state reference for Navbar onMouseLeave()
          locationValueRef={locationValueRef}
          setShowLocationChangeModal={setShowLocationChangeModal}
          setLocObjs={setLocObjs}
        />
      </Box>
    </PopupBox>
  );
};

export default LocationModal;
