import React from "react";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { toggleHeart } from "../user/favoritesSlice";
import { LuCalculator } from "react-icons/lu";
import Heart from "../components/heart.js";

const LikeCalcBox = ({
  heartedCount,
  setShowRightPanel,
  carData,
  setToggleLike,
  isHearted,
  detailSection,
}) => {
  const dispatch = useDispatch();

  const toggleHeartClick = () => {
    dispatch(toggleHeart(carData));
    setToggleLike(true);
    setTimeout(() => setToggleLike(false), 2000);
  };

  const detailSectionStyles = {
    position: "absolute",
    right: "25px",
    top: "1.65rem",
  };

  return (
    <Box className="like_calc_box" style={detailSection && detailSectionStyles}>
      <span className="favCountBubble">{heartedCount}</span>
      <Heart
        hearted={isHearted}
        onClick={toggleHeartClick}
        position="static"
        top="1px"
        right=""
        left="0"
      />

      <LuCalculator
        className="like_calc_svg"
        onClick={() => setShowRightPanel(true)}
      />
    </Box>
  );
};

export default LikeCalcBox;
