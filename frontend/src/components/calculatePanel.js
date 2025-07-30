import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/joy/Box";
import { IoCloseOutline } from "react-icons/io5";

const panelRootStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.4)",
  zIndex: 999,
};

const closeXStyle = {
  cursor: "pointer",
  position: "absolute",
  top: "1rem",
  right: "1rem",
  fontSize: "1.5rem",
};

const panelH3Style = {
  marginBlock: "1.2rem",
  fontSize: "1.65em",
  color: "var( --invCardTitle)",
  letterSpacing: "0px",
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "tween", duration: 0.375 },
  },
  exit: {
    x: "100%",
    transition: { type: "tween", duration: 0.375 },
  },
};

const CalculatePanel = ({ show, setShowRightPanel }) => {
  const [under900, setUnder900] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setUnder900(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const calculatorPanelStyle = {
    height: "100%",
    backgroundColor: "white",
    position: "relative",
    width: under900 ? "100%" : "23.5rem",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
    paddingInline: "1.875rem",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          style={panelRootStyle}
          onClick={() => setShowRightPanel(false)}
        >
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={calculatorPanelStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <IoCloseOutline
              style={closeXStyle}
              onClick={() => setShowRightPanel(false)}
            />
            <h3 style={panelH3Style}>Can You Afford It?</h3>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalculatePanel;
