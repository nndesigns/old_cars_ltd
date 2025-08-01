import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "../components/buttons/button";
import { useNavigate } from "react-router-dom";
import "./vehiclePage.css";
import CalculatePanel from "../components/calculatePanel.js";
import ImgScrollGallery from "../components/imgScrollGallery.js";
import "../components/vehiclePage/detailSections.css";

// SECTION PARTS
import {
  AboutThePrice,
  Overview,
  FeaturesAndSpecs,
  GetPersonalizedTerms,
  HistoryAndInspection,
  Warranty,
  RatingsReviews,
  DeliveryBox,
} from "../components/vehiclePage/sectionParts.js";

import { motion, AnimatePresence } from "framer-motion"; //vin copy message
import { useSelector } from "react-redux";
import { ImArrowLeft } from "react-icons/im";
import { IoCopyOutline } from "react-icons/io5";
import LikeCalcBox from "../components/likeCalcBox.js";
import { formatPrice } from "../components/utils.js";
import { TabsDropdown } from "../components/vehiclePage/sectionParts.js";

const VehiclePage = ({ inventory }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const heartedCars = useSelector((state) => state.favorites.heartedCars);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toggleLike, setToggleLike] = useState(false);
  const [below900, setBelow900] = useState(window.innerWidth < 900);
  const [below765, setBelow765] = useState(window.innerWidth < 765);
  const detailSectionRef = useRef(null);
  const [detailsAtTop, setDetailsAtTop] = useState(false);
  // TABS & DROPDOWN
  const [activeTab, setActiveTab] = useState(0);
  const [barStyle, setBarStyle] = useState({});

  const tabs = [
    "Overview",
    "Features & Specs",
    "History & Inspection",
    "Warranty",
    "Ratings & Reviews",
  ];

  const tabRefs = useRef([]);
  const sectionRefs = useRef(tabs.map(() => React.createRef()));

  //RESIZE LISTENER
  useEffect(() => {
    const handleResize = () => {
      setBelow900(window.innerWidth < 900);
      setBelow765(window.innerWidth < 765);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //SCROLL LISTENER (DETAILS AT TOP, to place LIKE CALC BOX)
  useEffect(() => {
    const handleScroll = () => {
      if (detailSectionRef.current) {
        const rect = detailSectionRef.current.getBoundingClientRect();
        setDetailsAtTop(rect.top <= 0); // or adjust threshold (e.g., rect.top <= 10)
      }

      // Determine which section is currently at the top of the viewport
      const scrollPosition = window.scrollY;
      const offset = detailSectionRef.current?.offsetHeight + 7 || 80;

      let currentTab = 0;

      sectionRefs.current.forEach((ref, index) => {
        const el = ref?.current;
        if (el) {
          const elTop = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= elTop - offset) {
            currentTab = index;
          }
        }
      });

      setActiveTab(currentTab); //i wrote this
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //<SPAN/> .blueBar dynamic style reset w/ activeTab <button/>
  useLayoutEffect(() => {
    const activeBtn = tabRefs.current[activeTab];
    if (activeBtn) {
      const { offsetWidth, offsetLeft } = activeBtn;
      setBarStyle({ width: offsetWidth, left: offsetLeft - 25 }); // mark it ready
    }
  }, [activeTab]);

  // Wait for inventory to be populated
  if (!inventory || inventory.length === 0) {
    return <div>Loading vehicle details...</div>;
  }
  const carData = inventory.find((car) => car.id === parseInt(id));
  if (!carData) {
    return <div>Vehicle not found</div>;
  }

  // console.log("carData", carData);
  const isHearted = heartedCars.some((car) => car.id === carData.id);

  const handleCopyVin = () => {
    navigator.clipboard
      .writeText(carData.vin)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2 sec
      })
      .catch((err) => console.error("Copy failed", err));
  };

  const searchBackBtnStyle = {
    marginBlock: "1.5rem 1rem",
    display: "flex",
    gap: ".5rem",
    paddingInline: below900 ? ".8rem" : "1.25rem",
    height: below900 ? "40px" : "inherit",
    paddingBlock: below900 ? ".65rem" : "",
  };

  // TABS & DROP DOWN
  const handleTabSelect = (index) => {
    setActiveTab(index);

    const element = sectionRefs.current[index]?.current;
    if (element) {
      const navbarHeight =
        document.querySelector(".tabs_box")?.offsetHeight + 7 || 80;

      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="page_container">
      <Box
        className="center_box vehiclePage_center_box"
        style={{ border: "1px solid blue" }}
      >
        <Box className="middle_content">
          <Button
            text="Search"
            outlineStyle2={true}
            style={searchBackBtnStyle}
            svg={<ImArrowLeft />}
            onClick={() => navigate("/cars")}
          />
          <Box className="mc_top">
            <span>
              <h1 className="carTitle">
                {carData.year} {carData.make} {carData.model}
              </h1>
              <h3 className="carSubtitle">
                {formatPrice(carData.price)}
                <span
                  style={{
                    display: "inline-block",
                    color: "lightgrey",
                    marginInline: ".65rem",
                    fontSize: "1.2em",
                  }}
                >
                  |
                </span>
                {Math.floor(Number(carData.mileage) / 1000)}K miles
              </h3>
            </span>
            {!below900 && (
              <LikeCalcBox
                heartedCount={heartedCars.length}
                setShowRightPanel={setShowRightPanel}
                carData={carData}
                setToggleLike={setToggleLike}
                isHearted={isHearted}
              />
            )}
          </Box>
          <button className="vinCopyBtn" onClick={handleCopyVin}>
            <IoCopyOutline /> VIN {carData.vin}
          </button>
        </Box>

        <AnimatePresence>
          {copied && (
            <motion.span
              className="vinCopiedSpan"
              initial={{ opacity: 0, scale: 0.3, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              VIN Copied!
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {toggleLike && (
            <motion.span
              className="toggleLikeSpan"
              initial={{ opacity: 0, scale: 0.3, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              {isHearted ? (
                <>
                  Added to your favorites! <a href="/favorites">VIEW</a>
                </>
              ) : (
                "Removed from your favorites"
              )}
            </motion.span>
          )}
        </AnimatePresence>
        <CalculatePanel
          show={showRightPanel}
          setShowRightPanel={setShowRightPanel}
        />
        <ImgScrollGallery
          model_imgs_key={carData.images.model_imgs_key}
          below900={below900}
        />
        {/******* TABS & DROPDOWN *******/}
        <Box className="middle_content tabs_box" ref={detailSectionRef}>
          {below900 ? (
            <TabsDropdown
              tabs={tabs}
              handleTabSelect={handleTabSelect}
              activeTab={activeTab}
              sectionRefs={sectionRefs}
            />
          ) : (
            tabs.map((label, index) => (
              <button
                key={index}
                className={`tab_btn ${activeTab === index ? "active" : ""}`}
                onClick={() => handleTabSelect(index)}
                ref={(el) => (tabRefs.current[index] = el)}
              >
                {label}
              </button>
            ))
          )}
          <span className="blueBar" style={barStyle} />
          {detailsAtTop && (
            <LikeCalcBox
              heartedCount={heartedCars.length}
              setShowRightPanel={setShowRightPanel}
              carData={carData}
              setToggleLike={setToggleLike}
              isHearted={isHearted}
              detailSection={true}
            />
          )}
        </Box>
        <hr className="fullWidth_hr" />

        <Box className="middle_content" style={{ border: "1px solid red" }}>
          <span className="top_grid">
            <AboutThePrice price={parseInt(carData.price)} />
            <Overview
              carData={carData}
              mobile={below900}
              sectionRefs={sectionRefs}
            />
            <FeaturesAndSpecs sectionRefs={sectionRefs} />
            <DeliveryBox />
          </span>
          <GetPersonalizedTerms />
          <HistoryAndInspection sectionRefs={sectionRefs} />
          <Warranty sectionRefs={sectionRefs} />
          <RatingsReviews sectionRefs={sectionRefs} />
        </Box>
      </Box>
    </div>
  );
};

export default VehiclePage;
