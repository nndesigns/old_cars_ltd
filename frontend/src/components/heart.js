import React from "react";
import { styled } from "@mui/material/styles";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";

const Heart = ({ hearted, onClick, ...props }) => {
  const heartColor = "#ff4e50";

  const HeartBtn = styled("button")(({ theme, hearted, ...props }) => ({
    // position: "absolute",
    position: props.position ?? "absolute",
    backgroundColor: "transparent",
    border: "none",
    top: props.top ?? ".4rem",
    right: props.right ?? ".4rem",
    left: props.left ?? "",
    zIndex: "2",

    "& > svg": {
      height: "2rem",
      width: "2rem",
      top: ".4rem",
      right: ".4rem",

      "&:first-of-type": {
        fill: hearted ? heartColor : "var(--tileBG)",
        zIndex: "1",
      },

      ":nth-of-type(2)": {
        fill: hearted ? heartColor : "var(--greyBorder)",
        position: "absolute", //in order to be on top of first-child?
        // top: 0,
        // right: 0,
        top: props.top ?? 0,
        right: props.right ?? 0,
        left: props.left ?? "",
        zIndex: "2",
        pointerEvents: "none",
      },
    },

    //when  you hover the button parent
    "&:hover": {
      cursor: "pointer",
      "& > svg": {
        ":nth-of-type(2)": {
          fill: heartColor,
        },
      },
    },
  }));

  return (
    <HeartBtn hearted={hearted} onClick={onClick} {...props}>
      <GoHeartFill />
      <GoHeart />
    </HeartBtn>
  );
};

export default Heart;
