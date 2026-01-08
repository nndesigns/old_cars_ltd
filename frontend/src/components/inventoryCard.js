import React, { useRef, useMemo, useEffect, useState } from "react";
import { keyframes, styled } from "@mui/material/styles";
import Card from "@mui/joy/Card";
import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { selectVehicle } from "../pages/selectedVehicleSlice.js";
import FeatSpecBox from "./featSpecBox.js";
import ShareModal from "./shareModal.js";

//MoreDropdown Icons
import { GoHeart } from "react-icons/go";
import { IoHeartDislikeSharp } from "react-icons/io5";
import { LuShare } from "react-icons/lu";
import { FaCar } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";

import { CiMenuKebab } from "react-icons/ci";
import { GrCheckmark } from "react-icons/gr";
import noImage_img from "../images/no_image.webp";
import ImgSlider from "./imgSlider";
import { toggleHeart } from "../user/favoritesSlice";
import ToggleHeartBtn from "./toggleHeart.js";
import { formatPrice } from "./utils.js";
import "./invCard.css";
//REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  addToCompare,
  removeFromCompare,
  selectCompareCars,
} from "../user/userSlice.js";
//
import { lockScroll, unlockScroll } from "../uiSlice.js";

// CONTAINER
export const StyledCard = styled(Card, {
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

//PULSE ANIMATION
const pulseOutline = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;
// MORE ADD COMP BTN WRAPPER
const MoreAddCompWrapper = styled("div")({
  position: "absolute",
  right: "10px",
  bottom: "10.25rem",
  borderRadius: "50%",
  height: "42px",
  width: "42px",
  zIndex: 2,
  overflow: "visible",
});
//3-DOT BTN
const MoreAddCompButton = styled("button")(({ comp, ...props }) => ({
  position: "relative",
  zIndex: 3,
  padding: ".5rem .65rem",
  borderRadius: "50%",
  backgroundColor: comp
    ? props.selectedCompare
      ? "var(--btnBG)"
      : "white"
    : "white",
  border: "1px solid var(--greyBorder)",
  transition: "border .2s ease",
  overflow: "visible",

  "& >svg": {
    transition: "fill .2s ease",
    position: "relative",
    zIndex: 4,
    color: comp ? (props.selectedCompare ? "white" : "grey") : "grey",
    fontSize: "1.25rem",
    fontWeight: "100",
  },

  /// PULSATING ::BEFORE (COMP)
  ...(comp && {
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "2px solid var(--btnBG)",
      animation: `${pulseOutline} 0.9s ease-out forwards`,
      // zIndex: -1,
      zIndex: 0,
      pointerEvents: "none",
    },
  }),
  // HOVER
  "&:hover": {
    cursor: "pointer",
    border: "1px solid var(--btnBG)",

    "& >svg": {
      color: comp
        ? props.selectedCompare
          ? "white"
          : "var(--btnBG)"
        : "var(--btnBG)",
    },
  },
  // "&:hover > svg": { fill: "var(--btnBG) !important" },
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
/* const MotionMoreDropdown = motion.create(
  styled(Box)(({ theme }) => ({
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
  }))
); */
const MotionMoreDropdown = motion(
  styled(Box)(({ theme }) => ({
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
  }))
);

const InventoryCard = ({
  carData,
  nearYou,
  favorites,
  style,
  showCompare,
  setShowCompare,
  // setCompareCars,
  // compareCars,
  // setPreventScroll,
}) => {
  const dispatch = useDispatch();
  const heartedCars = useSelector((state) => state.favorites.heartedCars);
  const isHearted = heartedCars.some((car) => car.id === carData.id); // or carData.stock
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef();
  const [moreClicked, setMoreClicked] = useState(false);

  // SCROLL
  const enableScrollLock = () => dispatch(lockScroll());
  const disableScrollLock = () => dispatch(unlockScroll());

  const [showShareModal, setShowShareModal] = useState(false);

  //Features & Specs
  const [showFeatSpec, setShowFeatSpec] = useState(false);

  // const [selectedCompare, setSelectedCompare] = useState(false);
  // ALL COMPARE CARS (REDUX)
  const compareCars = useSelector(selectCompareCars);
  const selectedCompare = compareCars.some((c) => c.id === carData.id);

  // REFS
  const dropdownRef = useRef(null);
  const buttonRef = useRef();
  const featBoxRef = useRef();

  // useEffect(() => {
  //   if (favorites || !Array.isArray(compareCars)) return;
  //   setSelectedCompare(compareCars.some((car) => car.id === carData.id));
  // }, [carData, compareCars, favorites]);

  const navigate = useNavigate();

  //CLOSE MORE DROPDOWN CLICKING AWAY
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If dropdown is open and click is outside of it
      if (
        moreClicked && //<MoreDropdown/> is showing
        dropdownRef.current && // MoreDropdown is being returned
        !dropdownRef.current.contains(event.target) && //click outside of <MoreDropdown/>
        buttonRef.current && // <MoreAddCompButton comp={false}/> is being returned
        !buttonRef.current.contains(event.target) && // click was outside the <MoreAddCompButton comp={false}/>
        !showFeatSpec &&
        !showShareModal
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
  }, [moreClicked, showFeatSpec, showShareModal]);

  const toggleHeartClick = (e) => {
    e.stopPropagation(); //for moreDropdown heart button
    dispatch(toggleHeart(carData));
  };

  // SELECT CAR (COMPARE PANEL)
  /*   const handleSelect = (e) => {
    setSelectedCompare((prev) => !prev);
    if(compareCars.includes(carData)){}

    setCompareCars((prev) => {
      // check if this car is already in the array (using id or unique key)
      const exists = prev.some((car) => car.id === carData.id);
      if (exists) {
        // remove it
        return prev.filter((car) => car.id !== carData.id);
      } else {
        // add it
        return [...prev, carData];
      }
    });
    e.stopPropagation();
  }; */

  const handleSelect = (e) => {
    e.stopPropagation();
    const exists = compareCars.some((c) => c.id === carData.id);
    if (exists) {
      dispatch(removeFromCompare(carData.id));
    } else {
      dispatch(addToCompare(carData));
    }
  };

  //OPEN COMPARE PANEL FROM MORE DROP DOWN
  const handleOpenCompare = (carObj) => {
    setShowCompare(true);
    // setCompareCars((prev) => [...prev, carObj]);
    setMoreClicked(false);
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
        if (!featBoxRef.current && !dropdownRef.current) {
          dispatch(selectVehicle(carData));
          navigate(`/car/${carData.id}`);
        }
      }}
    >
      <ImgSlider urls={memoizedUrls} isHovered={isHovered} nearYou={nearYou} />

      {/* <Heart hearted={isHearted} onClick={toggleHeartClick} /> */}
      <ToggleHeartBtn carObj={carData} />
      <MoreAddCompWrapper>
        {showCompare ? (
          // COMPARE CHECK
          <MoreAddCompButton
            comp={true}
            onClick={(e) => handleSelect(e)}
            selectedCompare={selectedCompare}
          >
            <GrCheckmark />
          </MoreAddCompButton>
        ) : (
          /**** MORE BUTTON ****/
          <MoreAddCompButton
            comp={false}
            ref={buttonRef}
            onClick={(e) => {
              setMoreClicked((prev) => !prev);
              e.stopPropagation(); // 👈 prevents parent card from navigating
            }}
          >
            <CiMenuKebab />
          </MoreAddCompButton>
        )}
      </MoreAddCompWrapper>

      {/**** MORE DROPDOWN ****/}
      <AnimatePresence>
        {moreClicked && (
          <MotionMoreDropdown
            ref={dropdownRef}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.12, ease: "easeIn" }}
          >
            <button className="moreItem" onClick={toggleHeartClick}>
              {isHearted ? <IoHeartDislikeSharp /> : <GoHeart />}{" "}
              {isHearted ? "Remove from" : "Add to"} favorites
            </button>
            <button
              className="moreItem"
              onClick={() => handleOpenCompare(carData)}
            >
              <IoGitCompareOutline />
              Compare
            </button>
            <button
              className="moreItem"
              onClick={() => {
                setShowShareModal(true);
                // dispatch(setPreventScroll(true));
                enableScrollLock();
              }}
            >
              <LuShare />
              Share
            </button>
            <button
              className="moreItem"
              onClick={() => {
                setShowFeatSpec(true);
                // dispatch(setPreventScroll(true));
                enableScrollLock();
              }}
            >
              <FaCar />
              Features & Specs
            </button>
          </MotionMoreDropdown>
        )}
      </AnimatePresence>
      <ShareModal
        car={carData}
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        // setPreventScroll={setPreventScroll}
        compare={false}
      />

      <FeatSpecBox
        carData={carData}
        setShowFeatSpec={setShowFeatSpec}
        featBoxRef={featBoxRef}
        showFeatSpec={showFeatSpec}
        // setPreventScroll={setPreventScroll}
        disableScrollLock={disableScrollLock}
        onClick={(e) => e.stopPropagation()}
      />

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
