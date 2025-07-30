// import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import Card from "@mui/joy/Card";

const CustomCard = styled(Card, {
  shouldForwardProp: (prop) =>
    prop !== "modelUse" && prop !== "lastCard" && prop !== "style",
})(({ theme, style, modelUse, lastCard, ...props }) => ({
  minWidth: modelUse ? "310px" : "",
  marginTop: modelUse ? "1.2rem" : "",
  height: modelUse ? (lastCard ? "120px" : "") : "",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: lastCard ? "center" : "space-between",
  overflow: "hidden",
  lineHeight: "0px",
  paddingLeft: lastCard ? "0px" : "2rem",
  paddingRight: "0",
  paddingBlock: "0",
  backgroundColor: lastCard ? "transparent" : "var(--tileBG)",
  border: lastCard ? "1px solid var(--greyBorder)" : "1px solid transparent",
  borderRadius: "4px",
  transition:
    "transform .2s ease, boxShadow .2s ease, color .2s ease, border .1s ease",
  ...style,

  // HOVER
  "&:hover": {
    transform: modelUse ? "none" : lastCard ? "none" : "translateY(-3px)",
    boxShadow: modelUse
      ? "none"
      : lastCard
      ? "none"
      : "0 10px 16px -10px rgba(42,52,61,.4)",
    color: lastCard ? "var(--btnBG) !important" : "",
    cursor: "pointer",
    border: "1px solid var(--btnBG) !important",
  },

  "& > h3": {
    fontSize: lastCard ? "" : "1.1em",
    letterSpacing: lastCard ? "" : "-.5px",
  },
}));

const MakeCard = styled(Card, {
  shouldForwardProp: (prop) =>
    prop !== "under950" && prop !== "image" && prop !== "lastCard",
})(({ theme, image, lastCard, ...props }) => ({
  height: "325px",
  minWidth: "260px",
  padding: "0px !important",
  fontSize: ".8rem",
  border: "none",
  boxShadow: 3,
  backgroundColor: lastCard ? "#f0f3f8" : "",
  backgroundImage: lastCard
    ? "none"
    : `
  linear-gradient(
    150deg,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.54) 15%,
    rgba(0, 0, 0, 0.38) 25%,
    rgba(0, 0, 0, 0.11) 40%,
    rgba(0, 0, 0, 0) 50%
  ),
  url(${image})
`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",

  backgroundPosition: "bottom",
  overflowX: "hidden",
  zIndex: 2,
  borderRadius: "5px",
  gap: 0,
  position: "relative",
  justifyContent: lastCard ? "center" : "",

  transition: "transform 0.25s ease-out, filter 0.25s ease-out",
  "&:hover": {
    cursor: "pointer",
    /*     filter: "brightness(1..05)", */
    transform: "translateY(-.75rem)",
    boxShadow: "0 24px 30px -24px rgba(42,52,61,.4)",
  },
}));

const LifestyleCard = styled(Card)(({ theme, image, ...props }) => ({
  height: "321px", //set height
  minWidth: "270px",
  p: "20px",
  fontSize: ".8rem",
  border: "none",
  boxShadow: 3,
  backgroundColor: "var(--primaryColor)",
  backgroundImage: `url(${image})`,
  backgroundSize: "cover", // Optional: makes sure the image covers the card
  backgroundPosition: "center",
  overflowX: "hidden",
  zIndex: 2,
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  position: "relative",
  transition: "transform 0.25s ease-out",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent", // Initial transparent state
    pointerEvents: "none",
    transition: "background-color 0.25s ease-out", // Transition for the background color change
  },

  "&:hover": {
    cursor: "pointer",
    transform: "translateY(-.75rem)",
    boxShadow: "0 24px 30px -24px rgba(42,52,61,.4)",

    "&::after": {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
  },

  "& .MuiTypography-root": {
    fontWeight: "700",
    fontSize: "1.3rem",
    letterSpacing: "-.25px",
    zIndex: "2",
    position: "relative",
    color: "white",
    bottom: "0",
  },
}));

// const StyleCard = styled(Card)(({ theme, showArrows }) => ({
const StyleCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "showArrows" && prop !== "forCarsPage",
})(({ showArrows, forCarsPage }) => ({
  height: "auto",
  padding: showArrows
    ? ".5rem !important"
    : forCarsPage
    ? ".5rem"
    : "0rem !important",
  fontSize: ".8rem",
  border: forCarsPage ? "1px solid lightgrey" : "2px solid transparent",
  backgroundColor: "#f3f5f9",

  // Apply conditional styles based on forCarsPage
  ...(forCarsPage && {
    backgroundColor: "none",
    height: "9.75rem",
    width: "9.75rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    overflow: "hidden",

    "& > .MuiAspectRatio-root": {
      transition: "transform 0.13s ease-in", // translateY
    },
    "& > .arrow_icon": {
      transition: "transform 0.1s ease-in", // translateY
    },
  }),
  "&:hover": {
    cursor: "pointer",
    border: forCarsPage ? "1px solid var(--btnBG)" : "2px solid var(--btnBG)",

    //<AspectRatio/>
    "& > .MuiAspectRatio-root": {
      transform: forCarsPage ? "translateY(-30px)" : "none",
    },
  },
}));

export { CustomCard, MakeCard, LifestyleCard, StyleCard };
