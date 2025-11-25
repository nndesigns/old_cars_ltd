import React from "react";
import Box from "@mui/material/Box";
import ToggleHeartBtn from "./toggleHeart.js";
import { LuCalculator } from "react-icons/lu";

const LikeCalcBox = ({
  heartedCount,
  setShowRightPanel,
  carData,
  detailSection,
}) => {
  const detailSectionStyles = {
    position: "absolute",
    right: "25px",
    top: "1.65rem",
  };

  return (
    <Box className="like_calc_box" style={detailSection && detailSectionStyles}>
      <span className="favCountBubble">{heartedCount}</span>
      <ToggleHeartBtn carObj={carData} vehPage={true} />

      <LuCalculator
        className="like_calc_svg"
        onClick={() => setShowRightPanel(true)}
      />
    </Box>
  );
};

export default LikeCalcBox;
