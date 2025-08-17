import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const SearchInput = styled("input", {
  shouldForwardProp: (prop) =>
    prop !== "darkRoute" && prop !== "border" && prop !== "showDroplist",
})(({ theme, darkRoute, border, showDroplist }) => ({
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
  width: "calc(100% - 57px)",
  borderRadius: "8px 0 0 8px",
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

// Input wrapper (outer container)
const InputWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "darkRoute",
})(({ darkRoute }) => ({
  position: "relative",
  border: "none",
  height: "48px",
  width: "100%",
  padding: 0,
  boxShadow: darkRoute ? "none" : "10px 10px 10px rgba(0,0,0,.2)",
  borderRadius: "8px",
  boxSizing: "border-box",
}));

// Border layer
const InputWrapperBorder = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "darkRoute" && prop !== "border" && prop !== "showDroplist",
})(({ darkRoute, border, showDroplist }) => ({
  position: "absolute",
  width: !darkRoute ? "calc(100% - 8px)" : "100%",
  height: !darkRoute ? "calc(100% - 8px)" : "100%",
  top: !darkRoute ? "4px" : "0",
  left: !darkRoute ? "4px" : "0",
  backgroundColor: "transparent",
  outline: border
    ? "2px solid var(--invCardTitle)"
    : darkRoute
    ? "1px solid lightGrey"
    : "2px solid transparent",
  paddingTop: 0,
  borderRadius: showDroplist ? "5px 5px 0 0 " : "5px",
  display: "flex",
  // transition: "outline 0.5s ease-in-out",
  pointerEvents: "none",
}));

// Search button
const SearchBtn = styled("button", {
  shouldForwardProp: (prop) => prop !== "darkRoute" && prop !== "showDroplist",
})(({ darkRoute, showDroplist }) => ({
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
  borderRadius: "0px 8px 8px 0px",
  padding: "unset",
  "&:hover": {
    backgroundColor: "white",
  },
}));

// ✅ Named exports
export { SearchInput, InputWrapper, InputWrapperBorder, SearchBtn };
