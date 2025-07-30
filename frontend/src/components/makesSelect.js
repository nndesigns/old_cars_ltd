import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";

import Button from "../components/buttons/button.js";
import CustomSelect from "./customSelect.js";

const MakesSelect = ({ makes, setAppliedFilters, setOrderedFilters }) => {
  const [selectedMake, setSelectedMake] = useState("");
  const navigate = useNavigate();

  const handleShopThisMakeClick = () => {
    if (!selectedMake) return; // guard

    // Update appliedFilters to only include the selected make
    setAppliedFilters((prev) => ({
      ...prev,
      makes: [selectedMake], // replace existing makes array
    }));

    // Update orderedFilters: remove 'makes' if it exists, then add it at the end
    setOrderedFilters((prev) => {
      const filtered = prev.filter((f) => f !== "makes");
      return [...filtered, "makes"];
    });

    // Navigate to /cars
    navigate("/cars");
  };

  return (
    <div className="wrapper_box makes_wrapper">
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          paddingTop: "22px",
          width: "560px",
          maxWidth: "100%",

          "& > *": {
            flex: 1,
            "&:last-child": {
              alignSelf: "flex-end",
            },
          },
          "@media (max-width:600px)": {
            flexDirection: "column",
            paddingInline: "1rem",

            "& >*:last-child": {
              alignSelf: "auto",
            },
          },
        }}
      >
        <CustomSelect
          prop={selectedMake}
          setProp={setSelectedMake}
          array={makes}
          label="Make"
        />
        <Button
          text="SHOP THIS MAKE"
          disabled={!selectedMake}
          custom={true}
          style={{
            paddingInline: "0px",
            "@media(minWidth:601px)": {
              alignSelf: "flex-end",
            },
          }}
          onClick={handleShopThisMakeClick}
        />
      </Box>
    </div>
  );
};

export default MakesSelect;
