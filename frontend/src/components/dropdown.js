import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Button from "./buttons/button";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
// import ShareModal from "./shareModal";

const Dropdown = ({ options, btnStyle, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionSelect = (option) => {
    if (option === "Reserve this car") {
      return;
    } else if (option === "View car Details") {
      props.navigate(`/car/${props.car.id}`);
    } else if (option === "Change car") {
      props.handleChangeCar(props.car);
    }
    console.log("selected option", option);
  };

  ////SVG STYLE
  const svgStyle = {
    fontSize: "1.2rem",
  };

  // DROPDOWN MENU & OPTION STYLES
  const dropdownStyle = {
    listStyleType: "none",
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    marginTop: "5px",
    width: "max-content",
    overflow: "hidden",
    borderRadius: "20px",
    boxShadow: "var(--boxShadow2)",
  };
  const optionStyle = {
    cursor: "pointer",
    padding: "1rem",
  };

  return (
    <div
      style={{
        position: "relative",
      }}
      ref={dropdownRef}
    >
      <Button
        text={props.text ? props.text : "Actions"}
        style={
          props.style
            ? props.style
            : {
                ...btnStyle,
                display: "flex",
                alignItems: "center",
                gap: ".4rem",
              }
        }
        outlineStyle2={props.outlineStyle2}
        svg={
          props.svg ? (
            props.svg
          ) : isOpen ? (
            <IoIosArrowUp style={svgStyle} />
          ) : (
            <IoIosArrowDown style={svgStyle} />
          )
        }
        compare={props.compare}
        onClick={() => setIsOpen(!isOpen)}
      />
      <AnimatePresence>
        {isOpen &&
          (Array.isArray(options) ? (
            <motion.ul
              style={dropdownStyle}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {options.map((label, index) => (
                <li
                  key={index}
                  style={{
                    ...optionStyle,
                  }}
                  className={`dropdown-item`}
                  onClick={() => {
                    handleOptionSelect(label);
                    setIsOpen(false);
                  }}
                >
                  {label}
                </li>
              ))}
            </motion.ul>
          ) : (
            /// COMPARE
            <motion.div
              style={{
                ...dropdownStyle,
                marginTop: 0,
                left: "unset",
                right: 0,
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {Object.entries(options).map(([text, svg], index) => (
                <Button
                  key={index}
                  text={text}
                  svg={svg}
                  outlineStyle2={true}
                  style={{
                    borderRadius: 0,
                    display: "flex",
                    gap: ".5rem",
                    border: "none",
                    width: "100%",
                    ...optionStyle,
                  }}
                  onClick={() => {
                    if (text === "Share") {
                      props.setShowShareModal(true);
                      props.setPreventScroll(true);
                    } else if (text === "Print") {
                      window.print();
                    }
                  }}
                />
              ))}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
