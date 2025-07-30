import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "./customSelect";
import Button from "./buttons/button";
import { Box } from "@mui/material";
import { CgArrowRight } from "react-icons/cg";

const RangeSelect = ({
  range,
  adjCounts,
  yearOptions,
  leftPanel,
  handleUpdateRange,
  yearFilter,
  // home,
}) => {
  const [minOptions, setMinOptions] = useState([]);
  const [maxOptions, setMaxOptions] = useState([]);
  const [minOption, setMinOption] = useState();
  const [maxOption, setMaxOption] = useState();
  const [below601, setBelow601] = useState(window.innerWidth < 601);

  const navigate = useNavigate();

  useEffect(() => {
    let newMin = range[0]; //ex 1957
    let newMax = range[1]; //ex 1997
    setMinOption(newMin);
    setMaxOption(newMax);

    if (!yearFilter) {
      //Array of price points
      const adjCountsNames = adjCounts.map((obj) => obj.name);

      //map over adjCountsNames, and only include values which are equal to or greateer than newMin, and also less than newMax
      const newMinOptions = adjCountsNames.filter((name) => name <= newMax);
      const newMaxOptions = adjCountsNames.filter((name) => name >= newMin);

      setMinOptions(newMinOptions);
      setMaxOptions(newMaxOptions);
    } else {
      // all years <= max
      const newMinOptions = yearOptions.filter((year) => year <= newMax);
      // all years >= min
      const newMaxOptions = yearOptions.filter((year) => year >= newMin);

      setMinOptions(newMinOptions);
      setMaxOptions(newMaxOptions);
    }
  }, [range, adjCounts, yearOptions, yearFilter]);

  useEffect(() => {
    const handleResize = () => {
      setBelow601(window.innerWidth < 601);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        ...(!leftPanel && {
          display: "flex",
          flexDirection: below601 ? "column" : "row",
          justifyContent: below601 ? "initial" : "space-between",
          alignItems: below601 ? "initial" : "center",
          gap: below601 ? 0 : "0.75rem",

          "& > *": {
            flex: below601 ? "initial" : "1", // each child takes equal space in row
            width: below601 ? "100%" : "auto", // override specific width if needed
          },

          "& > *:last-child": {
            flex: "initial",
            alignSelf: "flex-end",
            width: below601 ? "100%" : "5rem",
          },
        }),
      }}
    >
      <CustomSelect
        prop={minOption}
        setProp={setMinOption}
        array={minOptions}
        label={yearFilter ? "Min Year" : "Min Price"}
        onChange={(value) => handleUpdateRange(null, value, null, "minSelect")}
      />
      <CustomSelect
        prop={maxOption}
        setProp={setMaxOption}
        array={maxOptions}
        label={yearFilter ? "Max Year" : "Max Price"}
        onChange={(value) => handleUpdateRange(null, value, null, "maxSelect")}
        secondCS={true}
        leftPanel={leftPanel}
        above601={!below601}
      />
      {!leftPanel && (
        <Button
          onClick={() => navigate("/cars")}
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: below601 ? "1em" : "",
          }}
          text={
            below601 ? (
              "SHOP WITH RANGE"
            ) : (
              <CgArrowRight
                style={{
                  fontSize: "2em",
                  color: "white",
                  position: "absolute",
                }}
              />
            )
          }
        />
      )}
      {leftPanel && !yearOptions && (
        <span
          style={{
            fontSize: ".7em",
            marginBlock: ".5rem 0",
            opacity: ".7",
            display: "inline-block",
            width: "100%",
            textAlign: "center",
          }}
        >
          Price range reflects current inventory
        </span>
      )}
    </Box>
  );
};

//searchbar: make pop-down menu, api call to inventory to search matches in  'inventory' columns with text whenever user input is typed into. PLus automativc popdown w/default suggestions when clicking into intut at all.

export default RangeSelect;
