import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import {
  CiSearch,
  CiShoppingTag,
  CiDollar,
  CiCircleMore,
  CiUser,
} from "react-icons/ci";

const BottomNav = forwardRef(({ value, setValue }, ref) => {
  const buttonStyles = {
    fontWeight: 400,
    fontSize: "1.75rem", //svgs
    padding: "0px",
    flex: "1",
    minWidth: "0",

    "&:hover": {
      backgroundColor: "transparent",
    },

    "& .MuiBottomNavigationAction-label": {
      fontSize: ".65rem", //label
      letterSpacing: "0px",
      marginTop: ".2rem",
    },

    "& .MuiBottomNavigationAction-label.Mui-selected": {
      fontSize: ".65rem",
    },
  };

  return (
    <Box
      ref={ref} // Attach the ref to Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100vw",
        zIndex: "5",
        backgroundColor: "rgba(245, 246, 247, .6)",
        backdropFilter: "blur(20px)",
        boxShadow: value != null ? "" : "0 -4px 32px 0 rgba(0, 0, 0, .16)",
        border: value != null ? "1px solid rgba(0, 0, 0, 0.15)" : "",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          newValue === value ? setValue(null) : setValue(newValue);
        }}
        sx={{ backgroundColor: "transparent", height: "60px" }}
      >
        <BottomNavigationAction
          sx={buttonStyles}
          label="Search"
          icon={<CiSearch />}
        />
        <BottomNavigationAction
          sx={buttonStyles}
          label="Sell/Trade"
          icon={<CiShoppingTag />}
        />
        <BottomNavigationAction
          sx={buttonStyles}
          label="Finance"
          icon={<CiDollar />}
        />
        <BottomNavigationAction
          sx={buttonStyles}
          label="More"
          icon={<CiCircleMore />}
        />
        <BottomNavigationAction
          sx={buttonStyles}
          label="My Account"
          icon={<CiUser />}
        />
      </BottomNavigation>
    </Box>
  );
});

export default BottomNav;
