import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { updateFilter } from "../user/filtersSlice";
import Box from "@mui/material/Box";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoHeart } from "react-icons/io5";
import { MdLocalOffer } from "react-icons/md";
import Button from "./buttons/button";
import Searchbar from "./searchbar/searchbar";
// import {}

const LocationModal = ({
  smallNav,
  location,
  locationInputRef, // pass to SB
  style = {},
}) => {
  const [favoritesNear, setFavoritesNear] = useState([]);
  const PopupBox = styled(Box)(({ theme }) => ({
    backgroundColor: "var(--tileBG)",
    position: "absolute",
    top: smallNav ? "37px" : "48px",
    right: -15,
    width: smallNav ? "290px" : "310px",
    borderRadius: "12px",
    boxShadow: "var(--allAroundBoxShadow)",
    display: "flex",
    flexDirection: "column",
    "& > *": {
      padding: "1.25rem",
    },
    "& > *:last-child": {
      borderTop: "1px solid lightGrey",
      paddingTop: ".75rem",
    },
    ...style,
  }));
  const navigate = useNavigate();
  const locationRef = useLocation(); // for HANDLE OFFERS CLICK
  // REDUX
  const dispatch = useDispatch();
  const heartedCars = useSelector((state) => state.favorites.heartedCars);

  //// SET FAVORITES
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

  /// STYLES
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

  //
  /// HANDLE OFFERS CLICK
  //
  /*   const handleOffersClick = ({ nearby }) => {
    // update appliedFilters
    setAppliedFilters((prev) => ({
      ...prev,
      dist_radius: nearby ? 25 : 100,
    }));

    // update orderedFilters
    setOrderedFilters((prev) => {
      // only add "dist_radius" if it’s not already in the array
      if (!prev.includes("dist_radius")) {
        return [...prev, "dist_radius"];
      }
      return prev;
    });

    if (nearby && locationRef.pathname !== `/cars`) {
      navigate(`/cars`);
    }
  }; */
  const handleOffersClick = ({ nearby }) => {
    dispatch(
      updateFilter({
        key: "dist_radius",
        value: nearby ? 25 : 100,
      })
    );

    if (nearby && locationRef.pathname !== "/cars") {
      navigate("/cars");
    }
  };

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
            <Linky to="/cars" onClick={handleOffersClick}>
              {location.localInv.length} offers
            </Linky>{" "}
            within{" "}
            <b>
              100<span style={{ fontSize: ".8em" }}>mi</span>
            </b>{" "}
            of <strong>{location.city}</strong>
          </span>
        </Para>
        <Para>
          <IoHeart />
          <span>
            {favoritesNear.length ? (
              <Linky to="/favorites?fromLocModal=true">
                {favoritesNear.length}{" "}
                {favoritesNear.length > 1 || favoritesNear.length === 0
                  ? "favorites"
                  : "favorite"}
              </Linky>
            ) : (
              <span style={{ fontWeight: "600" }}>0 favorites</span>
            )}{" "}
            near<strong> {location.city}</strong>
          </span>
        </Para>
        {/* BUTTON */}
        <Button
          onClick={() => handleOffersClick({ nearby: true })}
          text="SEE NEARBY CARS"
          outlineStyle2={true}
          style={{
            marginTop: ".75rem",
            display: "block",
            marginInline: "auto",
            padding: " .75rem 1.25rem",
          }}
        />
      </Box>

      <Box className="bottomBox">
        <span style={spanStyle("bottom")}>Change Your Location:</span>

        <Searchbar
          darkRoute={true}
          mode="location"
          // locationInputValue={locationInputValue}
          // setLocationInputValue={setLocationInputValue}
          inputRef={locationInputRef}
        />
      </Box>
    </PopupBox>
  );
};

export default LocationModal;
