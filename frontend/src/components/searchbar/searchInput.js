import { styled } from "@mui/material/styles";

const SearchInput = styled("input", {
  shouldForwardProp: (prop) => prop !== "darkRoute" && prop !== "border",
})(({ theme, darkRoute, border }) => ({
  backgroundColor: darkRoute ? "var(--tileBG)" : "white",
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

export default SearchInput;
