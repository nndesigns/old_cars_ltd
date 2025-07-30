import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/material/Button";
import { CustomCard } from "./customCards";
import axios from "axios";

const PickerGrid = ({ models }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [fetchedImagesMap, setFetchedImagesMap] = useState([]);

  useEffect(() => {
    if (models && typeof models === "object") {
      const allModelImgKeys = [
        ...new Set(
          Object.values(models) // grab all category arrays
            .flat() // flatten into one array of model objects
            .map((modelObj) =>
              `${modelObj.make} ${modelObj.model}`.toLowerCase()
            )
        ),
      ];

      //CALLING DYNAMO API (IMG URL)
      const getModelImageURLs = async () => {
        try {
          const res = await axios.post("http://localhost:5001/api/batch", {
            modelIds: allModelImgKeys,
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

  //BUTTONS
  const btnBoxStyle = {
    borderBottom: "1px solid var(--greyBorder)",
    display: "flex",
    justifyContent: "flex-start",
  };

  return (
    <Box>
      {/*  BTN TOP BOX */}
      <Box sx={btnBoxStyle}>
        {Object.keys(models).map((keyName, index) => (
          <Button
            key={index}
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
              borderRadius: "0px",
              fontWeight: "550",

              ":hover": {
                color: "var(--iconColor)",
                backgroundColor: "transparent",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "5px",
                backgroundColor:
                  currentTab === index + 1 ? "var(--iconColor)" : "transparent",
              },
              transition: "background-color .3s ease, color .2s ease",
            }}
            onClick={() => setCurrentTab(index + 1)}
          >
            {keyName}
          </Button>
        ))}
      </Box>
      {/* GRID BTM BOX */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",

          // gridTemplateRows: "repeat(auto, 130px)",
          gridAutoRows: "138px",
          gap: "2%, 10%",
          columnGap: "1.3rem",
          rowGap: "1.3rem",
          paddingBlock: "1.3rem",
          "@media(max-width:1150px)": {
            gridTemplateRows: "repeat(auto, 120px)",
            gridAutoRows: "120px",
          },
        }}
      >
        {(currentTab === 1
          ? models.SUVS
          : currentTab === 2
          ? models.TRUCKS
          : currentTab === 3
          ? models.CROSSOVERS
          : models.SEDANS
        )?.map((item, index) => (
          <CustomCard key={index}>
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

                alignSelf: "flex-end",
              }}
              src={fetchedImagesMap[item.images.model_imgs_key]}
              alt={`${item.make}_${item.model}_model_img`}
            />
          </CustomCard>
        ))}

        <CustomCard modelUse={false} lastCard={true}>
          <h3>
            See All{" "}
            {currentTab === 1
              ? "SUVs"
              : currentTab === 2
              ? "Trucks"
              : currentTab === 3
              ? "Crossovers"
              : "Sedans"}
          </h3>
        </CustomCard>
      </Box>
    </Box>
  );
};

export default PickerGrid;
