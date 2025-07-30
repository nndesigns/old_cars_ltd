import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/joy/Card";
import Button from "./buttons/button";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { getOffers } from "./utils";
import { getDistance } from "geolib";
import { useSelector, useDispatch } from "react-redux";
import { setManualLocation } from "../user/locationSlice";

// Styled component (defined outside render)
const LocDetailsBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  color: "var(--iconColor)",
  "& > p": {
    marginBottom: ".25rem",
    fontSize: "1.1em",
  },
  "& > small": {
    marginBottom: ".25rem",
    paddingTop: ".2rem",
    display: "flex",
    gap: ".2rem",
    opacity: ".65",
  },
});

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  overflow: "scroll",
  gap: "1rem",
  padding: "1rem",
  paddingLeft: "0",
  // border: "1px solid green",
  height: "31rem",
};

const LocationCard = styled(Card)(({ theme, style }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid var(--greyBorder)",
  borderRadius: "8px",
  padding: "1rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",

    "& .locationCard-action": {
      alignSelf: "center", // works now!
      border: "2px solid pink",
    },
  },
  ...style,
}));

//////////////// LIST SCROLL /////////////////
const ListScroll = ({
  locObjs,
  userLocationObj,
  inv,
  setShowLocationChangeModal,
}) => {
  //Redux update (LocationChangeModal)
  // LOCATION UPDATE
  const dispatch = useDispatch();
  const handleLocationUpdate = (loc_obj) => {
    //Update 'location' redux to new location
    //NOTE: this is listened for in App.js (to setLocalInv in location redux state)
    dispatch(setManualLocation(loc_obj));
    //set LCM useState to false
    setShowLocationChangeModal(false);
  };

  function getMiles(location) {
    const distInMeters = getDistance(
      {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      {
        latitude: userLocationObj.latitude,
        longitude: userLocationObj.longitude,
      }
    );

    const distInMiles = distInMeters / 1609.34;
    return Math.round(distInMiles);
  }
  //////// GET MODEL COUNTS //////
  const getModelCounts = (offers_arr) => {
    if (offers_arr.length > 0) {
      return new Set(offers_arr.map((car) => `${car.make}-${car.model}`)).size;
    }
  };

  //////// OFFER COUNTS ////////////
  const userCityOffers = inv.filter(
    (veh) =>
      veh.city === userLocationObj.city && veh.state === userLocationObj.state
  );

  const [localModelCt, setLocalModelCt] = useState(null);

  //SETTING MODEL CTS FOR 1st LocationCard
  useEffect(() => {
    setLocalModelCt(getModelCounts(userCityOffers));
  }, [userCityOffers, setLocalModelCt]);

  ////////////////////////  RENDER LOCATION CARD //////////////////////
  const renderLocationCard = (loc_obj, currentLoc = false) => {
    let offerCt_50;
    let model_ct_50;

    //if not rendering 'current location' card..(so matches cards)
    if (!currentLoc) {
      //OFFERS
      offerCt_50 = inv.filter(
        (veh) => veh.city === loc_obj.city && veh.state === loc_obj.state
      );
      //MODELS
      model_ct_50 = getModelCounts(offerCt_50);
    }

    return (
      <LocationCard
        key={`${loc_obj.city}-${loc_obj.zip}`}
        style={{ paddingRight: currentLoc ? "2.5rem" : "1.25rem" }}
      >
        <LocDetailsBox>
          <p style={{ fontWeight: "600" }}>
            {loc_obj.city}, {loc_obj.state}{" "}
            {!currentLoc && (
              <small
                style={{
                  marginLeft: ".25rem",
                  opacity: ".45",
                  letterSpacing: ".5px",
                }}
              >
                {" "}
                ~{getMiles(loc_obj)}
                <span style={{ fontSize: ".73rem" }}>mi</span>
              </small>
            )}
          </p>
          <small>
            {/* LOCAL OFFER CT */}
            <span>ACTIVE OFFERS: </span>
            <span>
              <strong>
                {currentLoc
                  ? userCityOffers.length /* localModelCt */
                  : offerCt_50.length}
              </strong>{" "}
            </span>
          </small>

          {/* MODEL COUNTS */}
          <small>
            <span>MODELS: </span>
            <span>
              <strong>
                {currentLoc
                  ? localModelCt
                    ? localModelCt
                    : "0"
                  : model_ct_50
                  ? model_ct_50
                  : "0"}{" "}
              </strong>{" "}
            </span>
          </small>
        </LocDetailsBox>

        {/* ICON OR BUTTON */}
        {currentLoc ? (
          <span
            style={{
              display: "inline-flex",
              fontWeight: "600",
              letterSpacing: "0px",
              alignItems: "center",
              gap: ".25rem",
              color: "#1b6b00",
            }}
            className="locationCard-action"
          >
            <IoCheckmarkDoneCircle size={30} /> CURRENT LOCATION
          </span>
        ) : (
          <Button
            className="locationCard-action"
            onClick={() => {
              handleLocationUpdate(loc_obj);
            }}
            outlineStyle2={true}
            text="SET AS LOCATION"
          />
        )}
      </LocationCard>
    );
  };

  return (
    <Box style={boxStyle}>
      {renderLocationCard(userLocationObj, true)}

      {locObjs?.length > 0 ? (
        <>{locObjs.map((loc_obj) => renderLocationCard(loc_obj, false))}</>
      ) : (
        <h3 style={{ textAlign: "center", marginTop: "3rem" }}>
          Location Not Found
        </h3>
      )}
    </Box>
  );
};

export default ListScroll;
