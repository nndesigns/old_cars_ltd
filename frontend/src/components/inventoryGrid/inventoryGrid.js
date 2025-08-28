import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import InventoryCard from "../inventoryCard";
import "./invGrid.css";
import Button from "../buttons/button.js";
import { getModelImageURLs } from "../axiosCalls.js"; // adjust import

const InventoryGrid = ({ cars, below820 /* , isMobile */ }) => {
  const [invImagesMap, setInvImagesMap] = useState({});
  const [visibleCars, setVisibleCars] = useState([]);
  const gridRef = useRef(null);
  const [loadingImages, setLoadingImages] = useState(true);

  // GRID RESIZING
  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const updateColumns = (width) => {
      let columns = 1;
      if (width >= 1200) columns = 4;
      else if (width >= 904) columns = 3;
      else if (width >= 608) columns = 2;

      requestAnimationFrame(() => {
        gridElement.style.setProperty("--cars-listing-columns", columns);
      });
    };

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        updateColumns(width);
      }
    });

    observer.observe(gridElement);
    updateColumns(gridElement.offsetWidth);

    return () => {
      observer.disconnect();
    };
  }, []);

  // INITIALIZE visibleCars
  useEffect(() => {
    if (Array.isArray(cars) && cars.length > 0) {
      setVisibleCars(cars.slice(0, 22)); // first batch
    } else {
      setVisibleCars([]);
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
        setLoadingImages(false);
        return;
      }

      // console.log("newKeysToFetch", newKeysToFetch);

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
  }, [visibleCars, cars]);

  // Add images to cars
  const carsWithPics = useMemo(() => {
    return visibleCars.map((veh) => ({
      ...veh,
      imageArray: invImagesMap[veh.images.model_imgs_key] || [],
    }));
  }, [visibleCars, invImagesMap]);

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

      <div className="grid_root" ref={gridRef}>
        {loadingImages && visibleCars.length === 0 ? (
          <div className="loading-message">
            <h1 style={{ fontSize: "4rem" }}>Loading results...</h1>
          </div>
        ) : (
          carsWithPics.map((car, index) => (
            <motion.div
              key={car.id /* || index */}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <InventoryCard
                key={car.id}
                carData={car}
                /* isMobile={isMobile}  */ below820={below820}
              />
            </motion.div>
          ))
        )}
      </div>

      {visibleCars.length < cars.length && (
        <div className="showMoreWrapper">
          <p>
            Currently viewing {visibleCars.length} of {cars.length} matches
          </p>
          <Button
            text="SEE MORE MATCHES"
            outlineStyle2={true}
            onClick={handleShowMore}
            className="showMoreButton"
          />
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;
