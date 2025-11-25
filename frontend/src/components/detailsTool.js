import React, { useRef, useState, useEffect } from "react";
import {
  cityToZipMap,
  getDistanceMiles,
  formatPrice,
  mileageFormatter,
} from "./utils";

import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { CiLocationOn } from "react-icons/ci";
import { FaStar } from "react-icons/fa6"; // FULL STAR
import { FaRegStarHalfStroke } from "react-icons/fa6"; //HALF STAR
import { FaGear } from "react-icons/fa6"; //GEAR
import { FaGaugeHigh } from "react-icons/fa6"; //GAUGE
import { IoCheckmark } from "react-icons/io5"; //CHECKMARK (YES)
import { AiOutlineClose } from "react-icons/ai"; // X (NO)

const handleGetCoords = async (zip) => {
  // const query = `${zip}`;
  const url = `http://localhost:5001/api/locations/coords?zip=${zip}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("handleGetCoords error:", err);
    return [];
  }
};

const DetailsTool = ({ chosenCars, location }) => {
  const detailSectionRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  //DISTANCES
  const [distances, setDistances] = useState([null, null]);

  const tabs = ["Highlights", "Similarities", "Differences", "Specifications"];
  const sectionRefs = useRef(tabs.map(() => React.createRef()));

  useEffect(() => {
    const tabsContainer = tabsContainerRef.current;
    if (!tabsContainer) return;

    const handleScroll = () => {
      const tabsBottom = tabsContainer.getBoundingClientRect().bottom; // pixel position of sticky bottom
      let currentTab = 0;

      sectionRefs.current.forEach((ref, index) => {
        const section = ref.current;

        if (section) {
          const rect = section.getBoundingClientRect();

          // when the top of section reaches or passes the bottom of tabs
          if (rect.top <= tabsBottom + 1) {
            currentTab = index;
          }
        }
      });

      setActiveTab((prev) => (prev !== currentTab ? currentTab : prev));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run on mount to set initial tab
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //////// HANDLE TAB SELECT
  const handleTabSelect = (index) => {
    const element = sectionRefs.current[index]?.current;
    if (element) {
      const navbarHeight =
        document.querySelector(".tabs_container")?.offsetHeight + 213;

      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
    setActiveTab(index);
  };

  const underline = {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    background: "var(--invCardTitle)",
  };
  /// CALCULATE DISTANCE
  async function calculateDistance(carObj) {
    const carZip = cityToZipMap[`${carObj.city}, ${carObj.state}`];
    const carLocObj = await handleGetCoords(carZip);
    const distBetweenMiles = getDistanceMiles(
      parseFloat(location.latitude),
      parseFloat(location.longitude),
      parseFloat(carLocObj.latitude),
      parseFloat(carLocObj.longitude)
    );

    return distBetweenMiles;
  }
  // UPDATE DISTANCES WHEN CHOSEN CARS CHANGES
  useEffect(() => {
    async function fetchDistances() {
      if (!location || chosenCars.length < 2) return;

      const dist1 = await calculateDistance(chosenCars[0]);
      const dist2 = await calculateDistance(chosenCars[1]);

      setDistances([dist1, dist2]);
    }

    fetchDistances();
  }, [chosenCars, location]);

  //SIMILARITIES/DIFF DETAILS
  const [simDiffSets] = useState(() => {
    const simDiff_details = [
      "ABS Brakes",
      "AM/FM Stereo",
      "Air Conditioning",
      "Auxiliary Audio Input",
      "Bluetooth Technology",
      "Cruise Control",
      "Lane Departure Warning",
      "Overhead Airbags",
      "Parking Sensors",
      "Power Locks",
      "Power Mirrors",
      "Power Windows",
      "Rear Defroster",
      "Rear View Camera",
      "Side Airbags",
      "Traction Control",
      "Cloth Seats",
      "Manual Transmission",
      "4WD/AWD",
      "Alloy Wheels",
      "Android Auto",
      "Apple CarPlay",
      "Automatic Transmission",
      "Blind Spot Monitor",
      "Fold-Away Third Row",
      "Front Seat Heaters",
      "Heated Steering Wheel",
      "Leather Seats",
      "Memory Seats",
      "Panoramic Sunroof",
      "Power Hatch/Deck Lid",
      "Power Seat(s)",
      "Rear Air Conditioning",
      "Satellite Radio Ready",
      "SiriusXM Trial Available",
      "Smart Key",
      "Third Row Seat",
    ];

    const shuffleArray = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    // ✅ Generate the randomized sets only once
    const shuffled = shuffleArray(simDiff_details);
    const half = Math.ceil(shuffled.length / 2);
    const similarities = shuffled.slice(0, half);
    const differences = shuffled.slice(half);

    return { similarities, differences };
  });

  const HORSEPOWER_VALUES = [
    150, // compact sedans
    180, // small SUVs
    200, // midsize sedans
    225, // light sport trims
    250, // performance 4-cyl / base 6-cyl
    275, // sporty coupes / small V6
    300, // mid-level performance cars
    350, // muscle cars / V8 light trucks
    400, // performance V8s
    450, // high-performance sports cars
  ];

  function assignHorsepower() {
    const randomIndex = Math.floor(Math.random() * HORSEPOWER_VALUES.length);
    return HORSEPOWER_VALUES[randomIndex];
  }

  const [horsepower, setHorsepower] = useState([
    assignHorsepower(),
    assignHorsepower(),
  ]);

  const RPM = [5000, 6000];
  const torque = [178, 295];
  const torqueRPM = [4000, 3400];

  function capitalize(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function assignStyle(value) {
    if (!value) return null;
    // Split into an array, trimming spaces
    const stylesArray = value.split(",").map((s) => s.trim().toLowerCase());
    // Define the “special” styles and their fallback equivalents
    const specialStyles = {
      luxury: "sedan",
      "muscle car": "coupe",
      convertible: "coupe",
    };
    // 1️⃣ If there's only one style
    if (stylesArray.length === 1) {
      const style = stylesArray[0];
      if (specialStyles[style]) {
        // Luxury → Sedan, Muscle Car / Convertible → Coupe
        return capitalize(specialStyles[style]);
      }
      return capitalize(style);
    }
    // 2️⃣ If multiple styles are present
    // Filter out luxury, muscle car, convertible
    const prioritized = stylesArray.filter(
      (s) => !["luxury", "muscle car", "convertible"].includes(s)
    );
    if (prioritized.length > 0) {
      // Return the first "non-special" style
      return capitalize(prioritized[0]);
    } else {
      // All styles are special (e.g., "luxury,convertible,muscle car")
      const first = stylesArray[0];
      return capitalize(specialStyles[first] || first);
    }
  }

  function assignTrim(value) {
    if (!value) return "Base";

    // Normalize and split the style string into an array
    const stylesArray = value.split(",").map((s) => s.trim().toLowerCase());

    // Define mapping between style keywords and trim values
    const trimMap = [
      { style: "luxury", trim: "Premium" },
      { style: "muscle car", trim: "GT" },
      { style: "coupe", trim: "Sport" },
      { style: "suv / 4x4", trim: "Off-Road" },
      { style: "pickup", trim: "Limited" },
      { style: "convertible", trim: "Touring" },
    ];

    // Loop through trimMap in the given order and assign the first match
    for (const { style, trim } of trimMap) {
      if (stylesArray.includes(style)) {
        return trim;
      }
    }

    // Default case
    return "Base";
  }

  function assignCylinders(value) {
    if (!value || typeof value !== "string") return null;
    value = value.trim();
    // 1️⃣ If it includes "Rotary" → always 4
    if (value.toLowerCase().includes("rotary")) {
      return 4;
    }
    // 2️⃣ If it includes a "V" followed by digits (e.g. "V6", "V8", "V12")
    const vMatch = value.match(/V(\d+)/i);
    if (vMatch) {
      return parseInt(vMatch[1]);
    }
    // 3️⃣ Otherwise, look for another number that is *not* part of a decimal
    // Example: "Flat-6 3.2L" → capture 6, not 3.2
    const numMatch = value.match(/(\d+)(?!\.\d)/);
    if (numMatch) {
      return parseInt(numMatch[1]);
    }
    // 4️⃣ If no rule applies
    return null;
  }

  function assignEngine(value) {
    if (!value || typeof value !== "string") return null;

    // Try to find something like "3.5L" or "7L"
    const match = value.match(/(\d+(\.\d+)?)L/i);

    if (match) {
      // Return the part that includes the 'L' (e.g. "7.5L")
      return match[0];
    }

    // Default if no "L" value found
    return "5.5L";
  }

  function assignDT(value) {
    if (value === "AWD") {
      return "All Wheel Drive";
    } else if (value === "FWD") {
      return "Front Wheel Drive";
    } else if (value === "RWD") {
      return "Rear Wheel Drive";
    }
  }

  // Helper to capitalize the first letter of each word

  /// DETAIL MAPPING
  const HighlightsMap = {
    Location: (car) => {
      const carIndex = chosenCars.findIndex((c) => c.id === car.id);
      const dist = carIndex !== -1 ? distances[carIndex] : null;

      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.2rem",
            minWidth: "246px",
          }}
        >
          <CiLocationOn style={{ fontSize: "2.5rem" }} />
          <span>
            <strong>Available in: </strong>
            <br />
            {car.city}, {car.state}{" "}
            {dist !== null ? `(${dist} miles)` : "(loading...)"}
          </span>
        </span>
      );
    },
    Price: (car) => formatPrice(car.price),
    "Customer Reviews": (car) => {
      const carIndex = chosenCars.findIndex((c) => c.id === car.id);
      if (carIndex === 0) {
        return (
          <span className="icon_span">
            <span className="inner">
              {Array.from({ length: 4 }).map((_, i) => (
                <FaStar className="svg starSVG" key={i} />
              ))}
              <FaRegStarHalfStroke className="svg starSVG" />
            </span>{" "}
            <span>4.5 / 5 (10 Reviews)</span>
          </span>
        );
      } else {
        return (
          <span className="icon_span">
            <span className="inner">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar className="svg starSVG" key={i} />
              ))}{" "}
            </span>
            <span>5 / 5 (5 Reviews)</span>
          </span>
        );
      }
    },
    "Reliability Rating": (car) => {
      const carIndex = chosenCars.findIndex((c) => c.id === car.id);
      if (carIndex === 0) {
        return (
          <span className="icon_span">
            <span className="inner">
              {Array.from({ length: 3 }).map((_, i) => (
                <FaGear className="svg gearSVG" key={i} />
              ))}
              <FaGear className="svg gearSVG empty" />
              <FaGear className="svg gearSVG empty" />
            </span>{" "}
            <span>3 / 5</span>
          </span>
        );
      } else {
        return (
          <span className="icon_span">
            <span className="inner">
              {Array.from({ length: 4 }).map((_, i) => (
                <FaGear className="svg gearSVG" key={i} />
              ))}
              <FaGear className="svg gearSVG empty" />
            </span>
            <span>4 / 5</span>
          </span>
        );
      }
    },
    "Feature Summary": (car) => {
      const carIndex = chosenCars.findIndex((c) => c.id === car.id);
      if (carIndex === 0) {
        return (
          <span className="icon_span">
            <span className="inner">
              <FaGaugeHigh className="gauge gauge1" />
            </span>{" "}
            <span>Basic</span>
          </span>
        );
      } else {
        return (
          <span className="icon_span">
            <span className="inner">
              <FaGaugeHigh className="gauge" />
            </span>
            <span>Well-Equipped</span>
          </span>
        );
      }
    },
    MPG: (car) => {
      return `${car.mpg_city} city / ${car.mpg_hwy} hwy`;
    },
    Mileage: (car) => mileageFormatter(car.mileage),
    Color: (car) => {
      return (
        <span className="color_container">
          <span className="colorBox">
            <span
              className="colorCircle"
              style={{
                backgroundColor: car.color.toLowerCase(),
                opacity: 0.65,
              }}
            />
            <span className="colorBox_textBox">
              <h4>{car.color}</h4>
              <h5>Exterior</h5>
            </span>
          </span>
          <span className="colorBox">
            <span
              className="colorCircle"
              style={{
                backgroundColor: "black",
                opacity: 0.65,
              }}
            />
            <span className="colorBox_textBox">
              <h4>Black</h4>
              <h5>Interior</h5>
            </span>
          </span>
        </span>
      );
    },
  };

  const SimilaritiesMap = simDiffSets.similarities.reduce((acc, feature) => {
    acc[feature] = () => (
      <span className="icon_span">
        <IoCheckmark className="svg" style={{ color: "green" }} /> Yes
      </span>
    );
    return acc;
  }, {});

  const DifferencesMap = simDiffSets.differences.reduce((acc, feature) => {
    const randomYesCar = Math.random() < 0.5 ? 0 : 1;
    acc[feature] = (_, carIndex) => (
      <>
        {carIndex === randomYesCar ? (
          <span className="icon_span">
            <IoCheckmark className="svg" style={{ color: "green" }} /> Yes
          </span>
        ) : (
          <span className="icon_span">
            <AiOutlineClose className="svg" style={{ color: "red" }} /> No
          </span>
        )}
      </>
    );
    return acc;
  }, {});

  const SpecificationsMap = {
    Body: (car) => assignStyle(car.style),
    Trim: (car) => assignTrim(car.style),
    Cylinders: (car) => assignCylinders(car.engine),
    "Drive Train": (car) => assignDT(car.drive_type),
    Engine: (car) => assignEngine(car.engine),
    "Fuel Type": () => "Gas",
    Horsepower: (_, i) => horsepower[i],
    RPM: (_, i) => RPM[i],
    Size: (car) => assignEngine(car.engine),
    Torque: (_, i) => torque[i],
    "Torque RPM": (_, i) => torqueRPM[i],
    Transmission: (car) => car.transmission,
    "Stock Number": (car) => car.id,
  };

  const mapLookup = {
    Highlights: HighlightsMap,
    Similarities: SimilaritiesMap,
    Differences: DifferencesMap,
    Specifications: SpecificationsMap,
  };

  return (
    <>
      {/* TABS  CONTAINER*/}
      <div className="tabs_container" ref={tabsContainerRef}>
        <div className="tabsContainer_inner">
          <AnimatePresence>
            {tabs.map((label, index) => (
              <motion.li
                key={index}
                initial={false}
                animate={{
                  backgroundColor: "transparent",
                  color: index === activeTab ? "rgb(56,111,165)" : "#415658",
                }}
                className="tab_li"
                onClick={() => {
                  //       setActiveTab(index);
                  handleTabSelect(index);
                }}
              >
                {`${label}`}
                {/* UNDERLINE ANIMATION */}
                {index === activeTab ? (
                  <motion.div
                    style={underline}
                    layoutId="underline"
                    id="underline"
                  />
                ) : null}
              </motion.li>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="middle_content details_middle">
        <div className="details_table" ref={detailSectionRef}>
          <section
            className="detail_section highlights_details"
            ref={sectionRefs.current[0]}
          >
            <h1 className="details_h1">{tabs[0]}</h1>
            {Object.entries(mapLookup[tabs[0]]).map(([title, fn]) => (
              <div className="detail_box" key={title}>
                <h3 className="detail_title">{title}</h3>
                <div className="detailComp_box">
                  {[0, 1].map((i) => (
                    <div className={`detail car${i + 1}_detail`} key={i}>
                      {fn(chosenCars[i], i)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <hr className="sectionDiv_hr" />

          <section
            className="detail_section similarities_details"
            ref={sectionRefs.current[1]}
          >
            <h1 className="details_h1">{tabs[1]}</h1>
            {Object.entries(mapLookup[tabs[1]]).map(([title, fn]) => (
              <div className="detail_box" key={title}>
                <h3 className="detail_title">{title}</h3>
                <div className="detailComp_box">
                  {[0, 1].map((i) => (
                    <div className={`detail car${i + 1}_detail`} key={i}>
                      {fn(chosenCars[i], i)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <hr className="sectionDiv_hr" />

          <section
            className="detail_section differences_details"
            ref={sectionRefs.current[2]}
          >
            <h1 className="details_h1">{tabs[2]}</h1>
            {Object.entries(mapLookup[tabs[2]]).map(([title, fn]) => (
              <div className="detail_box" key={title}>
                <h3 className="detail_title">{title}</h3>
                <div className="detailComp_box">
                  {[0, 1].map((i) => (
                    <div className={`detail car${i + 1}_detail`} key={i}>
                      {fn(chosenCars[i], i)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <hr className="sectionDiv_hr" />

          <section className="detail_section" ref={sectionRefs.current[3]}>
            <h1 className="details_h1">{tabs[3]}</h1>
            {Object.entries(mapLookup[tabs[3]]).map(([title, fn]) => (
              <div className="detail_box" key={title}>
                <h3 className="detail_title">{title}</h3>
                <div className="detailComp_box">
                  {[0, 1].map((i) => (
                    <div className={`detail car${i + 1}_detail`} key={i}>
                      {fn(chosenCars[i], i)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default React.memo(DetailsTool);
