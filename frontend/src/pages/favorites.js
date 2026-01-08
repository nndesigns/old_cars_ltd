import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import InventoryCard from "../components/inventoryCard";
import { getModelImageURLs } from "../components/axiosCalls";
import { useSearchParams } from "react-router-dom";
// import { LoadingWave } from "../components/inventoryGrid/loadingWave";
import "../components/inventoryGrid/invGrid.css";
import InventoryCardSkeleton from "../components/inventoryCardSkeleton";

const Favorites = ({ AnimatePresence, PageTransition }) => {
  // REDUX
  const hearted_cars = useSelector((s) => s.favorites.heartedCars);
  const location = useSelector((s) => s.location);

  const [searchParams] = useSearchParams();
  const fromLocModal = searchParams.get("fromLocModal") === "true";
  const [favoritesImagesMap, setFavoritesImagesMap] = useState({});
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [loadingCars, setLoadingCars] = useState(
    !hearted_cars.length ? false : true
  );

  const noFavoritesH1 = {
    textAlign: "center",
    fontSize: "2em",
    opacity: 0.5,
    marginBlock: "auto",
  };

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
    <AnimatePresence mode="wait">
      <PageTransition>
        <div className="page_container favorites_container">
          <Box className="center_box">
            <div className="middle_content">
              <h2 className="favorites_h2">Your Favorites</h2>
              {loadingCars ? (
                <div className="grid_root">
                  {Array(15)
                    .fill(null)
                    .map((_, i) => (
                      <InventoryCardSkeleton key={i} />
                    ))}
                </div>
              ) : !hearted_cars.length ? (
                <h1 style={noFavoritesH1}>No favorites</h1>
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
      </PageTransition>
    </AnimatePresence>
  );
};

export default Favorites;
