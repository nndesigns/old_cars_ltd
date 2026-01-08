import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import { styled } from "@mui/material/styles";
import Button from "./buttons/button.js";
//SVG
import { IoClose } from "react-icons/io5";
import { GrCheckmark } from "react-icons/gr";
import { TfiArrowCircleRight } from "react-icons/tfi";
import { useSelector, useDispatch } from "react-redux";
import {
  addChosenCar,
  setChosenCars,
  removeChosenCar,
  removeFromCompare,
  selectChosenCars,
  selectCompareCars,
} from "../user/userSlice.js";

/// CONTAINER STYLE
const getPanelStyle = (mobile, below1030, showCompare) => ({
  position: "sticky",
  top: mobile ? "60px" : "78px",
  marginTop: showCompare
    ? ""
    : /*     : mobile
    ? "-70px" */
    below1030
    ? "-80px"
    : "-100px",
  // border: "1px solid orange",
  zIndex: 8,
  opacity: showCompare ? 1 : 0,
  backgroundColor: "white",
  paddingBlock: ".55rem",
  paddingInline: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // flexWrap: "wrap",
  gap: "5px",
  pointerEvents: showCompare ? "" : "none",
  transition: "margin-top .25s ease, opacity .7s ease",
});

const carBoxesOverflowContainer = {
  overflowX: "scroll",
  padding: ".45rem",
  scrollbarWidth: "none" /* Firefox */,
  msOverflowStyle: "none" /* IE and Edge */,
  maxWidth: "607px",
  position: "relative",
  // border: "1px solid green",
};
/// .carBoxes style
const CarBoxes = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  minWidth: "484px",
  // border: "1px solid aqua",
  width: "max-content",
};

/// CAR BOXES
const CarBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "below1030" && prop !== "bg",
})(({ bg, below1030 }) => ({
  height: below1030 ? "52px" : "70px",
  width: below1030 ? "72px" : "90px",
  position: "relative",
  borderRadius: "8px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  border: bg ? "1px solid var(--btnBGFaded)" : "1px solid var(--greyBorder)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: bg ? `url(${bg})` : "none",
}));

///SCROLL RIGHT ARROW
const ScrollRightArrow = styled("button")(({ theme }) => ({
  // your styles here
  position: "sticky",

  // top: "15px",
  marginTop: "3px",
  right: 0,
  background: "transparent",
  border: "none",
  display: "flex",

  "& svg": {
    width: "25px",
    height: "25px",
    color: "var(--btnBG)",
    background: "rgba(255,255,255, .7)",

    borderRadius: "50%",
    filter: "brightness(1.3)",
    cursor: "pointer",

    "&:hover": {
      color: "white",
      background: "var(--btnBG)",
    },
  },
}));

/// CHECK SVG
const checkSVGStyle = {
  fontSize: "1.5rem",
  color: "grey",
  border: "1px solid grey",
  height: "35px",
  width: "35px",
  padding: "5px",
  borderRadius: "50%",
};
/// CLOSE BUTTON
const closeBtnStyle = {
  position: "absolute",
  background: "transparent",
  top: "-.5rem",
  right: "-.5rem",
  borderRadius: "50%",
  height: "20px",
  width: "20px",
  border: "1px solid red",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    background: "rgba(255, 0, 0, 0.5)",
    "& >*": {
      color: "white",
    },
  },
};
const closeSVGStyle = {
  color: "red",
};

//
// COMPARE PANEL
//

const ComparePanel = ({
  showCompare,
  // compareCars,
  // chosenCars,
  // setCompareCars,
  // setChosenCars,
}) => {
  // REDUX
  const dispatch = useDispatch();
  const chosenCars = useSelector(selectChosenCars);
  const compareCars = useSelector(selectCompareCars);

  const [below1030, setBelow1030] = useState(window.innerWidth < 1030);
  const [mobile, setMobile] = useState(window.innerWidth < 820);

  const scrollContainerRef = useRef(null);
  const carBoxesRef = useRef(null);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkOverflow = () => {
    const container = scrollContainerRef.current;
    const content = carBoxesRef.current;
    if (container && content) {
      setShowRightArrow(content.scrollWidth > container.clientWidth);
    }
  };

  const handleScrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  /// RESIZE HANDLER
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 820);
      setBelow1030(window.innerWidth < 1030);
      checkOverflow();
    };
    // ✅ Add listener on mount
    window.addEventListener("resize", handleResize);
    // ✅ Call once immediately to handle edge cases
    handleResize();
    // ✅ Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /// RESIZE ARROWS
  useEffect(() => {
    checkOverflow();
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const buffer = 50; // trigger 50px before the actual edge
      const isAtRightEdge =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - buffer;

      setShowRightArrow(!isAtRightEdge);
    };
    // Add event listener
    container.addEventListener("scroll", handleScroll);
    // Run once initially
    handleScroll();
    // Cleanup
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [compareCars]);

  // AUTO-ASSIGNING CHOSEN CARS
  /*   useEffect(() => {
    if (compareCars.length >= 2 && chosenCars.length === 0) {
      dispatch(setChosenCars(compareCars.slice(0, 2)));
    }
  }, [compareCars, chosenCars]); */

  const navigate = useNavigate();

  const totalSlots = 6;
  const carSlots = [
    //IF CAR OBJ
    ...compareCars.map((car) => ({
      type: "car",
      id: car.id,
      image: car.imageArray?.[0] || null,
    })),
    // FILL REMAIINING W/ TYPE: PLACEHOLDER
    ...Array.from(
      { length: Math.max(totalSlots - compareCars.length, 0) },
      () => ({
        type: "placeholder",
      })
    ),
  ];

  //scenario
  // there are 3 'compareCars' objects (the 3rd is added in /cars or in the changeCar search)
  //the 'Compare' component initially auto-chooses which ([0] & [1]) become the 'chosenCars'
  //user uses 'ChangeCar' tool to  replace one of those 'chosenCars' with the 3rd 'compareCars' obj
  //user goes back to the /cars page, then removes that just-chosen 'chosenCars' object with 'handlerRemove'.

  //REMOVE BTN
  const handleRemove = (id) => {
    //Remove from compareCars
    // setCompareCars((prev) => prev.filter((car) => car.id !== id));
    dispatch(removeFromCompare(id));

    //remove from chosenCars (if in chosenCars), and replace with other compareCars obj (if available)
    /*if (chosenCars.length && chosenCars.some((car) => car.id === id)) {
      setChosenCars((prev) => prev.filter((car) => car.id !== id)
    )} */
    if (chosenCars.length && chosenCars.some((car) => car.id === id)) {
      dispatch(removeChosenCar(id));
    }

    //test with 3 compareCars
    //make the 3rd car'chosen' inside 'Compare', then go back to COmparePanel, remove that second chosenCar, and then go back into 'Compare' to see if the only other remaining compareCar was automatcially added to 'chosenCars' in its place

    /// test whether removed car exists inside of 'chosenCars', and remove it from chosenCars if so, replace with another compareCars obj if available
    //so that car object's don't remain inside of 'chosenCars' after having been removed from 'compareCars' in the ComparePanel remove button.
  };

  const handleGo = () => {
    // Extract the IDs
    const ids = compareCars.map((car) => car.id);
    // Create a query string
    const queryString = ids.join("+");
    // Navigate to the Compare route
    navigate(`/compare?cars=${queryString}`);
  };

  const panelStyle = useMemo(() => {
    // console.log("showCompare rec'd", showCompare);
    return getPanelStyle(mobile, below1030, showCompare);
  }, [mobile, below1030, showCompare]);

  return (
    <div style={panelStyle}>
      <div style={carBoxesOverflowContainer} ref={scrollContainerRef}>
        <div style={CarBoxes} ref={carBoxesRef}>
          {carSlots.map((slot, index) => (
            <CarBox key={index} bg={slot.image} below1030={below1030}>
              {slot.type === "car" && (
                <button
                  style={closeBtnStyle}
                  onClick={() => handleRemove(slot.id)}
                >
                  <IoClose style={closeSVGStyle} />
                </button>
              )}
              {slot.type === "placeholder" && (
                <GrCheckmark style={checkSVGStyle} />
              )}
            </CarBox>
          ))}
          {/* scroll  right btn  */}
          {showRightArrow && !mobile && (
            <ScrollRightArrow onClick={handleScrollRight}>
              <TfiArrowCircleRight />
            </ScrollRightArrow>
          )}
        </div>
      </div>
      {/* {showCompare && ( */}
      <Button
        text="Go"
        outlineStyle1={true}
        disabled={compareCars.length < 2}
        style={{
          border: compareCars.length < 2 ? "none" : "",
          padding: "1rem",
        }}
        onClick={handleGo}
      />
      {/*  )} */}
    </div>
  );
};

export default ComparePanel;
