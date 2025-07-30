import React from "react";
import Navbar from "./navbar.js";
import Searchbar from "./searchbar/searchbar.js";
import Box from "@mui/material/Box";

const Header = ({ currentRoute, inv }) => {
  const bottomShadow = "0 8px 16px -4px rgba(0, 0, 0, 0.12)";
  const darkRoutes = ["favorites", "cars", "car"];

  return (
    <Box
      sx={{
        position: darkRoutes.includes(currentRoute) ? "" : "absolute",
        zIndex: "1",
        left: darkRoutes.includes(currentRoute) ? "unset" : "50%",
        transform: darkRoutes.includes(currentRoute)
          ? "none"
          : "translateX(-50%)",
        width: darkRoutes.includes(currentRoute) ? "100%" : "calc(100% - 24px)",
        paddingInline: darkRoutes.includes(currentRoute) ? "12px" : "none",
        maxWidth: darkRoutes.includes(currentRoute) ? "none" : "1200px",
        paddingBottom: "1rem",
        boxShadow:
          darkRoutes.includes(currentRoute) && currentRoute != "cars"
            ? bottomShadow
            : "none",

        display: darkRoutes.includes(currentRoute) ? "flex" : "",
        justifyContent: darkRoutes.includes(currentRoute) ? "center" : "",
      }}
    >
      <Box
        className="middle_content middleContent_header"
        sx={{
          width: darkRoutes.includes(currentRoute) ? "1200px" : "100%",
          maxWidth: darkRoutes.includes(currentRoute) ? "100%" : "inherit",
        }}
      >
        <Navbar darkRoute={darkRoutes.includes(currentRoute)} inv={inv} />
        <Searchbar
          darkRoute={darkRoutes.includes(currentRoute)}
          mode="inventory"
        />
      </Box>
    </Box>
  );
};

export default Header;
