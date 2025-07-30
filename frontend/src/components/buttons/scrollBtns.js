import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";

const buttonStyleLeft = (size) => ({
  margin: "0",
  padding: `${size === "sm" ? "14px 10px 14px 7px" : "40px 12px 40px 9px"}`,
  minWidth: "unset",
  position: "absolute",
  border: "none",
  borderRadius: "0px 12px 12px 0px",
  boxShadow: "5px 8px 15px -7px rgba(0, 0, 0, 0.4)",
  zIndex: "2",
  backgroundColor: "white",
});

const buttonStyleRight = (size) => ({
  ...buttonStyleLeft(size),
  padding: `${size === "sm" ? "14px 7px 14px 10px" : "40px 9px 40px 12px"}`,
  borderRadius: "12px 0px 0px 12px", // Flipped border radius
  boxShadow: "-5px 8px 15px -7px rgba(0, 0, 0, 0.4)",
  right: 0, // Aligns the button to the right
});

// Left Scroll Button
export const LeftScrollBtnSmall = ({ onClick }) => (
  <Button onClick={onClick} style={buttonStyleLeft("sm")} variant="outlined">
    <ArrowBackIosNewIcon style={{ fontSize: "1.2em" }} />
  </Button>
);

// Right Scroll Button
export const RightScrollBtnSmall = ({ onClick }) => (
  <Button onClick={onClick} style={buttonStyleRight("sm")} variant="outlined">
    <ArrowForwardIosIcon style={{ fontSize: "1.2em" }} />
  </Button>
);

/* export const LeftScrollBtnLarge = ({ onClick }) => (
  <Button onClick={onClick} style={buttonStyleLeft("lg")} variant="outlined">
    <ArrowBackIosNewIcon style={{ fontSize: "1.2em" }} />
  </Button>
);

// Right Scroll Button
export const RightScrollBtnLarge = ({ onClick }) => (
  <Button onClick={onClick} style={buttonStyleRight("lg")} variant="outlined">
    <ArrowForwardIosIcon style={{ fontSize: "1.2em" }} />
  </Button>
); */
// Left Scroll Button
export const LeftScrollBtnLarge = ({ onClick, customStyle = {} }) => (
  <Button
    onClick={onClick}
    style={{ ...buttonStyleLeft("lg"), ...customStyle }}
    variant="outlined"
  >
    <ArrowBackIosNewIcon style={{ fontSize: "1.2em" }} />
  </Button>
);

// Right Scroll Button
export const RightScrollBtnLarge = ({ onClick, customStyle = {} }) => (
  <Button
    onClick={onClick}
    style={{ ...buttonStyleRight("lg"), ...customStyle }}
    variant="outlined"
  >
    <ArrowForwardIosIcon style={{ fontSize: "1.2em" }} />
  </Button>
);
