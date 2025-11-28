import React, { forwardRef } from "react";
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
      distMode,
      location, //user location objec
      locationInputValue,
      setLocationInputValue,
      locationChangeInputRef,
      inv,
      locObjs,
      setLocObjs,
      setShowLocationChangeModal,
      setPreventScroll,
    },
    ref
  ) => {
    return (
      <Modal ref={ref}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.2em" }}>
          Select Your Preferred Location
        </h3>
        <Searchbar
          darkRoute={true}
          mode="locationChange"
          locationInputValue={locationInputValue}
          setLocationInputValue={setLocationInputValue}
          inputRef={/* locationInputRef */ locationChangeInputRef}
          setLocObjs={setLocObjs}
        />
        <hr style={hr_style} />
        <ListScroll
          hasSearchVal={!!locationChangeInputRef.current?.value}
          locObjs={locObjs} //matching 'us_zips.csv' objs
          setLocObjs={setLocObjs}
          userLocationObj={location}
          inv={inv}
          setPreventScroll={setPreventScroll}
        />
        <CloseIcon
          onClick={(e) => {
            setLocObjs(distMode ? [] : null);
            setLocationInputValue("");
            if (distMode) {
              setShowLocationChangeModal(false);
              if (window.innerWidth >= 820) {
                setPreventScroll(false);
              }
            }
            e.stopPropagation();
          }}
        />
      </Modal>
    );
  }
);

export default LocationChangeModal;
