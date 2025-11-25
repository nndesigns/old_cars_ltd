import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleHeart /* , cleanupHeartedCars */ } from "../user/favoritesSlice";
import Heart from "./heart";

import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

const toggleSpanStyle = {
  position: "fixed",
  zIndex: 50,
  fontSize: "1rem",
  letterSpacing: "1.1px",
  fontWeight: 550,
  bottom: "2rem",
  left: "50%",
  //   transform: "translateX(-50%)",
  padding: "1rem 2rem",
  backgroundColor: "var(--btnBG)",
  borderRadius: "13px",
  color: "white",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
};

const toggleLikeLinkStyle = {
  color: "white",
  textDecoration: "none",
  marginLeft: "1.5rem",
};

const ToggleHeartBtn = ({ carObj, vehPage }) => {
  const dispatch = useDispatch();
  const heartedCars = useSelector((state) => state.favorites.heartedCars);
  const [toggleLike, setToggleLike] = useState(false);
  //   const [isHearted, setIsHearted] = useState(
  //     heartedCars.some((car) => car.id === carObj.id)
  //   );

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(toggleHeart(carObj));
    setToggleLike((prev) => !prev);
    setTimeout(() => setToggleLike(false), 2000);
  };

  const posProps = vehPage
    ? { position: "static", top: "1px", right: "", left: "0" }
    : {};

  //   useEffect(() => {
  //     console.log(
  //       "latest isHearted",
  //       heartedCars.some((car) => car.id === carObj.id)
  //     );
  //     dispatch(cleanupHeartedCars());
  //   }, []);

  return (
    <>
      <Heart
        hearted={heartedCars.some((car) => car.id === carObj.id)}
        onClick={handleClick}
        {...posProps}
        /* position="static"
        top="1px"
        right=""
        left="0" */
      />
      <AnimatePresence>
        {toggleLike && (
          <motion.span
            //   className="toggleLikeSpan"
            style={toggleSpanStyle}
            initial={{ opacity: 0, scale: 0.3, y: 10, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.3, y: 10, x: "-50%" }}
            transition={{ duration: 0.25 }}
          >
            {heartedCars.some((car) => car.id === carObj.id) ? (
              <>
                Added to your favorites!{" "}
                <a style={toggleLikeLinkStyle} href="/favorites">
                  VIEW
                </a>
              </>
            ) : (
              "Removed from your favorites"
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
};

export default ToggleHeartBtn;
