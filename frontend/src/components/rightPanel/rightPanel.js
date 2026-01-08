import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Box from "@mui/joy/Box";
import { IoCloseOutline } from "react-icons/io5";
import "./rightPanel.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { truncateString } from "../utils";
import { IoTrashSharp } from "react-icons/io5";
import Heart from "../heart";
import Searchbar from "../searchbar/searchbar";
import Button from "../buttons/button";
import { getModelImageURLs } from "../axiosCalls";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  addToCompare,
  removeFromCompare,
  setChosenCars,
} from "../../user/userSlice";

const panelRootStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.4)",
  zIndex: 999,
};

const closeXStyle = {
  cursor: "pointer",
  position: "absolute",
  top: "1rem",
  right: "1rem",
  fontSize: "1.5rem",
};

const panelH3Style = (compare) => ({
  marginBlock: compare ? "1.2rem .8rem" : "1.2rem",
  fontSize: compare ? "1.1em" : "1.65em",
  color: "var( --invCardTitle)",
  letterSpacing: "0px",
});

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "tween", duration: 0.375 },
  },
  exit: {
    x: "100%",
    transition: { type: "tween", duration: 0.375 },
  },
};
//
// COMPARE CARD
//
const CompareCard = ({
  // setCompareCars, //changing list from /cars
  // setChosenCars,
  carObj,
  isChosen, //is in the 'chosenCars' array
  originCar,
  setOriginCar,
  otherSelectedCar,
  heartedCars,
  toggleHeartClick,
  chosenCars,
}) => {
  console.log("CompareCard isChosen", isChosen);
  console.log("CompareCard originCar", originCar);
  console.log("CompareCard carObject", carObj);

  const dispatch = useDispatch();

  const changeCar = (incomingCarObj, outgoingID) => {
    /* setChosenCars((prev) => {
      const chosenPosition = prev.findIndex((car) => car.id === outgoingID);

      if (chosenPosition === 0) {
        return [incomingCarObj, ...prev.filter((car) => car.id !== outgoingID)];
      } else {
        return [...prev.filter((car) => car.id !== outgoingID), incomingCarObj];
      }
    });

    setOriginCar(incomingCarObj); */
    const chosenPosition = chosenCars.findIndex((car) => car.id === outgoingID);

    let newChosenCars;

    if (chosenPosition === 0) {
      newChosenCars = [
        incomingCarObj,
        ...chosenCars.filter((car) => car.id !== outgoingID),
      ];
    } else {
      newChosenCars = [
        ...chosenCars.filter((car) => car.id !== outgoingID),
        incomingCarObj,
      ];
    }

    dispatch(setChosenCars(newChosenCars));
  };

  return (
    <div className={`compareCard ${otherSelectedCar ? "opaqueStyle" : ""}`}>
      <div
        className={`compareCard_imgBox ${!isChosen ? "selectable" : ""}`}
        onClick={isChosen ? undefined : () => changeCar(carObj, originCar.id)}
      >
        <img
          src={carObj.imageArray[0]}
          alt="car_img"
          className="compareCard_img"
          style={{ border: isChosen ? "1px solid var(--offBlue)" : "" }}
        />
        {isChosen && <IoIosCheckmarkCircle className="imgBox_svg" />}
      </div>

      <div className="compareCard_detailsBox">
        <h4 className="compareCard_title">
          {carObj.year} {carObj.make}
          <br />
          {truncateString(carObj.model, 15)}
        </h4>
        <p className="stockNum">#{carObj.id}</p>
        <div className="likeTrashBox">
          <Heart
            style={{
              position: "relative",
              transform: "scale(.75)",
              top: 0.6,
              right: 0,
            }}
            hearted={heartedCars.some((car) => car.id === carObj.id)}
            onClick={(e) => toggleHeartClick(e, carObj)}
          />
          {!isChosen && (
            <IoTrashSharp
              onClick={() => {
                // setCompareCars((prev) =>
                //   prev.filter((car) => car.id !== carObj.id)
                // );
                dispatch(removeFromCompare(carObj.id));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

//
// RIGHT PANEL
//
const RightPanel = ({
  mode,
  showRightPanel,
  setShowRightPanel,
  originCar,
  setOriginCar,
  // compareCars,
  // setCompareCars, //for adding or trashing one of the received 'compareCars'
  // chosenCars,
  // setChosenCars,
  heartedCars,
  toggleHeartClick,
  inventory,
}) => {
  const compareCars = useSelector((state) => state.compare.compareCars);
  const chosenCars = useSelector((state) => state.compare.chosenCars);

  const dispatch = useDispatch();

  ///RESIZING
  const [under900, setUnder900] = useState(window.innerWidth < 900);
  useEffect(() => {
    const handleResize = () => {
      setUnder900(window.innerWidth < 900);
    };
    window.addEventListener("resize", handleResize);
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  ///  RIGTHT PANEL STYLE
  const rightPanelStyle = {
    backgroundColor: "white",
    position: "relative",
    width: originCar ? "320px" : under900 ? "100%" : "23.5rem",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
    paddingInline: "16px",
    display: originCar ? "flex" : "inherit",
    flexDirection: originCar ? "column" : "unset",
    overflow: "scroll",
  };
  const [inputValue, setInputValue] = useState(""); //
  const inputRef = useRef();
  const [selectedError, setSelectedError] = useState(false);
  const [invNotFoundError, setInvNotFoundError] = useState(false);
  const [matchId, setMatchId] = useState();

  /// MODE : COMPARE CARS VARIABLES
  let idsArray;
  let handleOnChange;
  let handleAddCar;

  if (mode === "compareCars") {
    idsArray = inventory.map((item) => item.id);

    handleOnChange = function (value) {
      setInputValue(value);
      //user 'changes' input by backspacing completely
      if (value.length === 0) {
        if (selectedError) {
          setSelectedError(false);
        }
        if (invNotFoundError) {
          setInvNotFoundError(false);
        }
        return;
      }
      const selectedFound = compareCars.some((carObj) => {
        if (value.includes("/car")) {
          ///URL from vehiclePage
          return value.includes(carObj.id); // return boolean
        } else {
          return value === carObj.id; // return boolean
        }
      });

      //URLS THROWING 'CAR ALREADY ADDED' ERROR
      //ALSO CLEAR INPUT AFTER RUNING 'HANDLEADDCAR'
      if (selectedFound !== selectedError) {
        setSelectedError(selectedFound);
      }
      if (selectedFound) {
        //it can't be 'selectedFound' (already be in compareCars) if it doesn't exist in inventory, so no reason to run the 'is it in inv logic' if we know it's been selected, so return
        //
        return;
      }
      /// checking inventory
      // are any of the idsArray id's included in the received value

      // const matchFound = idsArray.some((id) => value.includes(id));

      //does the value provided include in it something constituting an entire 'id' value for one of the inventory objects
      //you're never getting more than one inv id match bc you're checking whether the objs' unique .id's can be found, in full, in the value

      // const matchingID = idsArray.filter((id) => value.includes(id));
      const matchFound = idsArray.some((id) => {
        if (value.includes("/car")) {
          //Can the  idsArray # be found inside of the URL string
          return id === parseInt(value.replace(/\D/g, ""), 10);
        } else {
          //Does the idsArray # equal the provided value
          return id === Number(value);
        }
      });

      console.log("matchFound", matchFound);

      if (!matchFound) {
        setInvNotFoundError(true);
      } else {
        //if there is a match to inv obj, then only reset to 'false' if it is currently set to true (don't needlessly reset if already false)
        if (invNotFoundError) {
          setInvNotFoundError(false);
        }
        const matchingID = parseInt(value.replace(/\D/g, ""), 10);
        console.log("matchingID", matchingID);
        setMatchId(matchingID);
      }
    };
    //
    /*****   HANDLE ADD CAR  ******/
    //
    // handleAddCar = async function () {
    //   let imagesMap;

    //   const matchingInvCar = inventory.find((car) => car.id === matchId);
    //   //inventory obj not fed from <InventoryCard/> & <InventoryGrid/> so still missing .imageArray, fetch img URLs & assign here

    //   console.log("matchingInvCar", matchingInvCar);

    //   try {
    //     imagesMap = await getModelImageURLs(
    //       [matchingInvCar.images.model_imgs_key],
    //       true,
    //       true
    //     );
    //   } catch (err) {
    //     console.error("Error fetching model image URLs:", err);
    //   }

    //   console.log("returned imagesMap", imagesMap);

    //   const [imageArray] = Object.values(imagesMap[]);
    //   console.log("imageArray", imageArray);
    //   // ✅ Get array of all values from the imagesMap object
    //   const imageValues = Object.values(imagesMap);

    //   console.log("imageValues", imageValues);

    //   // ✅ Append to matchingInvCar
    //   matchingInvCar.imageArray = imageValues[0];
    //   // UPDATE COMPARE CARS
    //   // setCompareCars((prev) => [...prev, matchingInvCar]);
    //   setInputValue(""); //clear the input (disables btn too)
    //   inputRef.current.value = "";
    // };
    handleAddCar = async function () {
      if (!matchId) return;

      // find car in inventory
      const matchingInvCar = inventory.find((car) => car.id === matchId);

      if (!matchingInvCar) {
        console.warn("No matching inventory car for id:", matchId);
        return;
      }

      // 🚫 prevent adding same car twice
      const alreadyInCompare = compareCars.some(
        (car) => car.id === matchingInvCar.id
      );
      if (alreadyInCompare) return;

      let imagesMap;

      try {
        imagesMap = await getModelImageURLs(
          [matchingInvCar.images.model_imgs_key],
          true,
          true
        );
      } catch (err) {
        console.error("Error fetching model image URLs:", err);
        return;
      }

      // ✔️ correct syntax — get first array from map
      const [imageArray] = Object.values(imagesMap);

      // ❌ DO NOT mutate Redux / frozen object
      // matchingInvCar.imageArray = imageArray;

      // ✅ create a NEW extensible object
      const carWithImages = {
        ...matchingInvCar,
        imageArray,
      };

      // ✅ add to compareCars (Redux)
      // (replace with your slice action if you have one)
      dispatch(addToCompare(carWithImages));

      // reset UI state
      setInputValue("");
      inputRef.current.value = "";
      setSelectedError(false);
      setInvNotFoundError(false);
    };
  }

  return (
    <AnimatePresence>
      {showRightPanel && (
        <motion.div
          key="overlay"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          style={panelRootStyle}
          onClick={() => {
            setShowRightPanel(false);
          }}
        >
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={rightPanelStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <IoCloseOutline
              style={closeXStyle}
              onClick={() => setShowRightPanel(false)}
            />
            {/* CALC PAY vs COMPARE CARS RETURN */}
            {mode === "compareCars" ? (
              <>
                <h3 style={panelH3Style(!!originCar)}>Select a Car</h3>
                <div className="compareCardsWrapper">
                  {compareCars &&
                    compareCars.map((carObj) => {
                      return (
                        <CompareCard
                          key={carObj.id}
                          // setCompareCars={setCompareCars}
                          // setChosenCars={setChosenCars}
                          carObj={carObj}
                          isChosen={chosenCars.some(
                            (car) => car.id === carObj.id
                          )}
                          originCar={originCar}
                          setOriginCar={setOriginCar}
                          otherSelectedCar={
                            chosenCars.some((car) => car.id === carObj.id) &&
                            carObj.id !== originCar.id
                          }
                          heartedCars={heartedCars}
                          toggleHeartClick={toggleHeartClick}
                          chosenCars={chosenCars}
                        />
                      );
                    })}
                </div>
                {/*  DO I NEED TO PASS IN 'INPUT VALUE' HERE? */}
                <div className="searchbarBtnWrapper">
                  <Searchbar
                    mode="rightPanel"
                    darkRoute={true}
                    inputValue={inputValue}
                    inputRef={inputRef} //for focus state control
                    handleOnChange={handleOnChange}
                    // handleAddCar={handleAddCar}
                    rightPanelError={
                      selectedError === true || invNotFoundError === true
                    }
                    // selectedError={selectedError}
                    // invNotFoundError={invNotFoundError}
                  />
                  {(selectedError || invNotFoundError) && (
                    <span className="errorMessage">
                      {selectedError
                        ? "Error: Car already added"
                        : "Error: Car not found"}
                    </span>
                  )}
                  <Button
                    text="Add"
                    disabled={
                      selectedError ||
                      invNotFoundError ||
                      inputValue.length === 0
                    }
                    onClick={handleAddCar}
                    style={{ marginTop: "1.5rem", width: "100%" }}
                  />
                </div>
              </>
            ) : (
              <h3 style={panelH3Style(!!originCar)}>Can You Afford It?</h3>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RightPanel;
