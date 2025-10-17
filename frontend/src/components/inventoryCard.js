import React, { useRef, useMemo, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/joy/Card";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FeatSpecBox from "./featSpecBox.js";

//MoreDropdown Icons
import { GoHeart } from "react-icons/go";
import { IoHeartDislikeSharp } from "react-icons/io5";
import { LuShare } from "react-icons/lu";
import { FaCar } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";

import { CiMenuKebab } from "react-icons/ci";
import noImage_img from "../images/no_image.webp";
import ImgSlider from "./imgSlider";
import Heart from "./heart.js";
import { toggleHeart } from "../user/favoritesSlice";
import { formatPrice } from "./utils.js";
import "./invCard.css";

// CONTAINER
const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "nearYou" && prop !== "style",
})(({ theme, nearYou, style }) => ({
  padding: "0px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "0",
  minWidth: nearYou ? "245px" : "",
  transition:
    "border 0.3s ease-in, transform .12s ease-in, boxShadow .3s ease-in",
  ...style,
  "&:hover": {
    cursor: "pointer",
    border: "1px solid var(--btnBG)",
  },
}));
//3-DOT BTN
const MoreButton = styled("button")(() => ({
  position: "absolute",
  right: "10px",
  bottom: "10.25rem",
  padding: ".5rem .65rem",
  borderRadius: "50%",
  backgroundColor: "white",
  border: "1px solid var(--greyBorder)",
  transition: "border .2s ease",
  zIndex: 2,

  "& >svg": {
    transition: "fill .2s ease",
    fill: "grey",
    fontSize: "1.25rem",
    fontWeight: "100",
  },

  "&:hover": {
    cursor: "pointer",
    border: "1px solid var(--btnBG)",

    "& >svg": {
      fill: "var(--btnBG)",
    },
  },
}));
// IN BOTTOM BOX
//CONTAINER
const BottomBox = styled(Box)(({ theme, ...props }) => ({
  padding: "1rem",

  "& > *:not(:last-child)": {
    marginBottom: ".8rem",
  },
}));

// MORE DROPDOWN
const MoreDropdown = styled(Box, {
  shouldForwardProp: (prop) => prop !== "dropdownPosition",
})(({ theme }) => ({
  position: "absolute",
  paddingBlock: ".25rem",
  backgroundColor: "white",
  bottom: "-2rem",
  right: ".5rem",
  height: "192px",
  width: "250px",
  borderRadius: "8px",
  boxShadow: "var(--boxShadow2)",
  display: "flex",
  flexDirection: "column",
  zIndex: "3",
  overflow: "hidden",
}));

const InventoryCard = ({ carData, nearYou, favorites, style }) => {
  const dispatch = useDispatch();
  const heartedCars = useSelector((state) => state.favorites.heartedCars);
  const isHearted = heartedCars.some((car) => car.id === carData.id); // or carData.stock
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef();
  const [moreClicked, setMoreClicked] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef();
  const featBoxRef = useRef();

  //Features & Specs
  const [showFeatSpec, setShowFeatSpec] = useState(false);

  const navigate = useNavigate();

  //CLOSE MORE DROPDOWN CLICKING AWAY
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If dropdown is open and click is outside of it
      if (
        moreClicked && //<MoreDropdown/> is showing
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current && // its ref assignment is recognized
        !dropdownRef.current.contains(event.target) //click outside of <MoreDropdown/>
      ) {
        setMoreClicked(false);
      }
    };
    if (moreClicked) {
      window.addEventListener("click", handleClickOutside, true);
    }
    // Cleanup on unmount or when dropdown closes
    return () => {
      window.removeEventListener("click", handleClickOutside, true);
    };
  }, [moreClicked]);

  const toggleHeartClick = (e) => {
    e.stopPropagation(); //for moreDropdown heart button
    dispatch(toggleHeart(carData));
  };

  const titleStyle = {
    color: "var(--invCardTitle)",
    fontSize: ".975rem",
    lineHeight: "1.4",
    fontWeight: "400",
  };
  const priceStyle = {
    fontSize: "20px",
  };

  const memoizedUrls = useMemo(() => {
    if (!carData?.imageArray || carData.imageArray.length === 0) {
      return [noImage_img];
    }
    return carData.imageArray.slice(0, 5);
  }, [carData?.imageArray]);

  return (
    <StyledCard
      ref={cardRef}
      nearYou={nearYou}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // If FeatSpecBox is open AND the click was inside it, skip navigation
        if (featBoxRef.current && featBoxRef.current.contains(e.target)) {
          e.stopPropagation(); // prevent bubbling up
          return;
        }
        // Otherwise, proceed with navigation
        navigate(`/car/${carData.id}`);
      }}
    >
      <ImgSlider
        urls={memoizedUrls}
        isHovered={isHovered}
        favorites={favorites}
        nearYou={nearYou}
      />

      <Heart hearted={isHearted} onClick={toggleHeartClick} />
      {/**** MORE BUTTON ****/}
      <MoreButton
        ref={buttonRef}
        onClick={(e) => {
          // if (moreClicked == false) {
          //   setMoreClicked(true);
          // }
          setMoreClicked((prev) => !prev);
          e.stopPropagation(); // 👈 prevents parent card from navigating
        }}
      >
        <CiMenuKebab />
      </MoreButton>
      {/**** MORE DROPDOWN ****/}
      {moreClicked && (
        <MoreDropdown
          ref={dropdownRef}
          onClick={(e) => {
            e.stopPropagation(); // 👈 prevents parent card from navigating
          }}
        >
          <button className="moreItem" onClick={toggleHeartClick}>
            {isHearted ? <IoHeartDislikeSharp /> : <GoHeart />}{" "}
            {isHearted ? "Remove from" : "Add to"} favorites
          </button>
          <button className="moreItem">
            <IoGitCompareOutline />
            Compare
          </button>
          <button className="moreItem">
            <LuShare />
            Share
          </button>
          <button className="moreItem" onClick={() => setShowFeatSpec(true)}>
            <FaCar />
            Features & Specs
          </button>
        </MoreDropdown>
      )}
      {showFeatSpec && (
        <FeatSpecBox
          carData={carData}
          setShowFeatSpec={setShowFeatSpec}
          featBoxRef={featBoxRef}
        />
      )}
      <BottomBox>
        <h4 style={titleStyle}>
          {carData.year} {carData.make} <br />
          {carData.model.length > 20
            ? carData.model.slice(0, 20) + "..."
            : carData.model}
        </h4>
        <Box
          sx={{
            display: "flex",
            gap: ".5rem",
            alignItems: "center",
          }}
        >
          <h5 style={priceStyle}>{formatPrice(carData.price)}</h5>{" "}
          <span
            style={{
              color: "var(--greyBorder)",
              fontSize: "1.25em",
              fontWeight: "100",
            }}
          >
            |
          </span>{" "}
          <p>{Math.floor(Number(carData.mileage) / 1000)}K mi</p>
        </Box>
        <hr
          style={{
            border: "none",
            borderBottom: "1px solid var(--greyBorder)",
          }}
        />
        <p style={{ fontSize: "12px", color: "grey" }}>
          Available from a seller in <br /> {carData.city}, {carData.state}
        </p>
      </BottomBox>
    </StyledCard>
  );
};

export default InventoryCard;
