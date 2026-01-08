import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/joy/Box";
import Button from "@mui/material/Button";
import { CustomCard } from "./customCards";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { makeModelSearch } from "./searchbar/searchHandlers.js";

const PickerGrid = ({
  models,
  // setAppliedFilters,
  // setOrderedFilters,
  // handleClearFilters,
}) => {
  const [currentTab, setCurrentTab] = useState(1);
  // const [slideDirection, setSlideDirection] = useState(0); // 1 = next, -1 = prev
  const [fetchedImagesMap, setFetchedImagesMap] = useState([]);
  const scrollRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const buttonRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryKeys = ["SUVS", "TRUCKS", "CROSSOVERS", "SEDANS"];

  // Fetch images
  useEffect(() => {
    if (models && typeof models === "object") {
      const allModelImgKeys = [
        ...new Set(
          Object.values(models)
            .flat()
            .map((modelObj) =>
              `${modelObj.make} ${modelObj.model}`.toLowerCase()
            )
        ),
      ];

      const getModelImageURLs = async () => {
        try {
          const res = await axios.post("http://localhost:5001/api/batch", {
            modelIds: allModelImgKeys,
            mobile: true,
          });
          setFetchedImagesMap(res.data);
        } catch (error) {
          console.error("Frontend fetch error:", error);
        }
      };

      if (fetchedImagesMap.length === 0) {
        getModelImageURLs();
      }
    }
  }, [models, fetchedImagesMap]);

  useEffect(() => {
    const activeBtn = buttonRefs.current[currentTab - 1];
    if (activeBtn) {
      setIndicatorStyle({
        width: activeBtn.offsetWidth,
        left: activeBtn.offsetLeft,
      });
    }
  }, [currentTab]);

  // Handle tab click
  const handleTabClick = (index) => {
    if (!scrollRef.current) return;
    const slideWidth = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * slideWidth,
      behavior: "smooth",
    });
    setCurrentTab(index + 1); // immediate update
  };

  // Handle scrolling
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const slideWidth = scrollRef.current.firstChild.offsetWidth; // width of one slide
    const newIndex = Math.round(scrollLeft / slideWidth);

    if (newIndex + 1 !== currentTab) {
      // setSlideDirection(newIndex + 1 > currentTab ? 1 : -1);
      setCurrentTab(newIndex + 1);
    }
  };

  // Button styles
  const btnBoxStyle = {
    position: "relative",
    borderBottom: "1px solid var(--greyBorder)",
    display: "flex",
    justifyContent: "flex-start",
  };

  return (
    <Box>
      {/* Top buttons */}
      <Box sx={btnBoxStyle}>
        {categoryKeys.map((keyName, index) => (
          <Button
            key={index}
            ref={(el) => (buttonRefs.current[index] = el)}
            sx={{
              position: "relative",
              paddingInline: "12px",
              height: "57px",
              fontSize: ".95em",
              letterSpacing: ".75px",
              color:
                currentTab === index + 1
                  ? "var(--iconColor)"
                  : "rgba(83, 105, 117, .85)",
              borderRadius: 0,
              fontWeight: 550,
              ":hover": {
                color: "var(--iconColor)",
                backgroundColor: "transparent",
              },
              transition: "color .2s ease",
            }}
            onClick={() => handleTabClick(index)}
          >
            {keyName}
          </Button>
        ))}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            height: "5px",
            backgroundColor: "var(--iconColor)",
            transition: "left 0.3s ease, width 0.3s ease",
          }}
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      </Box>

      {/* Grid slider */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          className="parent_box"
          onScroll={handleScroll}
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto", // must be here for snapping
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            width: "100%",
          }}
        >
          {categoryKeys.map((key) => (
            <Box
              key={key}
              sx={{
                scrollSnapAlign: "start",
                flexShrink: 0, // prevent shrinking
                width: "100%", // each child takes full container width
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gridAutoRows: "138px",
                columnGap: "1.3rem",
                rowGap: "1.3rem",
                paddingBlock: "1.3rem",
                "@media(max-width:1150px)": {
                  gridAutoRows: "120px",
                },
              }}
            >
              {models[key]?.slice(0, 10).map((item, index) => (
                <CustomCard
                  key={index}
                  onClick={() =>
                    makeModelSearch(
                      navigate,
                      "home",
                      dispatch,
                      /*  setAppliedFilters,
                      setOrderedFilters,
                      handleClearFilters, */
                      "Model",
                      item
                    )
                  }
                >
                  <h3 style={{ lineHeight: "1.5rem" }}>
                    {item.make}
                    <br />
                    {item.model.split(" ").length > 4
                      ? item.model.split(" ").slice(0, 4).join(" ") + "..."
                      : item.model}
                  </h3>
                  <img
                    style={{
                      height: "100%",
                      width: "195px",
                      minWidth: "195px",
                      objectFit: "cover",
                      objectPosition: "center",
                      alignSelf: "flex-end",
                    }}
                    src={fetchedImagesMap[item.images.model_imgs_key]}
                    alt={`${item.make}_${item.model}_model_img`}
                  />
                </CustomCard>
              ))}

              <CustomCard
                modelUse={false}
                lastCard={true}
                onClick={() =>
                  makeModelSearch(
                    navigate,
                    "home",
                    dispatch,
                    /*  setAppliedFilters,
                    setOrderedFilters,
                    handleClearFilters, */
                    "Style",
                    key === "SUVS"
                      ? "SUV / 4x4"
                      : key === "TRUCKS"
                      ? "pickup"
                      : key === "CROSSOVERS"
                      ? ["hatchback", "van", "station wagon"]
                      : "sedan",
                    key
                  )
                }
              >
                <h3>See All {key}</h3>
              </CustomCard>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PickerGrid;
