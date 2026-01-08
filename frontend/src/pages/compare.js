import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { getModelImageURLs } from "../components/axiosCalls";
import { useNavigate } from "react-router-dom";
import SearchBackBtn from "../components/searchBackBtn";
import Dropdown from "../components/dropdown";
import Box from "@mui/material/Box";
import "./compare.css";
import { ReactComponent as Logo } from "../icons/nav_icons/logo.svg";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { GoArrowSwitch } from "react-icons/go";
import { AiOutlineCamera } from "react-icons/ai";
import { ImArrowLeft } from "react-icons/im";
import { RiShareBoxFill } from "react-icons/ri";
import { BsPrinter } from "react-icons/bs";
import { LoadingSpinner } from "../components/inventoryGrid/loadingSpinner";
import RightPanel from "../components/rightPanel/rightPanel";
import ShareModal from "../components/shareModal";

import Heart from "../components/heart";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import { selectCompareCars, selectChosenCars } from "../user/userSlice.js";

import { toggleHeart } from "../user/favoritesSlice";

///DETAILS TOOL
import DetailsTool from "../components/detailsTool";

import { Link } from "react-router-dom";
import Button from "../components/buttons/button";

// import { AnimatePresence } from "motion/react";
// import * as motion from "motion/react-client";
import { motion, AnimatePresence } from "framer-motion";

///BUTTON BOX BTNS
const btnStyle = {
  borderRadius: "30px",
  fontSize: ".75rem",
  padding: ".5rem .6rem",
  height: "inherit",
  letterSpacing: "1px",
};

const compareBtnStyle = {
  border: "none",
  marginBlock: ".5rem",
  padding: ".6rem",
  display: "flex",
  alignItems: "center",
  gap: ".4rem",
  height: "inherit",
};

//// TITLE BAR
const TitleBar = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  position: "fixed",
  top: 53,
  left: 0,
  zIndex: 9,
  width: "100vw",
  maxHeight: "160.5px",
  backgroundColor: "var(--tileBG)",
  boxShadow: "var( --dropShadowBoxShadow)",
}));
//// TITLE BOX CONTAINER
const TitleBoxContainer = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  paddingInline: "24px",
  maxWidth: "1200px",
}));

//// TITLE BOX
const TitleBoxWrapper = styled("div")(({ theme }) => ({
  "&:first-of-type": {
    paddingRight: "16px",
  },
  "&:last-of-type": {
    paddingLeft: "16px",
  },
  width: "calc(100% - .25rem)",
  paddingBlock: "16px",
}));

//
// TITLE BOX
//
const TitleBox = ({
  car,
  mobileMenuWidth,
  setShowRightPanel,
  setOriginCar,
}) => {
  const navigate = useNavigate();
  const optionsArray = ["Reserve this car", "View car Details", "Change car"];

  console.log("car in TitleBox", car);

  const handleChangeCar = (car) => {
    setOriginCar(car);
    //     setTimeout(() => setShowRightPanel(true), 0.5);
    setShowRightPanel(true); //return <RightPanel/> in Compare return (.center_box)
  };

  return (
    <TitleBoxWrapper>
      <h2 className="titleBox_h2">
        {car?.year || "—"} {car?.make || "Unknown Make"}
      </h2>
      <p className="titleBox_model">{car?.model || "Unknown Model"}</p>
      <div className="btn_box">
        {mobileMenuWidth ? (
          <Dropdown
            car={car}
            navigate={navigate}
            options={optionsArray}
            btnStyle={btnStyle}
            handleChangeCar={handleChangeCar}
          />
        ) : (
          <>
            <Button text="Reserve this car" style={{ ...btnStyle }} />
            <Button
              text="View Car Details"
              outlineStyle2={true}
              style={{ ...btnStyle }}
              onClick={() => {
                console.log("this was triggered 2");
                navigate(`/car/${car.id}`);
              }}
            />
            <Button
              text="Change Car"
              className="changeBtn"
              svg={<GoArrowSwitch style={{ fontSize: "1.2rem" }} />}
              outlineStyle2={true}
              style={{
                ...btnStyle,
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: ".4rem",
              }}
              onClick={() => handleChangeCar(car)}
            />
          </>
        )}
      </div>
    </TitleBoxWrapper>
  );
};

/// IMAGES
const ImagesWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: ".25rem",
  flex: 1,
}));

//
///// IMAGES CONTAINER
//
const ImagesContainer = ({
  srcArr,
  allPhotos,
  carObj,
  isHearted,
  toggleHeartClick,
}) => {
  const [loadedStates, setLoadedStates] = useState(
    Array(srcArr?.length || 0).fill(false)
  );
  if (!srcArr?.length) return null;
  const handleImageLoad = (index) => {
    setLoadedStates((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <ImagesWrapper>
      {srcArr.map((src, index) => (
        <div
          key={index}
          style={{
            width: "100%",
            aspectRatio: allPhotos ? "16 / 9" : "4 / 3",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Spinner shows until this specific image is loaded */}
          {!loadedStates[index] && (
            <LoadingSpinner
              style={{
                marginTop: "0rem",
                marginLeft: "0rem",
                height: 45,
                width: 45,
              }}
            />
          )}

          {loadedStates[index] && (
            <Heart
              hearted={isHearted}
              onClick={(e) => toggleHeartClick(e, carObj)}
            />
          )}

          <img
            src={src}
            alt="car_img"
            className="carImg"
            style={{
              display: loadedStates[index] ? "block" : "none",
            }}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageLoad(index)} // hide spinner even on broken image
          />
        </div>
      ))}
    </ImagesWrapper>
  );
};

/// PHOTOS TOOL WRAPPER
const PhotosToolWrapper = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: ".25rem",
}));

//
/// PHOTOS TOOL
//
const PhotosTool = ({
  allPhotos,
  setAllPhotos,
  mobile,
  mobile2,
  srcArrays,
  chosenCars, // 2 car objects
  heartedCars, // all redux-saved favorites carObjs
  toggleHeartClick,
}) => {
  ///PHOTOS TOOL ROOT
  const photoRootStyle = {
    zIndex: 2,
    marginLeft: mobile ? (mobile2 ? "-15px" : "-24px") : "0",
    width: mobile ? "100vw" : "100%",
  };

  if (!chosenCars.length) {
    return null; // or loading skeleton
  }

  return (
    <div style={photoRootStyle}>
      <PhotosToolWrapper>
        <ImagesContainer
          srcArr={allPhotos ? srcArrays.car1 : [srcArrays.car1[0]]}
          allPhotos={allPhotos}
          toggleHeartClick={toggleHeartClick}
          carObj={chosenCars[0]}
          isHearted={heartedCars.some((car) => car.id === chosenCars[0].id)}
        />
        <ImagesContainer
          srcArr={allPhotos ? srcArrays.car2 : [srcArrays.car2[0]]}
          allPhotos={allPhotos}
          toggleHeartClick={toggleHeartClick}
          carObj={chosenCars[1]}
          isHearted={heartedCars.some((car) => car.id === chosenCars[1].id)}
        />
      </PhotosToolWrapper>
      {!allPhotos && (
        <div className="btn_wrapper">
          <Button
            text="Compare photos"
            svg={<AiOutlineCamera />}
            style={compareBtnStyle}
            onClick={() => setAllPhotos(true)}
          />
        </div>
      )}
    </div>
  );
};

/// MORE DROPDOWN OPTIONS
const moreOptObj = {
  Share: <RiShareBoxFill />,
  Print: <BsPrinter />,
};

//////// COMPARE COMPONENT  (ROOT) ///////
const Compare = ({
  /* setPreventScroll, */ AnimatePresence,
  PageTransition,
}) => {
  // REDUX
  const dispatch = useDispatch();
  // COMPARE CARS
  const compareCars = useSelector(selectCompareCars);
  // CHOSEN CARS
  const chosenCars = useSelector(selectChosenCars);
  const heartedCars = useSelector((state) => state.favorites.heartedCars);
  const inventory = useSelector((state) => state.inventory.items);
  const location = useSelector((s) => s.location);
  //      const isHearted = heartedCars.some((car) => car.id === carData.id);
  const [toggleLike, setToggleLike] = useState(false);
  const [isHearted, setIsHearted] = useState();
  const [showShareModal, setShowShareModal] = useState(false);
  /// WINDOW RESIZE, CHANGE CONTAINER WIDTH
  const [mobilePicWidth, setMobilePicWidth] = useState(
    window.innerWidth < 1200
  );
  const [mobilePicWidth2, setMobilePicWidth2] = useState(
    window.innerWidth <= 600
  );

  // TITLE BAR (BOX) BUTTONS
  const [mobileMenuWidth, setMobileMenuWidth] = useState(
    window.innerWidth < 609
  );

  //CHANGE CARS PANEL
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [originCar, setOriginCar] = useState();

  const [srcArrays, setSrcArrays] = useState({
    car1: [],
    car2: [],
  });

  const [allPhotos, setAllPhotos] = useState(false);

  const toggleHeartClick = (e, carObj) => {
    console.log("toggleHeartClick was run");
    e.stopPropagation(); //for moreDropdown heart button
    setIsHearted(heartedCars.some((car) => car.id === carObj.id));
    setToggleLike((prev) => !prev);
    dispatch(toggleHeart(carObj));
    setTimeout(() => setToggleLike(false), 2000);
  };

  const toggleLikeSpanStyle = {
    position: "fixed",
    zIndex: 50,
    fontSize: "1rem",
    letterSpacing: "1.1px",
    fontWeight: 550,
    bottom: "2rem",
    padding: "1rem 2rem",
    backgroundColor: "var(--btnBG)",
    borderRadius: "13px",
    color: "white",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
  };

  // console.log("heartedCars", heartedCars);

  const toggleLikeLinkStyle = {
    color: "white",
    textDecoration: "none",
    marginLeft: "1.5rem",
  };

  //// FETCH 'INV' IMAGES (getModelImageURLs - axiosCalls.js)
  useEffect(() => {
    console.log("chosenCars ALL", chosenCars);
    console.log("chosenCars[0]", chosenCars[0]);
    console.log("chosenCars[1]", chosenCars[1]);
    const fetchImages = async () => {
      try {
        const imagesMap = await getModelImageURLs(
          [
            chosenCars[0].images.model_imgs_key,
            chosenCars[1].images.model_imgs_key,
          ],
          true
        );

        setSrcArrays({
          car1: imagesMap[chosenCars[0].images.model_imgs_key],
          car2: imagesMap[chosenCars[1].images.model_imgs_key],
        });
      } catch (err) {
        console.error("Failed to fetch image map", err);
      }
    };

    fetchImages();
  }, [chosenCars]);

  ///RESIZE HANDLER (PhotosTool & TitleBox)
  useEffect(() => {
    const handleResize = () => {
      setMobilePicWidth(window.innerWidth < 1200);
      setMobilePicWidth2(window.innerWidth <= 600);
      setMobileMenuWidth(window.innerWidth < 609); //Actions button
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <PageTransition>
        <div className="page_container">
          <Box
            className="center_box compare_center_box"
            style={{ marginBottom: "0px" }}
          >
            <RightPanel
              mode="compareCars"
              showRightPanel={showRightPanel}
              setShowRightPanel={setShowRightPanel}
              originCar={originCar} /// the car whose 'Change Car' btn was clicked
              setOriginCar={setOriginCar}
              compareCars={compareCars}
              chosenCars={chosenCars}
              heartedCars={heartedCars}
              toggleHeartClick={toggleHeartClick}
              inventory={inventory}
            />
            <AnimatePresence>
              {toggleLike && (
                <motion.span
                  style={toggleLikeSpanStyle}
                  initial={{ opacity: 0, scale: 0.3, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.3, y: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  {!isHearted ? (
                    <>
                      Added to your favorites!{" "}
                      <a href="/favorites" style={toggleLikeLinkStyle}>
                        VIEW
                      </a>
                    </>
                  ) : (
                    "Removed from your favorites"
                  )}
                </motion.span>
              )}
            </AnimatePresence>
            <div
              className="top_row"
              style={{ paddingInline: mobilePicWidth2 ? "10px" : "" }}
            >
              {/* BACK TO SEARCH (CARS) (if !allPhotos)  OR  BACK TO  COMPARE W/DETAILS (default: if allPhotos) */}
              <div className="innerTopRow">
                {!allPhotos ? (
                  <SearchBackBtn
                    mobile={mobilePicWidth2}
                    page="compare"
                    style={{
                      marginBlock: ".5rem",
                      border: "none",
                      padding: ".6rem",
                    }}
                  />
                ) : (
                  <Button
                    page="compare"
                    text="Back to Details"
                    outlineStyle2={true}
                    onClick={() => setAllPhotos(false)}
                    svg={<ImArrowLeft />}
                    style={compareBtnStyle}
                  />
                )}
                <Link
                  to="/"
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: mobilePicWidth2 ? "36vw" : "220px",
                    height: "auto",
                  }}
                >
                  <Logo
                    style={{
                      fill: "var(--invCardTitle)",
                    }}
                  />
                </Link>
                {/* MORE BTN / DROPDOWN */}
                <Dropdown
                  text="More"
                  svg={<HiOutlineDotsVertical />}
                  outlineStyle2={true}
                  style={compareBtnStyle}
                  compare={true}
                  options={moreOptObj}
                  setShowShareModal={setShowShareModal}
                  // setPreventScroll={setPreventScroll}
                />
              </div>
            </div>
            <Box
              className="middle_content compare_middle_content"
              style={{ marginBottom: allPhotos ? "3rem" : "" }}
            >
              <TitleBar>
                <TitleBoxContainer>
                  <TitleBox
                    car={chosenCars[0]}
                    mobileMenuWidth={mobileMenuWidth}
                    setShowRightPanel={setShowRightPanel}
                    setOriginCar={setOriginCar}
                  />
                  <div className="gapBox" />
                  <TitleBox
                    car={chosenCars[1]}
                    mobileMenuWidth={mobileMenuWidth}
                    setShowRightPanel={setShowRightPanel}
                    setOriginCar={setOriginCar}
                  />
                </TitleBoxContainer>
              </TitleBar>
              <PhotosTool
                allPhotos={allPhotos}
                setAllPhotos={setAllPhotos} //for btn inside PhotosTool
                mobile={mobilePicWidth} // 1200 (margin-left: -24px)
                mobile2={mobilePicWidth2} //600 (margin-left: -15px)
                srcArrays={srcArrays}
                chosenCars={chosenCars} ///here empty
                heartedCars={heartedCars}
                toggleHeartClick={toggleHeartClick}
              />
              {/* DETAILS TOOL */}
            </Box>{" "}
            {/* centered by .center_box still, add a separate .middle_content_details with same .middle_content settings */}
            <ShareModal
              // car={carData}
              chosenCars={chosenCars}
              showShareModal={showShareModal}
              setShowShareModal={setShowShareModal}
              // setPreventScroll={setPreventScroll}
              compare={true}
            />
          </Box>
          {!allPhotos && (
            <Box className="center_box details_center_box">
              <DetailsTool chosenCars={chosenCars} location={location} />
            </Box>
          )}
        </div>
      </PageTransition>
    </AnimatePresence>
  );
};

export default Compare;
