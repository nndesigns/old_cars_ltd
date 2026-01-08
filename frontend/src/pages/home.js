import React, { useEffect, useState, Suspense } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import Button from "../components/buttons/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import NewJSON from "../king_data_NEW.json";
import { ErrorBoundary } from "react-error-boundary";
import { updateFilter } from "../user/filtersSlice";

import {
  selectActiveInventory,
  selectMakesModelsStyles,
  selectUniqueMakes,
  selectActiveMakeCounts,
} from "../inventorySlice";

const MakesSelect = React.lazy(() => import("../components/makesSelect"));
const Carousels = React.lazy(() => import("../components/carousels"));
const PriceCarousel = React.lazy(() => import("../components/price_carousel"));
const PriceSlider = React.lazy(() => import("../components/price_slider"));
const PickerGrid = React.lazy(() => import("../components/pickerGrid"));
const LearnMoreBox = React.lazy(() => import("../components/learnMoreBox"));

const Home = ({
  // appliedFilters,
  // handleClearFilters,
  // setAppliedFilters,
  // setOrderedFilters,
  AnimatePresence,
  PageTransition,
  FadeTransition,
}) => {
  // REDUX
  // const inventory = useSelector((state) => state.inventory.items);
  const location = useSelector((s) => s.location);
  const dispatch = useDispatch();

  //USE STATE
  // const [makesModelsStyles, setMakesModelsStyles] = useState({});
  // const [activeMakeCounts, setActiveMakeCounts] = useState([]);
  // const [makes, setMakes] = useState([]);
  // const [priceCountsObj, setPriceCountsObj] = useState();
  const [mobile, setMobile] = useState(window.innerWidth < 767);
  const navigate = useNavigate();
  const locationRef = useLocation();

  // console.log("Home rec'd location", location);

  //RESIZE EVENT LISTENER
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 767);
    };
    handleResize();

    // Attach event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //SOME OPERATION TO DETECT AND SAVE USER'S LOCATION, COMPARE TO  INVENTORY LOCATIONS, AND FILTER INVENTORY TO MATCHING

  /*  useEffect(() => {
    console.log("inventory received in the useEffect", inventory);
    if (inventory.length > 0) {
      const activeInv = inventory.filter((car) => car.status);

      console.log("activeInv", activeInv);

      const comboMap = new Map();
      //send unique make-model combos to 'map' , assign a key
      activeInv.forEach((car) => {
        const key = `${car.make}-${car.model}`;
        if (!comboMap.has(key)) {
          // Add the unique combo
          comboMap.set(key, {
            year: car.year,
            make: car.make,
            model: car.model,
            color: car.color,
            style: car.style,
            images: car.images ? car.images : "undefined",
          });
        }
      });

      const uniqueCombos = Array.from(comboMap.values()).sort((a, b) => {
        if (a.model < b.model) return -1;
        if (a.model > b.model) return 1;
        return 0;
      });

      //Styles relevant to PickerGrid tabs
      const stylesToMatch = [
        "SUV / 4x4",
        "pickup",
        "hatchback",
        "station wagon",
        "sedan",
        "van",
      ];
      //only those with above styles (for PickerGrid)
      const uniqueSortedCombos = uniqueCombos.filter((model) =>
        stylesToMatch.some((style) =>
          model.style.toLowerCase().includes(style.toLowerCase())
        )
      );

      if (uniqueSortedCombos.length > 0) {
        //SORT MODEL OBJECTS BY 'TAB' (save to filteredModels)
        setMakesModelsStyles({
          SUVS: uniqueSortedCombos.filter((model) =>
            model.style.includes("SUV / 4x4")
          ),
          TRUCKS: uniqueSortedCombos.filter((model) =>
            model.style.includes("pickup")
          ),
          CROSSOVERS: uniqueSortedCombos.filter(
            (model) =>
              model.style.includes("hatchback") ||
              model.style.includes("station wagon") ||
              model.style.includes("van") ||
              (model.style.includes("pickup") && model.style.includes("coupe"))
          ),
          SEDANS: uniqueSortedCombos.filter((model) =>
            model.style.includes("sedan")
          ),
        });
      }

      ///RE: MAKES CAROUSEL
      const makeCounts = activeInv.reduce((acc, car) => {
        acc[car.make] = (acc[car.make] || 0) + 1;
        return acc;
      }, {});

      // Creating { make, # of make }
      const makesCounts = Object.entries(makeCounts).map(([make, count]) => ({
        make,
        count,
      }));

      console.log("makesCounts HOME", makesCounts);
      setActiveMakeCounts(makesCounts);

      //Array of Makes
      const uniqueMakes = [...new Set(activeInv.map((car) => car.make))];
      setMakes(uniqueMakes);
    }
  }, [inventory.length]); */
  const activeInventory = useSelector(selectActiveInventory);
  const makesModelsStyles = useSelector(selectMakesModelsStyles);
  const uniqueMakes = useSelector(selectUniqueMakes);
  const activeMakeCounts = useSelector(selectActiveMakeCounts);

  //// STYLES
  const ShopNowBtn = styled("button")(({ theme }) => ({
    backgroundColor: "rgba(255, 255, 255, .7)",
    fontSize: "16px",
    color: "var(--iconColor)",
    padding: "1rem 1.75rem",
    fontWeight: "600",
    letterSpacing: "1.25px",

    borderRadius: "4px",
    border: "1px solid transparent",
    transition: "background-color, color, ease-in .13s",

    "&:hover": {
      color: "white",
      backgroundColor: "var(--btnBG)",
      cursor: "pointer",
      border: "1px solid white",
    },
  }));

  const PromptBox = styled("div")(({ theme }) => ({
    position: "absolute",
    top: "52.5%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
    "@media (max-height: 500px)": {
      top: "37%",
    },
    "@media (max-width: 568px)": {
      top: "42.5%",
    },
    "@media (min-width: 600px) and (min-height: 500px)": {
      top: "47%",
    },
    "@media(min-width: 768px) and (min-height: 500px)": {
      top: "40%",
    },
    "& h1": {
      textAlign: "center",
    },
  }));

  const handleShopLocal = () => {
    // setAppliedFilters((prev) => ({
    //   ...prev,
    //   dist_radius: 25,
    // }));
    dispatch(updateFilter({ key: "dist_radius", value: 25 }));

    // update orderedFilters
    // setOrderedFilters((prev) => {
    //   // only add "dist_radius" if it’s not already in the array
    //   if (!prev.includes("dist_radius")) {
    //     return [...prev, "dist_radius"];
    //   }
    //   return prev;
    // });

    if (locationRef.pathname !== `/cars`) {
      navigate(`/cars`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Home | Old Cars Ltd</title>
        <meta name="description" content="Welcome to Old Cars Ltd" />
      </Helmet>

      <AnimatePresence mode="wait">
        <div className="page_container home_container">
          <FadeTransition>
            <Box
              sx={{
                backgroundImage: `url(${require("../images/home_bg_grad.jpg")})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                position: "relative",
                backgroundPosition: "center center",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "center",
                marginBottom: "100px",
                width: "100%",
                color: "white",
                overflow: "hidden",
                [`@media (max-height: 820px)`]: {
                  height: "100vh",
                },
                height: "70vh",
                maxHeight: "955px",
              }}
            >
              <PageTransition
                style={{
                  position: "static",
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
                key="home"
              >
                <PromptBox>
                  <h1 style={{ marginBottom: "1rem", letterSpacing: "-1px" }}>
                    Find your classic!
                    <br />
                    Explore over 50,000 vintage vehicles!
                  </h1>
                  <ShopNowBtn onClick={() => navigate("/cars")}>
                    SHOP NOW
                  </ShopNowBtn>
                </PromptBox>
              </PageTransition>
            </Box>
          </FadeTransition>
          <PageTransition key="home_2">
            {/* SHOP BY STYLE */}
            <Box className="center_box">
              <div className="middle_content styles_content">
                <h2>Shop by style</h2>
                <Suspense fallback={<p>Loading styles…</p>}>
                  <Carousels
                    carStyles={true}
                    // setAppliedFilters={setAppliedFilters}
                    // setOrderedFilters={setOrderedFilters}
                  />
                </Suspense>
              </div>
            </Box>
            {/* SHOP BY MAKE */}
            <Box className="center_box">
              <div className="middle_content make_content">
                <h2 className="makes_h2">Shop by make</h2>
                <Suspense fallback={<p>Loading makes…</p>}>
                  <Carousels
                    makeData={activeMakeCounts}
                    // setAppliedFilters={setAppliedFilters}
                    // setOrderedFilters={setOrderedFilters}
                  />
                  <MakesSelect
                    makes={uniqueMakes}
                    // setAppliedFilters={setAppliedFilters}
                    // setOrderedFilters={setOrderedFilters}
                  />
                </Suspense>
              </div>
            </Box>
            {/* SHOP BY PRICE */}
            <Box className="center_box">
              <div className="middle_content">
                <h2 className="price_h2">Shop by price</h2>
                <Suspense fallback={<p>Loading price filters…</p>}>
                  <PriceCarousel
                  // setAppliedFilters={setAppliedFilters}
                  // setOrderedFilters={setOrderedFilters}
                  />
                  <PriceSlider
                    inventory={activeInventory}
                    // setAppliedFilters={setAppliedFilters}
                    // setOrderedFilters={setOrderedFilters}
                    // appliedFilters={appliedFilters}
                    leftPanel={false}
                  />
                </Suspense>
              </div>
            </Box>
            {/* COLLECTION PICKER */}
            <Box className="center_box">
              <div className="middle_content collection_content">
                <h2 className="popular_h2">Cruise the collection</h2>
                {makesModelsStyles &&
                Object.keys(makesModelsStyles).length > 0 ? (
                  mobile ? (
                    <>
                      <h3
                        className="style_h3"
                        style={{ marginBottom: "-.3rem" }}
                      >
                        SUVs
                      </h3>
                      <Carousels
                        style={{ marginBottom: "1rem" }}
                        modelData={makesModelsStyles.SUVS}
                        styleType="SUV"
                      />
                      <h3
                        className="style_h3"
                        style={{ marginBottom: "-.25rem" }}
                      >
                        Trucks
                      </h3>
                      <Carousels
                        style={{ marginBottom: "1rem" }}
                        modelData={makesModelsStyles.TRUCKS}
                        styleType="Truck"
                      />
                      <h3
                        className="style_h3"
                        style={{ marginBottom: "-.25rem" }}
                      >
                        Crossovers
                      </h3>
                      <Carousels
                        style={{ marginBottom: "1rem" }}
                        modelData={makesModelsStyles.CROSSOVERS}
                        styleType="Crossover"
                      />
                      <h3
                        className="style_h3"
                        style={{ marginBottom: "-.25rem" }}
                      >
                        Sedans
                      </h3>
                      <Carousels
                        style={{ marginBottom: "1rem" }}
                        modelData={makesModelsStyles.SEDANS}
                        styleType="Sedan"
                      />
                    </>
                  ) : (
                    <PickerGrid
                      models={makesModelsStyles}
                      // setAppliedFilters={setAppliedFilters}
                      // setOrderedFilters={setOrderedFilters}
                      // handleClearFilters={handleClearFilters}
                    />
                  )
                ) : (
                  <p>Loading collection…</p>
                )}
              </div>
            </Box>
            {/* LEARN MORE */}
            <Box className="center_box">
              <div className="middle_content">
                <LearnMoreBox />
              </div>
            </Box>
            {/* NEAR YOU */}
            <Box className="center_box">
              <div className="middle_content nearYou_content">
                <h2 className="nearYou_h2">Precious pieces near you</h2>
                <Suspense fallback={<p>Loading local cars…</p>}>
                  <Carousels
                    style={{ marginBottom: "1.4rem" }}
                    nearYou
                    invData={location.localInv} //set in App.js
                  />
                  <Button
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "0px 40px",
                      height: "2.5rem",
                    }}
                    text="SHOP LOCAL"
                    onClick={handleShopLocal}
                  />
                </Suspense>
              </div>
            </Box>
          </PageTransition>
        </div>
      </AnimatePresence>
    </>
  );
};

export default Home;
