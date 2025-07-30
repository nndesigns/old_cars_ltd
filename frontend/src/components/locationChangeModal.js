import React, { useState, useEffect, forwardRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Searchbar from "./searchbar/searchbar";
import { CiCircleRemove } from "react-icons/ci";
import ListScroll from "./listScroll";

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

const hr_style = {
  border: "none",
  borderTop: "1px solid var(--greyBorder)",
  marginTop: "1rem",
};

const Modal = styled(Box)(({ theme }) => ({
  // styles here
  position: "relative",
  padding: "1.5rem",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "18px",
  boxShadow: theme.shadows[5],
  height: "650px",
  width: "650px",
  marginInline: "1rem",
}));

/////////////  COMPONENT
const LocationChangeModal = forwardRef(
  (
    {
      location, //user location object
      locationValueRef, //searchbar input value
      setShowLocationChangeModal,
      inv,
      locObjs,
      setLocObjs,
    },
    ref
  ) => {
    /*     console.log("LCM received location", location);
    console.log("LCM rec'd locationValueRef", locationValueRef); */
    return (
      <Modal ref={ref}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.2em" }}>
          Select Your Preferred Location
        </h3>
        <Searchbar
          darkRoute={true}
          mode="locationChange"
          locationValueRef={locationValueRef}
          setLocObjs={setLocObjs}
        />
        <hr style={hr_style} />
        <ListScroll
          locObjs={locObjs} //matching 'us_zips.csv' objs
          userLocationObj={location}
          inv={inv}
          setShowLocationChangeModal={setShowLocationChangeModal}
        />
        <CloseIcon
          onClick={(e) => {
            setShowLocationChangeModal(false);
            e.stopPropagation();
          }}
        />
      </Modal>
    );
  }
);

export default LocationChangeModal;

//when LCM is closed by the DOM 'handleClickOutside' and the LM is still open, I want the 'locationValueRef' to still be showing inside of the LocationModal's Searchbar.

//I think the Searchbar's handleSubmit (opening the LocationChangeModal) is causing the Navbar's 'locationValueRef' to be wiped, I want to maintain it.

//Also when the 'showLocationChangeModal is being reset here to 'false', it's causing a re-render of Navbar and a re-declaration of isLocationHovered to 'false', closing the LocationModal, whereas, Iif the icon here is clicked I want it to also only close the LocationChangeModal and not both.

//try setting iaLocationHovered to 'true' explicitly here in this component's 'onCLick';?
