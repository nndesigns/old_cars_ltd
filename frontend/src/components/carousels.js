import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import { handleScroll } from "./utils.js";

import carouselStyles from "./carouselStyles";
import { getModelImageURLs } from "./axiosCalls.js";
import Button from "./buttons/button.js";

import { HiArrowRight } from "react-icons/hi2";

//ICONS (STYLE)
import * as StyleIcons from "../icons/style_icons/index.js";
//ICONS (MAKES)
import * as MakeIcons from "../icons/make_icons/index.js";
//IMAGES (MAKES)
import * as MakeImages from "../images/makeCarousel_imgs/index.js";
//IMAGES (LIFESTYLE)
import Commuter_img from "../images/lifestyleCarousel_imgs/commuter_img.webp";
import Eco_img from "../images/lifestyleCarousel_imgs/eco_img.webp";
import Family_img from "../images/lifestyleCarousel_imgs/family_img.webp";
import Adventure_img from "../images/lifestyleCarousel_imgs/offRoad_img.webp";

import {
  LeftScrollBtnLarge,
  RightScrollBtnLarge,
} from "./buttons/scrollBtns.js";
import {
  LeftScrollBtnSmall,
  RightScrollBtnSmall,
} from "./buttons/scrollBtns.js";
import {
  CustomCard,
  MakeCard,
  LifestyleCard,
  StyleCard,
} from "./customCards.js";
import InventoryCard from "./inventoryCard.js";

const Carousels = ({
  styleTypes,
  makeData,
  lifestyle,
  modelData,
  invData,
  style,
  ...props
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [above1200, setAbove1200] = useState(window.innerWidth > 1200);
  const [showArrows, setShowArrows] = useState(window.innerWidth > 767);

  const [fetchedModelImagesMap, setFetchedModelImagesMap] = useState([]);
  const [inventoryImagesMap, setInventoryImagesMap] = useState({});

  //cars page
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // WINDOW RESIZE LISTENER
  useEffect(() => {
    //update padding-inline RE: carouselStyles (see: <Home/> .middle_content inverse)
    const updateSize = () => {
      setAbove1200(window.innerWidth > 1200);
    };
    //update scroll button visibility
    const updateArrows = () => {
      setShowArrows(window.innerWidth > 767);
    };
    //combiner fn
    const resizeHandler = () => {
      updateSize(); // Set initial state
      updateArrows();
    };

    window.addEventListener("resize", resizeHandler); // Listen for window resizes

    return () => window.removeEventListener("resize", resizeHandler); // Cleanup
  }, []);

  //MAPPING STYLE ICONS
  const styleMap = [
    {
      icon: StyleIcons.SuvIcon,
      title: "SUVs / 4x4",
      value: "SUV / 4x4",
    },
    {
      icon: StyleIcons.TruckIcon,
      title: "Pickups",
      value: "pickup",
    },
    {
      icon: StyleIcons.SedanIcon,
      title: "Sedans",
      value: "sedan",
    },
    {
      icon: StyleIcons.CoupeIcon,
      title: "Coupes",
      value: "coupe",
    },
    {
      icon: StyleIcons.SportsCarIcon,
      title: "Muscle Cars",
      value: "muscle car",
    },
    {
      icon: StyleIcons.ConvertibleIcon,
      title: "Convertibles",
      value: "convertible",
    },
    {
      icon: StyleIcons.LuxuryIcon,
      title: "Luxury",
      value: "luxury",
    },
    {
      icon: StyleIcons.WagonIcon,
      title: "Station Wagons",
      value: "station wagon",
    },
    {
      icon: StyleIcons.VanIcon,
      title: "Panel Vans",
      value: "van",
    },
  ];

  /////MAKES CAROUSEL
  //MAKE ICONS
  const iconMap = {
    Mazda: MakeIcons.Mazda,
    Ferrari: MakeIcons.Ferrari,
    Chevrolet: MakeIcons.Chevrolet,
    Ford: MakeIcons.Ford,
    Dodge: MakeIcons.Dodge,
    BMW: MakeIcons.BMW,
    Pontiac: MakeIcons.Pontiac,
    Jeep: MakeIcons.Jeep,
    Porsche: MakeIcons.Porsche,
    Toyota: MakeIcons.Toyota,
    Volkswagen: MakeIcons.Volkswagen,
    Buick: MakeIcons.Buick,
    Subaru: MakeIcons.Subaru,
    Nissan: MakeIcons.Nissan,
    Cadillac: MakeIcons.Cadillac,
    Jaguar: MakeIcons.Jaguar,
    AMC: MakeIcons.AMC,
    "Mercedes-Benz": MakeIcons.MercedesBenz,
    Lincoln: MakeIcons.Lincoln,
    Oldsmobile: MakeIcons.Oldsmobile,
    Willys: MakeIcons.Willys,
  };

  //MAKE IMAGES
  const imageMap = {
    Mazda: MakeImages.Mazda_img,
    Ferrari: MakeImages.Ferrari_img,
    Chevrolet: MakeImages.Chevrolet_img,
    Ford: MakeImages.Ford_img,
    Dodge: MakeImages.Dodge_img,
    BMW: MakeImages.BMW_img,
    Pontiac: MakeImages.Pontiac_img,
    Jeep: MakeImages.Jeep_img,
    Porsche: MakeImages.Porsche_img,
    Toyota: MakeImages.Toyota_img,
    Volkswagen: MakeImages.Volkswagen_img,
    Buick: MakeImages.Buick_img,
    Subaru: MakeImages.Subaru_img,
    Nissan: MakeImages.Nissan_img,
    Cadillac: MakeImages.Cadillac_img,
    Jaguar: MakeImages.Jaguar_img,
    AMC: MakeImages.AMC_img,
    "Mercedes-Benz": MakeImages.MercedesBenz_img,
    Lincoln: MakeImages.Lincoln_img,
    Oldsmobile: MakeImages.Oldsmobile_img,
    Willys: MakeImages.Willys_img,
  };

  /////MAPPING LIFESTYLE IMAGES
  const imageMap_LS = {
    Commuter: Commuter_img,
    "Eco-conscious": Eco_img,
    Family: Family_img,
    Adventure: Adventure_img,
  };

  const lifeStyles = ["Commuter", "Eco-conscious", "Family", "Adventure"];

  useEffect(() => {
    const fetchImages = async () => {
      //set 'sourceData' to either 'invData' (inventory), or 'modelData'
      const sourceData =
        Array.isArray(invData) && invData.length > 0
          ? invData
          : Array.isArray(modelData) && modelData.length > 0
          ? modelData
          : null;

      if (!sourceData) return;

      const allModelImgKeys = [
        ...new Set(sourceData.map((obj) => `${obj.images.model_imgs_key}`)),
      ];

      try {
        const imagesMap = await getModelImageURLs(
          allModelImgKeys,
          !!invData // shorthand for: invData ? true : false
        );

        if (Array.isArray(invData) && invData.length > 0) {
          setInventoryImagesMap(imagesMap);
        } else {
          setFetchedModelImagesMap(imagesMap);
        }
      } catch (err) {
        console.error("Failed to fetch image map", err);
      }
    };

    fetchImages(); // <- don't forget to call it
  }, [modelData, invData]);

  /**************  Setting 'data' array **************/
  let data;
  // <InventoryCard/>s
  if (invData) {
    data = [...invData].map((veh) => ({
      ...veh,
      imageArray: inventoryImagesMap[veh.images.model_imgs_key] || null,
    }));
  } else if (props.carStyles) {
    /* <StyleCard/>s */
    data = styleMap;
  } else if (modelData) {
    /* <CustomCard/>s (Cruise the Collection)*/
    data = [...modelData].map((model) => ({
      make: model.make,
      model: model.model,
      image: fetchedModelImagesMap[model.images.model_imgs_key] || null,
    }));
  } else if (lifestyle) {
    /* <LifestyleCard/>s */
    data = [...lifeStyles].map((lifestyle) => ({
      title: lifestyle,
      image: imageMap_LS[lifestyle] || null,
    }));
  } else {
    data = [...makeData] /* <MakeCard/> */
      .map((car) => ({
        icon: iconMap[car.make] || null,
        image: imageMap[car.make] || null,
        title: car.make,
        count: car.count,
      }))
      .sort((a, b) => a.title.localeCompare(b.title)); //alphabetize
  }

  //UPDATING CAROUSEL SCROLL BTN VISIBILITY
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const updateButtonVisibility = () => {
      if (!scrollContainer) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      setCanScrollLeft(Math.ceil(scrollLeft) > 0);
      setCanScrollRight(Math.floor(scrollLeft + clientWidth) < scrollWidth - 1);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateButtonVisibility);
      // Trigger once on mount to set initial state
      if (data.length > 0) updateButtonVisibility();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", updateButtonVisibility);
      }
    };
  }, [data]);

  //LIFESTYLE CAROUSEL SCROLL RESIZE LISTENER
  useEffect(() => {
    if (!lifestyle) {
      return;
    }
    const handleResize = () => {
      //taking right arrow off Lifestyle carousel once all showing
      if (lifestyle && window.innerWidth >= 1185) {
        setCanScrollRight(false);
      } else if (lifestyle && window.innerWidth < 1185) {
        setCanScrollRight(true);
      }
    };
    // Attach event listener
    window.addEventListener("resize", handleResize);
    // Call once in case the window is already large
    handleResize();
    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [lifestyle]);

  const handleCardClick = ({ value, filterType }) => {
    console.log("value", value);
    console.log("filterType", filterType);

    // if (filterType === "style") {
    //   props.setAppliedFilters((prev) => ({
    //     ...prev,
    //     [filterType]: [value],
    //   }));
    //   props.setOrderedFilters((prev) => {
    //     const filtered = prev.filter((f) => f !== filterType);
    //     return [...filtered, filterType];
    //   });
    // } else {
    props.setAppliedFilters((prev) => ({
      ...prev,
      [filterType]: [value],
    }));
    props.setOrderedFilters((prev) => {
      const filtered = prev.filter((f) => f !== filterType);
      return [...filtered, filterType];
    });
    // }

    // Navigate
    navigate("/cars");
  };

  return (
    <div className="wrapper_box" style={{ ...style }}>
      {props.carsPage && (
        <p style={{ position: "absolute", top: "2rem", left: "1.75rem" }}>
          Shop by type
        </p>
      )}
      {canScrollLeft &&
        (modelData || showArrows) &&
        (modelData || props.carStyles ? (
          <LeftScrollBtnSmall
            onClick={() => handleScroll(scrollContainerRef, -1)}
          />
        ) : (
          <LeftScrollBtnLarge
            onClick={() => handleScroll(scrollContainerRef, -1)}
          />
        ))}
      {/******** CAROUSEL CONTAINER ********/}
      <Box
        // className="makes_carousel"
        ref={scrollContainerRef}
        sx={carouselStyles({
          canScrollLeft,
          canScrollRight,
          showArrows,
          above1200,
          modelData,
          carStyles: props.carStyles,
          nearYou: props.nearYou,
          carsPage: props.carsPage,
        })}
      >
        {/******************* MAPPING DATA *******************/}
        {/********* STYLE CARDS *********/}
        {props.carStyles &&
          data.map((item, index) => (
            <div key={index}>
              <StyleCard
                forCarsPage={props.carsPage}
                showArrows={showArrows}
                orientation="vertical"
                key={index}
                size={showArrows ? "md" : "sm"}
                onMouseEnter={() => props.carsPage && setHoveredIndex(index)}
                onMouseLeave={() => props.carsPage && setHoveredIndex(null)}
                onClick={() =>
                  handleCardClick({
                    value: item.value,
                    filterType: "styles",
                  })
                }
              >
                {/* CAR ICON - CHILD 1 */}
                <AspectRatio
                  sx={{
                    width: props.carsPage ? 120 : 130,
                  }}
                >
                  {item.icon && (
                    <item.icon
                      style={{
                        fill: "var(--iconColor)",
                        backgroundColor: props.carsPage ? "white" : "unset",
                        paddingBottom: 0,
                      }}
                    />
                  )}
                </AspectRatio>
                {/* ARROW ICON - CHILD 2 */}

                {props.carsPage && (
                  <HiArrowRight
                    className="arrow_icon"
                    style={{
                      fill: "var(--invCardTitle)",
                      height: "1.5rem",
                      width: "1.5rem",
                      position: "absolute",
                      transform:
                        hoveredIndex === index
                          ? "translateX(15px)"
                          : "translateX(-35px)",
                    }}
                  />
                )}

                {/* Style type (/Home style Carousel ) */}
                {!props.carsPage && (
                  <Box
                    sx={{
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    <Typography>{item.title}</Typography>{" "}
                  </Box>
                )}
              </StyleCard>

              {props.carsPage && (
                <Typography
                  style={{
                    fontSize: ".9em",
                    fontWeight: 600,
                    marginLeft: ".5rem",
                    marginTop: ".25rem",
                  }}
                >
                  {item.title}
                </Typography>
              )}
            </div>
          ))}

        {/********* MAKES *********/}
        {makeData &&
          data.map((item) => (
            <MakeCard
              orientation="vertical"
              key={item.title}
              variant="outlined"
              image={item.image}
              onClick={() =>
                handleCardClick({ value: item.title, filterType: "makes" })
              }
            >
              <Box
                sx={{
                  padding: "8px 24px 24px 18px",
                  marginTop: ".5rem",
                  whiteSpace: "nowrap",
                  position: "relative",
                  display: "inline-block",
                  width: "min-content",
                  textShadow: "5px 5px 8px rgba(0, 0, 0, 0.6)",
                }}
              >
                {/* MAKE NAME */}
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "1.3rem",
                    letterSpacing: "-.25px",
                    marginBottom: "-5px",
                    zIndex: "2",
                    color: "white",
                    filter: "brightness(1.3)",
                  }}
                >
                  {item.title}
                </Typography>{" "}
                {/* MATCHES LINE */}
                <Typography
                  sx={{
                    fontSize: ".9rem",
                    letterSpacing: "-.25px",
                    zIndex: "2",
                    color: "white",
                    filter: "brightness(1.3)",
                    fontWeight: "500",
                  }}
                >
                  {item.count} matches
                </Typography>
                {/* ICON */}
                {item.icon && (
                  <item.icon
                    style={{
                      height: "105px",
                      width: "105px",
                      position: "absolute",
                      top: ".15rem",
                      left: "2rem",
                      zIndex: "-1",
                      fill: "white",
                      color: "white",
                      opacity: 0.2,
                      background: "transparent",
                    }}
                  />
                )}
              </Box>
            </MakeCard>
            // <MakeCard item={item} key={item.title} />
          ))}
        {/* <MakeCard lastCard={true} /> */}
        {/* LAST MAKE CARD (SEPARATE CARD) */}
        {makeData && (
          <MakeCard lastCard={true} orientation="vertical" variant="outlined">
            <Box
              sx={{
                padding: "24px 24px 18px 24px",
                whiteSpace: "wrap",
                width: "269px",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "1.35rem",
                  letterSpacing: "-.25px",
                  lineHeight: "1.2",
                  marginBottom: "5px",
                }}
              >
                Want to see <i>all</i> of our inventory?
              </Typography>
            </Box>
            <Button text="SEE ALL CARS" onClick={() => navigate("./cars")} />
          </MakeCard>
        )}
        {/*************** LIFESTYLES ***************/}
        {lifestyle &&
          data.map((item) => (
            <LifestyleCard
              orientation="vertical"
              key={item.title}
              variant="outlined"
              image={item.image}
            >
              <Typography>{item.title}</Typography>
            </LifestyleCard>
          ))}

        {/************ MODELS (Cruise the Collection) **************/}
        {modelData &&
          data.map((item, index) => (
            //imported CustomCards
            <CustomCard key={index} modelUse={true} lastCard={false}>
              <h3
                style={{
                  lineHeight: "1.5rem",
                  flex: "1",
                }}
              >
                {item.make}
                <br />
                {item.model.split(" ").length > 4
                  ? item.model.split(" ").slice(0, 4).join(" ") + "..."
                  : item.model}
              </h3>
              <img
                style={{
                  height: "120px",
                  flex: "1",
                }}
                alt={`${item.year}-${item.make}-${item.model}-${item.color} `}
                src={item.image}
              />
            </CustomCard>
          ))}
        {/* LAST MODEL CARD (SEPARATE CARD) */}
        {modelData && (
          <CustomCard modelUse={true} lastCard={true}>
            <h3>
              See all{" "}
              {props.styleType === "SUV"
                ? "SUVs"
                : props.styleType === "Truck"
                ? "Trucks"
                : props.styleType === "Crossover"
                ? "Crossovers"
                : "Sedans"}{" "}
            </h3>
          </CustomCard>
        )}
        {/********* NEAR YOU CARDS  (INV CARDS) ***********/}
        {props.nearYou === true &&
          data &&
          data.map((item, index) => (
            <InventoryCard key={index} carData={item} nearYou={true} />
          ))}
      </Box>
      {canScrollRight &&
        (modelData || showArrows) &&
        (modelData || props.carStyles ? (
          <RightScrollBtnSmall
            onClick={() => handleScroll(scrollContainerRef, 1)}
          />
        ) : (
          <RightScrollBtnLarge
            onClick={() => handleScroll(scrollContainerRef, 1)}
          />
        ))}
    </div>
  );
};

export default Carousels;
