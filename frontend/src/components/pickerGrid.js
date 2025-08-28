import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/material/Button";
import { CustomCard } from "./customCards";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { makeModelSearch } from "./searchbar/searchHandlers.js";

// const PickerGrid = ({ models }) => {
//   console.log("rec'd models", models);
//   const [currentTab, setCurrentTab] = useState(1);
//   const [fetchedImagesMap, setFetchedImagesMap] = useState([]);

//   useEffect(() => {
//     if (models && typeof models === "object") {
//       const allModelImgKeys = [
//         ...new Set(
//           Object.values(models) // grab all category arrays
//             .flat() // flatten into one array of model objects
//             .map((modelObj) =>
//               `${modelObj.make} ${modelObj.model}`.toLowerCase()
//             )
//         ),
//       ];

//       //CALLING DYNAMO API (IMG URL)
//       const getModelImageURLs = async () => {
//         try {
//           const res = await axios.post("http://localhost:5001/api/batch", {
//             modelIds: allModelImgKeys,
//             mobile: true,
//           });

//           setFetchedImagesMap(res.data);
//         } catch (error) {
//           console.error("Frontend fetch error:", error);
//         }
//       };

//       if (fetchedImagesMap.length === 0) {
//         getModelImageURLs();
//       }
//     }
//   }, [models, fetchedImagesMap]);

//   //BUTTONS
//   const btnBoxStyle = {
//     borderBottom: "1px solid var(--greyBorder)",
//     display: "flex",
//     justifyContent: "flex-start",
//   };

//   return (
//     <Box>
//       {/*  BTN TOP BOX */}
//       <Box sx={btnBoxStyle}>
//         {Object.keys(models).map((keyName, index) => (
//           <Button
//             key={index}
//             sx={{
//               position: "relative",
//               paddingInline: "12px",
//               height: "57px",
//               fontSize: ".95em",
//               letterSpacing: ".75px",
//               color:
//                 currentTab === index + 1
//                   ? "var(--iconColor)"
//                   : "rgba(83, 105, 117, .85)",
//               borderRadius: "0px",
//               fontWeight: "550",

//               ":hover": {
//                 color: "var(--iconColor)",
//                 backgroundColor: "transparent",
//               },
//               "&::after": {
//                 content: '""',
//                 position: "absolute",
//                 bottom: 0,
//                 left: 0,
//                 width: "100%",
//                 height: "5px",
//                 backgroundColor:
//                   currentTab === index + 1 ? "var(--iconColor)" : "transparent",
//               },
//               transition: "background-color .3s ease, color .2s ease",
//             }}
//             onClick={() => setCurrentTab(index + 1)}
//           >
//             {keyName}
//           </Button>
//         ))}
//       </Box>
//       {/* GRID BTM BOX */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",

//           // gridTemplateRows: "repeat(auto, 130px)",
//           gridAutoRows: "138px",
//           gap: "2%, 10%",
//           columnGap: "1.3rem",
//           rowGap: "1.3rem",
//           paddingBlock: "1.3rem",
//           "@media(max-width:1150px)": {
//             gridTemplateRows: "repeat(auto, 120px)",
//             gridAutoRows: "120px",
//           },
//         }}
//       >
//         {(currentTab === 1
//           ? models.SUVS
//           : currentTab === 2
//           ? models.TRUCKS
//           : currentTab === 3
//           ? models.CROSSOVERS
//           : models.SEDANS
//         )?.map((item, index) => (
//           <CustomCard key={index}>
//             <h3 style={{ lineHeight: "1.5rem" }}>
//               {item.make}
//               <br />
//               {item.model.split(" ").length > 4
//                 ? item.model.split(" ").slice(0, 4).join(" ") + "..."
//                 : item.model}
//             </h3>
//             <img
//               style={{
//                 height: "100%",
//                 width: "195px",
//                 minWidth: "195px",
//                 objectFit: "cover",

//                 objectPosition: "center",
//                 alignSelf: "flex-end",
//               }}
//               src={fetchedImagesMap[item.images.model_imgs_key]}
//               alt={`${item.make}_${item.model}_model_img`}
//             />
//           </CustomCard>
//         ))}

//         <CustomCard modelUse={false} lastCard={true}>
//           <h3>
//             See All{" "}
//             {currentTab === 1
//               ? "SUVs"
//               : currentTab === 2
//               ? "Trucks"
//               : currentTab === 3
//               ? "Crossovers"
//               : "Sedans"}
//           </h3>
//         </CustomCard>
//       </Box>
//     </Box>
//   );
// };

const PickerGrid = ({
  models,
  setAppliedFilters,
  setOrderedFilters,
  handleClearFilters,
}) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [slideDirection, setSlideDirection] = useState(0); // 1 = next, -1 = prev
  const [fetchedImagesMap, setFetchedImagesMap] = useState([]);

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

  // Handle tab click
  const handleTabClick = (index) => {
    setSlideDirection(index + 1 > currentTab ? 1 : -1);
    setCurrentTab(index + 1);
  };

  // Button styles
  const btnBoxStyle = {
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
            onClick={() => handleTabClick(index)}
          >
            {keyName}
          </Button>
        ))}
      </Box>

      {/* Grid slider */}
      <Box sx={{ position: "relative", overflow: "hidden", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            width: `${categoryKeys.length * 100}%`,
            transform: `translateX(-${
              (currentTab - 1) * (100 / categoryKeys.length)
            }%)`,
            // transition: "transform 0.77s cubic-bezier(0.8, 0, 0.15, 1.12)",
            transition: "transform 0.85s cubic-bezier(0.8, 0, 0.1, 1.16)",
          }}
        >
          {categoryKeys.map((key) => (
            <Box
              key={key}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gridAutoRows: "138px",
                gap: "2%, 10%",
                columnGap: "1.3rem",
                rowGap: "1.3rem",
                paddingBlock: "1.3rem",
                width: `${100 / categoryKeys.length}%`,
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
                      setAppliedFilters,
                      setOrderedFilters,
                      handleClearFilters,
                      "Model",
                      item
                      // inputRef,
                      // setInvSearch
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
                    setAppliedFilters,
                    setOrderedFilters,
                    handleClearFilters,
                    "Style",
                    key === "SUVS"
                      ? "SUV / 4x4"
                      : key === "TRUCKS"
                      ? "pickup"
                      : key === "CROSSOVERS"
                      ? ["hatchback", "van", "station wagon"]
                      : "sedan",
                    key
                    // inputRef,
                    // setInvSearch
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
