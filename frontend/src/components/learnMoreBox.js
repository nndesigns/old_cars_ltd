import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import { styled } from "@mui/system"; // Using @mui/system for styling MUI Joy components

// Define styled component outside of function to avoid naming conflict

const StyledLearnMoreBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "under950",
})(({ under950 }) => ({
  padding: "25px",
  paddingRight: "9vw",
  backgroundColor: "var(--iconColor)",
  borderRadius: "10px",
  textAlign: "center",
  color: "white",
  width: under950 ? "100%" : "calc(48vw + 1%)",
  maxWidth: "100%",
  marginLeft: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: ".6rem",
  letterSpacing: ".2px",
  lineHeight: "25px",
  flexWrap: under950 ? "" : "wrap",
  flexDirection: under950 ? "column" : "row",
  alignItems: under950 ? "flex-start" : "center",
}));

/* const LearnLink = styled("a")(({ under950 }) => ({
  color: "white",
  marginTop: { under950 } ? "" : ".25rem",
  fontSize: ".95em",
})); */
const LearnLink = styled("a", {
  shouldForwardProp: (prop) => prop !== "under950",
})(({ under950 }) => ({
  color: "white",
  marginTop: under950 ? "" : ".25rem",
  fontSize: ".95em",
}));

const LearnMoreBox = () => {
  const [under950, setUnder950] = useState(window.innerWidth < 950);

  useEffect(() => {
    const handleResize = () => {
      //taking right arrow off Lifestyle carousel once all showing
      if (window.innerWidth >= 950) {
        setUnder950(false);
      } else if (window.innerWidth < 950) {
        setUnder950(true);
      }
    };
    // Attach event listener
    window.addEventListener("resize", handleResize);
    // Call once in case the window is already large
    handleResize();
    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const links = [
    { text: "Restoration help", href: "" },
    { text: "Auction resources", href: "" },
    { text: "Help Find My Car", href: "" },
  ];

  return (
    <StyledLearnMoreBox under950={under950}>
      <h2 style={{ fontSize: "var(--inBetween)" }}>Learn More</h2>
      {links.map((link, index) => (
        <React.Fragment key={index}>
          <LearnLink under950={under950} href={link.href}>
            {link.text}
          </LearnLink>
          {!under950 && index < links.length - 1 && (
            <b>
              <i>|</i>
            </b>
          )}
        </React.Fragment>
      ))}
    </StyledLearnMoreBox>
  );
};

export default LearnMoreBox;
