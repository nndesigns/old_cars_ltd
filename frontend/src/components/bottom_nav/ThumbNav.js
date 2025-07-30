import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { CiCircleRemove } from "react-icons/ci";
import {
  SearchSection,
  SellSection,
  FinanceSection,
  MoreSection,
  MyAccountSection,
} from "./thumb_nav_sections.js";

const ThumbNav = forwardRef(({ navItem, setValue }, ref) => {
  const titleMap = {
    0: "Search",
    1: "Sell/Trade",
    2: "Finance",
    3: "More",
    4: "My Account",
  };

  const sectionMap = {
    0: <SearchSection />,
    1: <SellSection />,
    2: <FinanceSection />,
    3: <MoreSection />,
    4: <MyAccountSection />,
  };

  const CloseIcon = styled(CiCircleRemove)(({ theme }) => ({
    position: "absolute",
    right: ".75rem",
    top: ".75rem",
    height: "2em",
    width: "2em",
    cursor: "pointer",
    transition: "fill 0.2s ease-in-out",

    "&:hover": {
      fill: "red",
    },
  }));

  return (
    <>
      {navItem != null && (
        <div
          style={{
            position: "absolute",
            zIndex: "3",
            width: "100%",
            backgroundColor: "rgba(0,0,0,.4",
            top: navItem != null ? "0%" : "100%",
            bottom: navItem != null ? "0" : "-100%",
          }}
        />
      )}
      <Box
        ref={ref}
        sx={{
          borderRadius: "20px 20px 0px 0px",
          width: "100%",
          backgroundColor: "white",
          padding: "1.25rem 2rem ",
          position: "fixed",
          zIndex: "3",
          top: navItem != null ? "10%" : "100%",
          bottom: navItem != null ? "0" : "-100%",
          transition: "top 0.3s ease-out, bottom 0.4s ease-out",
        }}
      >
        <CloseIcon onClick={() => setValue(null)} />
        <h1 style={{ letterSpacing: "-.8px", marginBottom: "32px" }}>
          {titleMap[navItem]}
        </h1>
        <div>{sectionMap[navItem]}</div>
      </Box>
    </>
  );
});

export default ThumbNav;
