import React, { useRef, useEffect } from "react";
import Navbar from "./navbar.js";
import Searchbar from "./searchbar/searchbar.js";
import Box from "@mui/material/Box";
// import { useSelector } from "react-redux";

const Header = ({ currentRoute, PageTransition }) => {
  // REDUX
  // const inv = useSelector((state) => state.inventory.items);
  // USE REF
  const inventoryRef = useRef("");

  const darkRoutes = ["favorites", "cars", "car"];

  return (
    <Box
      sx={{
        position: darkRoutes.includes(currentRoute) ? "" : "absolute",
        zIndex: darkRoutes.includes(currentRoute) ? "" : "1",
        left: darkRoutes.includes(currentRoute) ? "unset" : "50%",
        transform: darkRoutes.includes(currentRoute)
          ? "none"
          : "translateX(-50%)",
        width: darkRoutes.includes(currentRoute) ? "100%" : "calc(100% - 24px)",
        paddingInline: darkRoutes.includes(currentRoute) ? "12px" : "none",
        maxWidth: darkRoutes.includes(currentRoute) ? "none" : "1200px",
        paddingBottom: "1rem",
        /*   boxShadow:
          darkRoutes.includes(currentRoute) && currentRoute !== "cars"
            ? bottomShadow
            : "none", */
        display: darkRoutes.includes(currentRoute) ? "flex" : "",
        justifyContent: darkRoutes.includes(currentRoute) ? "center" : "",
        backgroundColor: darkRoutes.includes(currentRoute) ? "white" : "",
      }}
    >
      <Box
        className="middle_content middleContent_header"
        sx={{
          width: darkRoutes.includes(currentRoute) ? "1200px" : "100%",
          maxWidth: darkRoutes.includes(currentRoute) ? "100%" : "inherit",
        }}
      >
        {/* {currentRoute === "home" ? (
          <PageTransition>
            <Navbar
              darkRoute={darkRoutes.includes(currentRoute)}
            />
            <Searchbar
              currentRoute={currentRoute}
              darkRoute={darkRoutes.includes(currentRoute)}
              mode="inventory"
              inputRef={inventoryRef}
            />
          </PageTransition>
        ) : (
          <> */}
        <Navbar darkRoute={darkRoutes.includes(currentRoute)} />
        <Searchbar
          currentRoute={currentRoute}
          darkRoute={darkRoutes.includes(currentRoute)}
          mode="inventory"
          inputRef={inventoryRef}
        />
        {/* </>
        )} */}
      </Box>
    </Box>
  );
};

export default Header;
