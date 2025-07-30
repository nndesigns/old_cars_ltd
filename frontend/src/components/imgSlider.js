import React, { useRef, useState, useEffect } from "react";
import { styled, keyframes } from "@mui/material/styles";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { Box } from "@mui/material";
import Button from "./buttons/button";

const fadeInFromCenterLeft = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeInFromCenterRight = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const arrowFadeInLeft = keyframes`
  from {
    transform: translateX(25) scale(1);
    opacity: 0;
  }
  to {
    transform: translateX(0px) scale(2);
    opacity: 1;
  }
`;

const arrowFadeInRight = keyframes`
  from {
    transform: translateX(-25px) scale(1);
    opacity: 0;
  }
  to {
    transform: translateX(0px) scale(2);
    opacity: 1;
  }
`;

const ImgSliderWrapper = styled("div")((props) => ({
  position: "relative",
  width: "100%",
  // height: props.favorites && props.isMobile ? undefined : "170px",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "5 / 3",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "120px",
    pointerEvents: "none",
    zIndex: 1,
    opacity: 0,
    transition: "opacity 0.3s ease-out",
  },
  "&::before": {
    left: 0,
    opacity: props.isHovered ? 1 : 0,
    animation: props.isHovered
      ? `${fadeInFromCenterLeft} 0.35s ease-out forwards`
      : "none",
    background: props.isHovered
      ? "linear-gradient(to right, rgba(46, 46, 46, 0.5), rgba(83, 105, 117, 0.1) 25%, rgba(255, 255, 255, 0) 50%)"
      : "none",
  },
  "&::after": {
    right: 0,
    opacity: props.isHovered ? 1 : 0,
    animation: props.isHovered
      ? `${fadeInFromCenterRight} 0.35s ease-out forwards`
      : "none",
    background: props.isHovered
      ? "linear-gradient(to left, rgba(46, 46, 46, 0.5), rgba(83, 105, 117, 0.1) 25%, rgba(255, 255, 255, 0) 50%)"
      : "none",
  },
}));

const Arrow = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isLeft" && prop !== "show",
})(({ isLeft, show }) => ({
  position: "absolute",
  top: "45%",
  transform: "translateY(-50%)",
  transition: "opacity 0.5s ease-out",
  opacity: show ? 1 : 0,
  animation: show
    ? `${isLeft ? arrowFadeInLeft : arrowFadeInRight} 0.35s ease-out forwards`
    : "none",
  cursor: "pointer",
  color: "white",
  zIndex: 2,
  filter: "drop-shadow(1px 2px 1px rgba(0, 0, 0, .7))",
  //   pointerEvents: "none", // prevent blocking hover detection on parent
  left: isLeft ? "17.5px" : undefined,
  right: isLeft ? undefined : "10px",
}));

const ViewMoreSlide = styled(Box)(({ theme }) => ({
  display: "flex",
  backgroundColor: "var(--iconColor)",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  width: "100%",
  objectFit: "cover",
  " & > Button": {
    background: "transparent !important",
    border: "1px solid white",
    "&:hover": {
      background: "rgba(0,0,0,.5) !important",
    },
  },
}));

const ImgSlider = ({ urls, cardHoveredRef, favorites }) => {
  const trackRef = useRef(null);
  const [animating, setAnimating] = useState(false);

  const [visualIndex, setVisualIndex] = useState(0);
  const transformStyle = `translateX(-${visualIndex * 100}%)`;
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const slides = urls.map((url) => ({ type: "image", content: url }));

  slides.push({ type: "viewMore" }); // add a special slide at the end

  const animateSlide = (dir) => {
    if (animating) return;
    setAnimating(true);
    const nextIndex =
      dir === "left"
        ? (visualIndex - 1 + slides.length) % slides.length
        : (visualIndex + 1) % slides.length;
    setVisualIndex(nextIndex); // visually slide first
    setTimeout(() => {
      setVisualIndex(nextIndex);
      setAnimating(false);
    }, 500);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setIsHovered(cardHoveredRef.current);
    }, 50); // poll every 50ms

    return () => clearInterval(id);
  }, [cardHoveredRef]);

  //// RETURN
  return (
    <ImgSliderWrapper
      isHovered={isHovered}
      favorites={favorites}
      isMobile={isMobile}
    >
      <div
        ref={trackRef}
        className="slider-track"
        style={{
          display: "flex",
          transform: transformStyle,
          transition: animating
            ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",

          width: `${slides.length * 100}%`,
          // border: "1px solid green",
          height: "100%",
          flex: "1 0 100%",
        }}
      >
        {slides.map((slide, idx) => {
          if (slide.type === "image") {
            return (
              <img
                key={idx}
                src={slide.content}
                alt="car_photo"
                style={{
                  flexShrink: 0,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            );
          } else if (slide.type === "viewMore") {
            return (
              <ViewMoreSlide key={idx}>
                <Button text="VIEW MORE" />
              </ViewMoreSlide>
            );
          } else {
            return null;
          }
        })}
      </div>
      {isHovered && visualIndex > 0 && (
        <Arrow
          as={MdArrowBackIos}
          isLeft={true}
          show={isHovered && visualIndex > 0}
          onClick={(e) => {
            e.stopPropagation(); // 🛑 Stop event from reaching parent
            animateSlide("left");
          }}
        />
      )}

      {isHovered && visualIndex !== slides.length - 1 && (
        <Arrow
          as={MdArrowForwardIos}
          show={isHovered}
          onClick={(e) => {
            e.stopPropagation(); // 🛑
            animateSlide("right");
          }}
        />
      )}
    </ImgSliderWrapper>
  );
};

export default React.memo(ImgSlider);
