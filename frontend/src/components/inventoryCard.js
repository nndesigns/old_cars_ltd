import React, { useRef, useMemo } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/joy/Card";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CiMenuKebab } from "react-icons/ci";
import noImage_img from "../images/no_image.webp";
import ImgSlider from "./imgSlider";
import Heart from "./heart.js";
import { toggleHeart } from "../user/favoritesSlice";
import { formatPrice } from "./utils.js";

const InventoryCard = ({ carData, nearYou, favorites }) => {
  const cardHoveredRef = useRef(false);
  const dispatch = useDispatch();
  const heartedCars = useSelector((state) => state.favorites.heartedCars);
  const isHearted = heartedCars.some((car) => car.id === carData.id); // or carData.stock

  const navigate = useNavigate();

  // const priceFormatter = function (value) {
  //   return value.toLocaleString("en-US");
  // };

  // CONTAINER
  const StyledCard = styled(Card)(({ theme }) => ({
    padding: "0px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "0",
    minWidth: nearYou ? "245px" : "",
    overflow: "hidden",
    transition:
      "border 0.3s ease-in, transform .12s ease-in, boxShadow .3s ease-in",

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

  const toggleHeartClick = () => {
    dispatch(toggleHeart(carData));
  };

  // IN BOTTOM BOX
  //CONTAINER
  const BottomBox = styled(Box)(({ theme, ...props }) => ({
    padding: "1rem",

    "& > *:not(:last-child)": {
      marginBottom: ".8rem",
    },
  }));

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
  // console.log("memoizedUrls", memoizedUrls);
  return (
    <StyledCard
      onMouseEnter={() => (cardHoveredRef.current = true)}
      onMouseLeave={() => (cardHoveredRef.current = false)}
      onClick={() => navigate(`/car/${carData.id}`)}
    >
      <ImgSlider
        urls={memoizedUrls}
        cardHoveredRef={cardHoveredRef}
        // nearYou={nearYou}
        favorites={favorites}
      />

      <Heart hearted={isHearted} onClick={toggleHeartClick} />
      <MoreButton>
        <CiMenuKebab />
      </MoreButton>
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
          <h5 style={priceStyle}>
            {/* {priceFormatter(Number(carData.price))}* */}
            {formatPrice(carData.price)}
          </h5>{" "}
          <span
            style={{
              color: "var(--greyBorder)",
              fontSize: "1.25em",
              fontWeight: "100",
            }}
          >
            |
          </span>{" "}
          <p /* style={{ fontSize: ".97em" }} */ /* style={priceStyle} */>
            {Math.floor(Number(carData.mileage) / 1000)}K mi
          </p>
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
