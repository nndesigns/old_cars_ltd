import React from "react";
import { motion } from "framer-motion";

const styleContainer = {
  position: "relative",
  height: 50,
};

const styleSpan = {
  display: "block",
  width: 70,
  height: 70,
  border: "7px solid rgba(249, 88, 65, .3)",

  borderTop: "7px solid var(--btnBG)",
  borderRadius: "50%",
  boxSizing: "border-box",
  marginTop: "-6.5rem",
  marginLeft: "-2.2rem",
};

const spinTransition = {
  repeat: Infinity,
  ease: "easeInOut",
  duration: 1,
};

export const LoadingSpinner = ({ style = {} }) => {
  return (
    <div style={styleContainer}>
      <motion.span
        style={{ ...styleSpan, ...style }}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
    </div>
  );
};
