import React from "react";
import { StyledCard } from "./inventoryCard";

const skeletonCardStyle = {
  border: "none",
  height: "clamp(340px, 28vh, 440px)",
};

const InventoryCardSkeleton = () => {
  return <StyledCard style={skeletonCardStyle} className="load" />;
};

export default InventoryCardSkeleton;
