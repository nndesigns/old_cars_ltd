import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import InventoryCard from "../inventoryCard";
import "./invGrid.css";
import Button from "../buttons/button.js";
import { getModelImageURLs } from "../axiosCalls.js"; // adjust import
import ConcatH3 from "../concatH3.js";
import { LoadingWave } from "./loadingWave.js";

const InventoryGrid = ({ cars, below820, appliedFilters }) => {
  const [invImagesMap, setInvImagesMap] = useState({});
  const [visibleCars, setVisibleCars] = useState([]);
  const gridRef = useRef(null);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingCars, setLoadingCars] = useState(true);
  const [allowNoResults, setAllowNoResults] = useState(false); // new flag

  // INITIALIZE visibleCars
  useEffect(() => {
    if (Array.isArray(cars)) {
      setLoadingCars(false); // cars were fetched (even if empty)
      if (cars.length > 0) {
        setVisibleCars(cars.slice(0, 22));
      } else {
        setVisibleCars([]);
      }
    }
  }, [cars]);

  // Delay "no results" fallback
  useEffect(() => {
    setAllowNoResults(false); // reset whenever cars change
    if (Array.isArray(cars) && cars.length === 0) {
      const timer = setTimeout(() => {
        setAllowNoResults(true);
      }, 600); // adjust delay as you like
      return () => clearTimeout(timer);
    }
  }, [cars]);

  // FETCH IMAGES for visible cars only
  useEffect(() => {
    const fetchImages = async () => {
      if (!Array.isArray(visibleCars) || visibleCars.length === 0) {
        setLoadingImages(false);
        return;
      }

      const allModelImgKeys = [
        ...new Set(
          visibleCars
            .map((obj) => obj?.images?.model_imgs_key)
            .filter((key) => !!key)
        ),
      ];

      const newKeysToFetch = allModelImgKeys.filter(
        (key) => !invImagesMap?.[key]
      );

      if (newKeysToFetch.length === 0) {
        if (loadingImages) setLoadingImages(false);
        return;
      }

      try {
        setLoadingImages(true);
        const imagesMap = await getModelImageURLs(newKeysToFetch, !!cars, true);
        setInvImagesMap((prev) => ({
          ...prev,
          ...imagesMap,
        }));
      } catch (err) {
        console.error("Failed to fetch image map", err);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();

    if (cars.length <= 22) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [visibleCars, cars]);

  // CARS WITH PICS Add images to cars
  const carsWithPics = useMemo(() => {
    return visibleCars.map((veh) => ({
      ...veh,
      imageArray: invImagesMap[veh.images.model_imgs_key] || [],
    }));
  }, [visibleCars, invImagesMap]);

  //READY CARS
  const readyCars = useMemo(() => {
    return carsWithPics.filter(
      (car) => Array.isArray(car.imageArray) && car.imageArray.length > 0
    );
  }, [carsWithPics]);

  // SHOW MORE
  const handleShowMore = () => {
    setVisibleCars((prev) => [
      ...prev,
      ...cars.slice(prev.length, prev.length + 20),
    ]);
  };

  return (
    <div
      className="comp_root"
      style={{
        paddingBottom:
          !below820 && visibleCars.length >= cars.length ? "2rem" : null,
      }}
    >
      {below820 && <div style={{ margin: "1rem" }}>{cars.length} Matches</div>}
      {loadingCars || (cars.length > 0 && readyCars.length === 0) ? (
        <div className="loading-message">
          <LoadingWave />
        </div>
      ) : cars.length === 0 && allowNoResults ? (
        <div className="no_results">
          <ConcatH3 appliedFilters={appliedFilters} noResults={true} />
        </div>
      ) : (
        <div className="grid_root" ref={gridRef}>
          {readyCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index, 6) * 0.05 }}
            >
              <InventoryCard carData={car} below820={below820} />
            </motion.div>
          ))}
        </div>
      )}
      {visibleCars.length < cars.length &&
        visibleCars.length > 0 &&
        readyCars.length !== 0 && (
          <div className="showMoreWrapper">
            {" "}
            <p>
              {" "}
              Currently viewing {visibleCars.length} of {cars.length} matches{" "}
            </p>{" "}
            <Button
              text="SEE MORE MATCHES"
              outlineStyle2={true}
              onClick={handleShowMore}
              className="showMoreButton"
            />{" "}
          </div>
        )}
    </div>
  );
};

export default InventoryGrid;
