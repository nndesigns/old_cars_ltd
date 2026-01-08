import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import { IoClose } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { styled } from "@mui/material/styles";

// import { AnimatePresence } from "motion/react";
// import { createPortal } from "react-dom";
// import * as motion from "motion/react-client";
import { motion, AnimatePresence } from "framer-motion";
import "./invCard.css";

import { mileageFormatter, stateToStateMap } from "./utils";

const vinCopiedSpanStyles = {
  position: "fixed",
  zIndex: 50,
  fontSize: "1em",
  marginTop: "-.5rem",
  marginLeft: "3rem",
  padding: ".7rem 1rem",
  backgroundColor: "var(--btnBG)",
  borderRadius: "13px",
  color: "white",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
};

const title_hr_style = {
  border: "none",
  borderTop: "1px solid #ccd0d6",
  display: "block",
};
const spec_hr_style = {
  border: "none",
  borderTop: "1px solid rgba(0,0,0, .17)",
};

const specRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "1.1rem .8rem",
  width: "100%",
  fontSize: ".85em",
  color: "var(--primaryColor)",
};

const gridCellStyle = {
  display: "flex",
  //   justifyContent: "center",
  alignItems: "center",
  padding: "1rem .8rem",
  fontSize: ".85em",
  color: "var(--primaryColor)",
  //   border: "1px solid red",
};

const h4_style = {
  fontSize: ".95em",
  marginBottom: ".25rem",
};

const SectionBoxContainer = styled(Box)(({ theme, ...props }) => ({
  marginBottom: "1rem",
}));

/// LOCAL UTILS
const formatStyle = (styleString) => {
  if (!styleString || typeof styleString !== "string") return "";

  // If the string contains commas, split it
  if (styleString.includes(",")) {
    return styleString
      .split(",") // → ["luxury", "sedan"]
      .map((s) => s.trim()) // remove extra spaces
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1)) // capitalize
      .join(" "); // → "Luxury Sedan"
  } else {
    // No commas: just capitalize the single word
    return styleString.charAt(0).toUpperCase() + styleString.slice(1);
  }
};

const getEngineSpec = (eng, part) => {
  if (!eng || typeof eng !== "string") return "";

  // Split once at the space
  const parts = eng.split(" ");

  if (part === "cyl") {
    return parts[0]; // everything before the space
  } else if (part === "size") {
    return parts[1]; // everything after the space
  } else {
    return ""; // default if 'part' argument is something else
  }
};

const driveTrainMap = {
  AWD: "All Wheel Drive",
  FWD: "FrontWheel Drive",
  RWD: "Rear Wheel Drive",
};

// Functional Component
const SectionBox = ({ title, specs, grid, ...props }) => {
  return (
    <SectionBoxContainer {...props}>
      {/* Title/header section (not part of grid) */}
      {title && <h4 style={h4_style}>{title}</h4>}
      <hr style={title_hr_style} />

      {/* Wrap grid or list content in a separate container */}
      <div
        style={
          grid
            ? {
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }
            : { display: "flex", flexDirection: "column" }
        }
      >
        {grid
          ? specs.map((spec, index) => (
              <div style={gridCellStyle} key={index}>
                {spec}
              </div>
            ))
          : specs.map(({ prop, value }, index) => (
              <React.Fragment key={index}>
                <div style={specRowStyle}>
                  <span>{prop}</span> <span>{value}</span>
                </div>
                {index < specs.length - 1 && <hr style={spec_hr_style} />}
              </React.Fragment>
            ))}
      </div>
    </SectionBoxContainer>
  );
};

const FeatSpecBox = ({
  carData,
  showFeatSpec,
  setShowFeatSpec,
  featBoxRef,
  // setPreventScroll,
  disableScrollLock,
}) => {
  const [copied, setCopied] = useState(false);
  const [keyFeaturesArray, setKeyFeaturesArray] = useState([]);
  const [highlightsArray, setHighlightsArray] = useState([]);
  const [featuresArray, setFeaturesArray] = useState([]);

  //// BASE SPECS
  const baseSpecs = {
    Body: formatStyle(carData.style),
    Mileage: mileageFormatter(carData.mileage),
    "City,State": `${carData.city}, ${stateToStateMap[carData.state]}`,
    "Prior Use": carData.prev_owners,
    "City/Highway MPG": `${carData.mpg_city}/${carData.mpg_hwy}`,
  };
  /// COLOR SPECS
  const colorSpecs = {
    Color: carData.color,
  };
  //// ENGINE SPECS
  const engineSpecs = {
    "Engine Size": getEngineSpec(carData.engine, "size"),
    "Engine Type": "Gas",
    "Engine Torque": "192/1800 RPM",
    Horsepower: "200/6000 RPM",
    Cylinders: getEngineSpec(carData.engine, "cyl"),
    "Drive Train": driveTrainMap[carData.drive_type],
    Transmission: carData.transmission,
  };

  const classicCarFeatures = [
    "Air Conditioning",
    "Leather Interior",
    "Full Maintenance History",
    "Turbo Charged Engine",
    "Alloy Wheels",
    "Power Windows",
    "AM/FM Radio",
    "Power Mirrors",
    "Satellite Radio Ready",
    "Rear Spoiler",
    "Side Airbags",
    "Front Airbags",
    "Traction Control",
    "Power Locks",
    "Overhead Airbags",
    "Cruise Control",
    "ABS Brakes",
    "Auxillary Audio Input",
    "Parking Sensors",
    "Bluetooth Technology",
    "Front Seat Heaters",
    "Accident Free",
    "Original Paint",
    "Rust-Free Body",
    "Refinished Interior",
    "Show-Quality Finish",
    "Power Steering",
    "Fuel Injection Conversion",
    "Garage Kept",
    "Original Upolstery",
    "Collector Owned",
    "Factory Color Combination",
    "Fully Restored",
    "Matching Numbers",
    "Electronic Ignition Upgrade",
    "Highly Optioned",
    "Limited Production Model",
    "Award-Winning Restoration",
    "Custom Exhaust",
  ];

  const getRandomFeatures = (num) => {
    // Make a shallow copy so we don’t mutate the original array
    const shuffled = [...classicCarFeatures].sort(() => 0.5 - Math.random());

    // Return the first `num` elements from the shuffled array
    return shuffled.slice(0, num);
  };

  //// SET KEY FEATURES, HIGHLIGHTS, & ALL FEATURES
  useEffect(() => {
    if (!carData) return;

    const keyFeatures = []; //random 4 + 2 tests
    const highlights = []; //mileage, single owner
    const features = []; //random 16

    // --- ✅ KEY FEATURES CONDITIONS ---
    const rand6 = getRandomFeatures(6);
    keyFeatures.push(...rand6);
    // Example: based on carData.style
    if (carData.style?.toLowerCase().includes("convertible")) {
      keyFeatures.push("Cabriolet (Drop-Top)");
    }

    if (
      carData.style?.toLowerCase().includes("convertible") &&
      carData.style?.toLowerCase().includes("coupe")
    ) {
      keyFeatures.push("Roadster");
    }

    // --- ✅ HIGHLIGHTS CONDITIONS ---
    const rand4 = getRandomFeatures(4);
    highlights.push(...rand4);
    if (carData.mileage < 50000) {
      highlights.push("Low Mileage");
    }

    if (carData.prev_owners === 1) {
      highlights.push("Single Owner");
    }

    if (carData.price < 20000 && carData.style.includes("luxury")) {
      highlights.push("Affordable Luxury");
    }

    // --- FEATURES ---
    const rand16 = getRandomFeatures(16);
    features.push(...rand16);
    // --- ✅ Assign the arrays to state ---
    setKeyFeaturesArray(keyFeatures);
    setHighlightsArray(highlights);
    setFeaturesArray(features);
  }, [carData]);

  const close = (e) => {
    setShowFeatSpec(false);
    // setPreventScroll(false);
    disableScrollLock();
    e.stopPropagation();
  };

  const handleCopyVin = () => {
    navigator.clipboard
      .writeText(carData.vin)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2 sec
      })
      .catch((err) => console.error("Copy failed", err));
  };

  return (
    <AnimatePresence>
      {showFeatSpec && (
        <motion.div
          key="featSpecBG"
          className="featSpecBG"
          ref={featBoxRef}
          onClick={(e) => {
            close(e);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            key="featSpecModal"
            className="spec_box"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>About this car</h2>
            <IoClose onClick={close} className="closeBtn" />
            <button className="vinCopyBtn" onClick={handleCopyVin}>
              <IoCopyOutline /> VIN {carData.vin}
            </button>
            {/** VIN COPIED ANIMATION*/}
            <AnimatePresence>
              {copied && (
                <motion.span
                  key="vinCopied"
                  style={vinCopiedSpanStyles}
                  initial={{ opacity: 0, scale: 0.3, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.3, y: 10 }}
                  transition={{ duration: 0.1 }}
                >
                  VIN Copied!
                </motion.span>
              )}
            </AnimatePresence>
            {/* BASE SPECS */}
            <SectionBox
              grid={false}
              title="Base Specifications"
              specs={Object.entries(baseSpecs).map(([key, value]) => ({
                prop: key,
                value: value,
              }))}
            />
            {/* COLOR */}
            <SectionBox
              grid={false}
              title="Color"
              specs={Object.entries(colorSpecs).map(([key, value]) => ({
                prop: key,
                value: value,
              }))}
            />
            {/* ENGINE */}
            <SectionBox
              grid={false}
              title="Engine"
              specs={Object.entries(engineSpecs).map(([key, value]) => ({
                prop: key,
                value: value,
              }))}
            />
            {/* KEY FEATURES */}
            <SectionBox
              grid={true}
              title="Key Features"
              specs={keyFeaturesArray}
            />

            {/* HIGHLIGHTS */}
            <SectionBox
              grid={true}
              title="Highlights"
              specs={highlightsArray}
            />
            {/* FEATURES */}
            <SectionBox
              grid={true}
              title="All Features"
              specs={featuresArray}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatSpecBox;
