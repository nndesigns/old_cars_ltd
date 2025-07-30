import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";

import { handleScroll } from "./utils.js";
import { LeftScrollBtnSmall, RightScrollBtnSmall } from "./buttons/scrollBtns";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const PriceCarousel = ({ setAppliedFilters, setOrderedFilters }) => {
  const navigate = useNavigate();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); //600px

  const handleRangeBtnClick = (range) => {
    let minPrice = null;
    let maxPrice = null;

    if (range.startsWith("Under")) {
      // Example: "Under $15,000"
      const match = range.match(/\$([\d,]+)/);
      if (match) {
        maxPrice = parseInt(match[1].replace(/,/g, ""), 10);
      }
    } else if (range.endsWith("and above")) {
      // Example: "$35,000 and above"
      const match = range.match(/\$([\d,]+)/);
      if (match) {
        minPrice = parseInt(match[1].replace(/,/g, ""), 10);
      }
    } else {
      // Example: "$30,000-$35,000"
      const match = range.match(/\$([\d,]+)-\$([\d,]+)/);
      if (match) {
        minPrice = parseInt(match[1].replace(/,/g, ""), 10);
        maxPrice = parseInt(match[2].replace(/,/g, ""), 10);
      }
    }

    // Now set filters:
    setAppliedFilters((prev) => ({
      ...prev,
      ...(minPrice !== null ? { minPrice } : {}),
      ...(maxPrice !== null ? { maxPrice } : {}),
    }));

    setOrderedFilters((prev) => {
      const updated = [...prev];
      if (minPrice !== null && !updated.includes("minPrice")) {
        updated.push("minPrice");
      }
      if (maxPrice !== null && !updated.includes("maxPrice")) {
        updated.push("maxPrice");
      }
      return updated;
    });

    // Then navigate:
    navigate("/cars");
  };

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const wrapperBox = document.querySelector(".wrapper_box");

    const updateButtonVisibility = () => {
      if (!scrollContainer || !wrapperBox) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const wrapperWidth = wrapperBox.clientWidth;

      setCanScrollLeft(Math.ceil(scrollLeft) > 0);
      setCanScrollRight(
        Math.floor(scrollLeft + clientWidth) < scrollWidth - 1 ||
          (wrapperWidth < scrollWidth &&
            Math.floor(scrollLeft + clientWidth) < scrollWidth - 1)
      );
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateButtonVisibility);
      window.addEventListener("resize", updateButtonVisibility);
      // Trigger once on mount to set initial state
      updateButtonVisibility();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", updateButtonVisibility);
        window.removeEventListener("resize", updateButtonVisibility);
      }
    };
  }, []);

  const btn_data = [
    "Under $15,000",
    "Under $20,000",
    "$20,000-$25,000",
    "$25,000-$30,000",
    "$30,000-$35,000",
    "$35,000 and above",
  ];

  const RangeBtn = styled(Button)(({ theme }) => ({
    backgroundColor: "var(--tileBG)",
    borderRadius: "18px",
    border: "2px solid transparent",
    textTransform: "none",
    color: "inherit",
    minWidth: "max-content",
    paddingInline: "1.2em",

    "&:hover": {
      border: "2px solid var(--btnBG)",
      cursor: "pointer",
    },
  }));

  return (
    <div className="wrapper_box" style={{ marginBottom: "1.5rem" }}>
      {canScrollLeft && (
        <LeftScrollBtnSmall
          onClick={() => handleScroll(scrollContainerRef, -1)}
        />
      )}
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          gap: 1,
          overflow: "auto",
          height: "100%",

          "& > *": {},
          "::-webkit-scrollbar": { display: "none" },
          // ::BEFORE
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            height: "100%",
            width: "100%",
            boxShadow: `
  ${canScrollLeft ? "inset 20px 0 15px -10px rgba(0,0,0,0.3)" : ""}
  ${canScrollLeft && canScrollRight ? "," : ""}
  ${canScrollRight ? "inset -20px 0 15px -10px rgba(0,0,0,0.3)" : ""}
`,
            pointerEvents: "none", // Allows pointer events to pass through
            zIndex: 1, // Higher than cards but allows hover
          },
        }}
        ref={scrollContainerRef}
      >
        {btn_data.map((string) => (
          <RangeBtn key={string} onClick={() => handleRangeBtnClick(string)}>
            {string}
          </RangeBtn>
        ))}
      </Box>
      {canScrollRight && (
        <RightScrollBtnSmall
          onClick={() => handleScroll(scrollContainerRef, 1)}
        />
      )}
    </div>
  );
};

export default PriceCarousel;
