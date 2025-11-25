import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";

import { motion } from "framer-motion";
import InventoryCard from "../components/inventoryCard";
import { getModelImageURLs } from "../components/axiosCalls";
import { useSearchParams } from "react-router-dom";
import { LoadingWave } from "../components/inventoryGrid/loadingWave";
import "../components/inventoryGrid/invGrid.css";

const Favorites = ({ hearted_cars, location }) => {
  const [searchParams] = useSearchParams();
  const fromLocModal = searchParams.get("fromLocModal") === "true";
  const [favoritesImagesMap, setFavoritesImagesMap] = useState({});
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [loadingCars, setLoadingCars] = useState(true);

  console.log("Favorites rec'd hearted_cars", hearted_cars);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 640);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   handleResize();

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  useEffect(() => {
    if (!hearted_cars || hearted_cars.length === 0) return;

    const allModelImgKeys = [
      ...new Set(
        hearted_cars.map((obj) => obj.images?.model_imgs_key).filter(Boolean)
      ),
    ];

    if (allModelImgKeys.length === 0) return;

    const fetchImages = async () => {
      try {
        const imagesMap = await getModelImageURLs(allModelImgKeys, true);
        setFavoritesImagesMap(imagesMap);
      } catch (err) {
        console.error("Failed to fetch image map", err);
      }
    };

    fetchImages();
  }, [hearted_cars]);

  let data = [...hearted_cars].map((veh) => ({
    ...veh,
    imageArray: favoritesImagesMap[veh.images.model_imgs_key] || null,
  }));

  const readyCars = useMemo(() => {
    return data.filter(
      (car) => Array.isArray(car.imageArray) && car.imageArray.length > 0
    );
  }, [data]);

  useEffect(() => {
    if (readyCars.length) {
      setLoadingCars(false);
    }
  }, [readyCars]);

  const getsLocShadow = (city) => {
    if (location.city === city) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="page_container favorites_container">
      <Box className="center_box">
        <div className="middle_content">
          <h2 className="favorites_h2">Your Favorites</h2>

          {loadingCars ? (
            <div className="loading-message">
              <LoadingWave />
            </div>
          ) : (
            <div className="grid_root">
              {readyCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index, 6) * 0.05,
                  }}
                >
                  <InventoryCard
                    carData={car}
                    favorites={true}
                    nearYou={true}
                    style={{
                      boxShadow: fromLocModal
                        ? getsLocShadow(car.city)
                          ? "var(--allAroundBtnBGShadow)"
                          : ""
                        : "",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default Favorites;
