import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
// import { drop } from "lodash";

const SearchInput = styled("input", {
  shouldForwardProp: (prop) =>
    prop !== "darkRoute" &&
    prop !== "border" &&
    prop !== "showDroplist" &&
    prop !== "rightPanel",
})(({ theme, darkRoute, border, showDroplist, rightPanel }) => ({
  backgroundColor: darkRoute
    ? showDroplist
      ? "white"
      : "var(--tileBG)"
    : "white",
  fontSize: "1rem",
  fontFamily: "Lato, sans-serif",
  letterSpacing: "-.25px",
  paddingLeft: "1rem",

  height: "100%",
  width: /*  rightPanel ? "100%" : */ /* "calc(100% - 57px)" */ "100%",
  borderRadius: showDroplist ? "8px 8px 0 0" : "8px",
  color: "var(--primaryColor)",
  borderTop: "none",
  paddingTop: "none",

  verticalAlign: "middle",
  display: "inline-block",

  "::placeholder": {
    opacity: border ? 0.6 : 1,
    transition: "opacity 0.5s ease-in-out",
  },
}));

// export default SearchInput;

// Input wrapper (wraps input & button)
const InputWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "darkRoute" && prop !== "distLocFilter",
})(({ darkRoute, distLocFilter }) => ({
  position: "relative",

  border: "none",
  height: "48px",
  width: distLocFilter ? "98%" : "100%",
  padding: 0,
  boxShadow: darkRoute ? "none" : "10px 10px 10px rgba(0,0,0,.2)",
  borderRadius: "8px",
  boxSizing: "border-box",
  // border: distLocFilter ? "1px solid green" : "",
  marginBlock: distLocFilter ? ".5rem .75rem" : "",
  marginInline: distLocFilter ? "auto" : "",
}));

// Border layer (abs -pos'd box wrapping the input)
const InputWrapperBorder = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "darkRoute" &&
    prop !== "border" &&
    prop !== "showDroplist" &&
    prop !== "rightPanelError",
})(({ darkRoute, border, showDroplist, rightPanelError }) => ({
  position: "absolute",
  zIndex: 5,
  width: !darkRoute ? "calc(100% - 8px)" : "100%",
  height: !darkRoute ? "calc(100% - 8px)" : "100%",
  top: !darkRoute ? "4px" : "0",
  left: !darkRoute ? "4px" : "0",
  backgroundColor: "transparent",
  outline: border
    ? rightPanelError
      ? "2px solid red"
      : "2px solid var(--invCardTitle)"
    : darkRoute
    ? "1px solid lightGrey"
    : "2px solid transparent",
  paddingTop: 0,
  borderRadius: darkRoute && showDroplist ? "5px 5px 0 0 " : "5px",
  display: "flex",
  // transition: "outline 0.5s ease-in-out",
  pointerEvents: "none",
}));

const droplistStyle = ({ darkRoute }) => ({
  marginLeft: darkRoute ? "-2px" : "0px",
  borderLeft: darkRoute ? "2px solid var(--invCardTitle)" : "",
  borderTop: "none",
  borderBottom: darkRoute ? "2px solid var(--invCardTitle)" : "",
  borderRight: darkRoute ? "2px solid var(--invCardTitle)" : "",
  borderRadius: "0 0 8px 8px",
  width: darkRoute ? "calc(100% + 4px)" : "100%",
});

// Search button
const SearchBtn = styled("button", {
  shouldForwardProp: (prop) => prop !== "darkRoute" && prop !== "showDroplist",
})(({ darkRoute, showDroplist }) => ({
  position: "absolute",
  right: 0,
  height: "48px",
  width: "100%",
  verticalAlign: "middle",
  display: "inline-block",
  maxWidth: "57px",
  border: "none",
  backgroundColor: darkRoute
    ? showDroplist
      ? "white"
      : "var(--tileBG)"
    : "white",
  borderRadius: showDroplist ? "0px 8px 0px 0px" : "0px 8px 8px 0px",
  padding: "unset",

  "&:hover": {
    cursor: "pointer",
    // backgroundColor: "white",
  },
}));

// instead of outline on the  droplist, create a 'droplist corralary to the inputWrapperBorder

// ✅ Named exports
export {
  SearchInput,
  InputWrapper,
  InputWrapperBorder,
  SearchBtn,
  droplistStyle,
};

/// trying to keep the LocationModal's Searchbar keep its focus (locationFocusRef.current = true) when the Searchbar's  .clearInputBtn <button/> is clicked,

//the Searchbar's 'handleOnBlur' (77) is being triggered by clicking the .clearInputBtn in addition to the inline 'onClick' handler of the <button/>
