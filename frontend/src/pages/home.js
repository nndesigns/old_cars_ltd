import React, { useEffect, useState, Suspense } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/* import MakesSelect from "../components/makesSelect";
import Carousels from "../components/carousels";
import PriceCarousel from "../components/price_carousel";
import PriceSlider from "../components/price_slider";
import PickerGrid from "../components/pickerGrid";
import LearnMoreBox from "../components/learnMoreBox"; */

import Button from "../components/buttons/button";
import { useNavigate } from "react-router-dom";
// import NewJSON from "../king_data_NEW.json";
import { ErrorBoundary } from "react-error-boundary";

const MakesSelect = React.lazy(() => import("../components/makesSelect"));
const Carousels = React.lazy(() => import("../components/carousels"));
const PriceCarousel = React.lazy(() => import("../components/price_carousel"));
const PriceSlider = React.lazy(() => import("../components/price_slider"));
const PickerGrid = React.lazy(() => import("../components/pickerGrid"));
const LearnMoreBox = React.lazy(() => import("../components/learnMoreBox"));

const Home = ({
  inventory,
  location,
  appliedFilters,
  handleClearFilters,
  setAppliedFilters,
  setOrderedFilters,
}) => {
  const [makesModelsStyles, setMakesModelsStyles] = useState({});
  const [activeMakeCounts, setActiveMakeCounts] = useState([]);
  const [makes, setMakes] = useState([]);
  // const [priceCountsObj, setPriceCountsObj] = useState();
  const [mobile, setMobile] = useState(window.innerWidth < 767);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (inventory.length > 0) {
      const activeInv = inventory.filter((car) => car.status);

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
      setActiveMakeCounts(makesCounts);

      //Array of Makes
      const uniqueMakes = [...new Set(activeInv.map((car) => car.make))];
      setMakes(uniqueMakes);
    }
  }, [inventory]);

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

  return (
    <div className="page_container home_container">
      <Suspense fallback={<p>Loading header</p>}>
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
          <PromptBox>
            <h1 style={{ marginBottom: "1rem", letterSpacing: "-1px" }}>
              Find your classic!
              <br />
              Explore over 50,000 vintage vehicles!
            </h1>
            <ShopNowBtn onClick={() => navigate("/cars")}>SHOP NOW</ShopNowBtn>
          </PromptBox>
        </Box>
      </Suspense>

      {/* <Box className="center_box">
        <div className="middle_content styles_content">
          <h2>Shop by style</h2>
          <Carousels
            carStyles={true}
            setAppliedFilters={setAppliedFilters}
            setOrderedFilters={setOrderedFilters}
          />
        </div>
      </Box>

      <Box className="center_box">
        <div className="middle_content make_content">
          <h2 className="makes_h2">Shop by make</h2>
          {
            <Carousels
              makeData={activeMakeCounts}
              setAppliedFilters={setAppliedFilters}
              setOrderedFilters={setOrderedFilters}
            />
          }
          <MakesSelect
            makes={makes}
            setAppliedFilters={setAppliedFilters}
            setOrderedFilters={setOrderedFilters}
          />
        </div>
      </Box>

      <Box className="center_box">
        <div className="middle_content">
          <h2 className="price_h2">Shop by price</h2>
          <PriceCarousel
            setAppliedFilters={setAppliedFilters}
            setOrderedFilters={setOrderedFilters}
          />
          <PriceSlider
            inventory={inventory.filter((car) => car.status)}
            setAppliedFilters={setAppliedFilters}
            setOrderedFilters={setOrderedFilters}
            appliedFilters={appliedFilters}
            leftPanel={false}
          />
        </div>
      </Box>

      <Box className="center_box">
        <div className="middle_content lifestyle_content">
          <h2 className="lifestyle_h2">Shop by life pattern</h2>
          <Carousels lifestyle={true} />
        </div>
      </Box>

      <Box className="center_box">
        <div className="middle_content collection_content">
          <h2 className="popular_h2">Cruise the collection</h2>
          {makesModelsStyles && Object.keys(makesModelsStyles).length > 0 ? (
            mobile ? (
              <>
                <h3 className="style_h3" style={{ marginBottom: "-.3rem" }}>
                  SUVs
                </h3>
                <Carousels
                  style={{ marginBottom: "1rem" }}
                  modelData={makesModelsStyles.SUVS}
                  styleType="SUV"
                />
                <h3 className="style_h3" style={{ marginBottom: "-.25rem" }}>
                  Trucks
                </h3>
                <Carousels
                  style={{ marginBottom: "1rem" }}
                  modelData={makesModelsStyles.TRUCKS}
                  styleType="Truck"
                />
                <h3 className="style_h3" style={{ marginBottom: "-.25rem" }}>
                  Crossovers
                </h3>
                <Carousels
                  style={{ marginBottom: "1rem" }}
                  modelData={makesModelsStyles.CROSSOVERS}
                  styleType="Crossover"
                />
                <h3 className="style_h3" style={{ marginBottom: "-.25rem" }}>
                  Sedans
                </h3>
                <Carousels
                  style={{ marginBottom: "1rem" }}
                  modelData={makesModelsStyles.SEDANS}
                  styleType="Sedan"
                />
              </>
            ) : (
              <PickerGrid models={makesModelsStyles} />
            )
          ) : (
            <p>not ready yet</p>
          )}
        </div>
      </Box>

      <Box className="center_box">
        <div className="middle_content">
          <LearnMoreBox />
        </div>
      </Box>
   
      <Box className="center_box">
        <div className="middle_content nearYou_content">
          <h2 className="nearYou_h2" style={{ textAlign: "center" }}>
            Precious pieces near you
          </h2>

          <Carousels
            style={{ marginBottom: "1.4rem" }}
            nearYou={true}
            invData={location.localInv}
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
          />
        </div>
      </Box> */}

      {/* SHOP BY STYLE */}
      <ErrorBoundary fallback={<p>Style carousel failed to load.</p>}>
        <Suspense fallback={<p>Loading styles…</p>}>
          <Box className="center_box">
            <div className="middle_content styles_content">
              <h2>Shop by style</h2>
              <Carousels
                carStyles
                setAppliedFilters={setAppliedFilters}
                setOrderedFilters={setOrderedFilters}
              />
            </div>
          </Box>
        </Suspense>
      </ErrorBoundary>

      {/* SHOP BY MAKE */}
      <ErrorBoundary fallback={<p>Makes carousel failed.</p>}>
        <Suspense fallback={<p>Loading makes…</p>}>
          <Box className="center_box">
            <div className="middle_content make_content">
              <h2 className="makes_h2">Shop by make</h2>
              <Carousels
                makeData={activeMakeCounts}
                setAppliedFilters={setAppliedFilters}
                setOrderedFilters={setOrderedFilters}
              />
              <MakesSelect
                makes={makes}
                setAppliedFilters={setAppliedFilters}
                setOrderedFilters={setOrderedFilters}
              />
            </div>
          </Box>
        </Suspense>
      </ErrorBoundary>

      {/* SHOP BY PRICE */}
      <ErrorBoundary fallback={<p>Price filters failed.</p>}>
        <Suspense fallback={<p>Loading price filters…</p>}>
          <Box className="center_box">
            <div className="middle_content">
              <h2 className="price_h2">Shop by price</h2>
              <PriceCarousel
                setAppliedFilters={setAppliedFilters}
                setOrderedFilters={setOrderedFilters}
              />
              <PriceSlider
                inventory={inventory.filter((car) => car.status)}
                setAppliedFilters={setAppliedFilters}
                setOrderedFilters={setOrderedFilters}
                appliedFilters={appliedFilters}
                leftPanel={false}
              />
            </div>
          </Box>
        </Suspense>
      </ErrorBoundary>

      {/* COLLECTION PICKER */}
      <ErrorBoundary fallback={<p>Collection picker failed.</p>}>
        <Suspense fallback={<p>Loading collection…</p>}>
          <Box className="center_box">
            <div className="middle_content collection_content">
              <h2 className="popular_h2">Cruise the collection</h2>
              {makesModelsStyles &&
              Object.keys(makesModelsStyles).length > 0 ? (
                mobile ? (
                  <>
                    <h3 className="style_h3" style={{ marginBottom: "-.3rem" }}>
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
                    setAppliedFilters={setAppliedFilters}
                    setOrderedFilters={setOrderedFilters}
                    handleClearFilters={handleClearFilters}
                  />
                )
              ) : (
                <p>not ready yet</p>
              )}
            </div>
          </Box>
        </Suspense>
      </ErrorBoundary>

      {/* LEARN MORE */}
      <ErrorBoundary fallback={<p>Learn more box failed.</p>}>
        <Suspense fallback={<p>Loading info…</p>}>
          <Box className="center_box">
            <div className="middle_content">
              <LearnMoreBox />
            </div>
          </Box>
        </Suspense>
      </ErrorBoundary>

      {/* NEAR YOU */}
      <ErrorBoundary fallback={<p>Near you carousel failed.</p>}>
        <Suspense fallback={<p>Loading local cars…</p>}>
          <Box className="center_box">
            <div className="middle_content nearYou_content">
              <h2 className="nearYou_h2" style={{ textAlign: "center" }}>
                Precious pieces near you
              </h2>
              <Carousels
                style={{ marginBottom: "1.4rem" }}
                nearYou
                invData={location.localInv}
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
              />
            </div>
          </Box>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Home;
