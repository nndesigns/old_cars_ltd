import React, { useState } from "react";
import "./button.css";

const Button = ({
  text,
  disabled,
  style,
  outlineStyle,
  outlineStyle2,
  onClick,
  svg,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    filter: disabled
      ? "none"
      : isHovered
      ? outlineStyle || outlineStyle2 //no hover filter for outlineStyle 1 or 2
        ? ""
        : "brightness(1.35)"
      : "none", //not hovered
    backgroundColor: disabled
      ? "var(--disabledBtn)"
      : outlineStyle || outlineStyle2
      ? isHovered
        ? outlineStyle2
          ? "var(--btnBG)"
          : "transparent"
        : "transparent"
      : "var(--btnBG)",
    color: disabled
      ? ""
      : outlineStyle || outlineStyle2
      ? isHovered
        ? outlineStyle2
          ? "white"
          : "var(--btnBG)"
        : outlineStyle2
        ? "var(--btnBG)"
        : "var(--greyBorder)"
      : "white",
    cursor: disabled ? "not-allowed" : "pointer",
    border:
      outlineStyle || outlineStyle2
        ? isHovered
          ? "1px solid var(--btnBG)"
          : outlineStyle2
          ? "1px solid var(--btnBG)"
          : "1px solid var(--greyBorder)"
        : "",
    transition: outlineStyle
      ? "color .2s ease, border .1s ease"
      : outlineStyle2
      ? "color .2s ease, backgroundColor .25 ease-in, border .1s ease"
      : "",
    ...style,
  };

  return (
    <button
      className="buttonStyles"
      style={buttonStyle}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {svg}
      {text}
    </button>
  );
};

export default Button;
