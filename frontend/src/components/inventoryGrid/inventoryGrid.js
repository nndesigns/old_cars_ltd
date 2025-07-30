import React, { useState, useEffect, useRef, useMemo } from "react";
import "../inventoryCard";
import "./invGrid.css";
import InventoryCard from "../inventoryCard";
import { getModelImageURLs } from "../axiosCalls.js";
import Button from "../buttons/button.js";

const InventoryGrid = ({ cars, below820 }) => {
  const [invImagesMap, setInvImagesMap] = useState({});
  const [visibleCount, setVisibleCount] = useState(22);
  const gridRef = useRef(null);

  //GRID RESIZING
  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const updateColumns = (width) => {
      let columns = 1;
      if (width >= 1200) columns = 4;
      else if (width >= 904) columns = 3;
      else if (width >= 608) columns = 2;

      // Defer the write to the next animation frame to avoid ResizeObserver loop warning
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
    updateColumns(gridElement.offsetWidth); // Initial run

    return () => {
      observer.disconnect();
    };
  }, []);

  //FETCH IMAGES
  useEffect(() => {
    const fetchImages = async () => {
      if (!Array.isArray(cars) || cars.length === 0) return;

      // 1. Slice only the visible portion of cars
      const sourceData = cars.slice(0, visibleCount);

      // 2. Extract model image keys from visible cars
      const allModelImgKeys = [
        ...new Set(
          sourceData
            .map((obj) => obj?.images?.model_imgs_key)
            .filter((key) => !!key)
        ),
      ];

      // 3. Remove keys that already exist in invImagesMap
      const newKeysToFetch = allModelImgKeys.filter(
        (key) => !invImagesMap?.[key]
      );

      // console.log("newKeysToFetch", newKeysToFetch);

      if (newKeysToFetch.length === 0) return;

      try {
        // 4. Fetch only the new image keys
        const imagesMap = await getModelImageURLs(newKeysToFetch, !!cars);

        // 5. Merge them into the existing image map
        setInvImagesMap((prev) => ({
          ...prev,
          ...imagesMap,
        }));
      } catch (err) {
        console.error("Failed to fetch image map", err);
      }
    };

    fetchImages();
  }, [cars, visibleCount]);

  const carsWithPics = useMemo(() => {
    return cars.map((veh) => ({
      ...veh,
      imageArray: invImagesMap[veh.images.model_imgs_key] || [],
    }));
  }, [cars, invImagesMap]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <div
      className="comp_root"
      style={{
        paddingBottom:
          !below820 && visibleCount >= carsWithPics.length ? "2rem" : null,
      }}
    >
      {below820 && <div style={{ margin: "1rem" }}>{cars.length} Matches</div>}
      <div className="grid_root" ref={gridRef}>
        {carsWithPics.slice(0, visibleCount).map((car, index) => (
          <InventoryCard key={car.id || index} carData={car} />
        ))}
      </div>

      {visibleCount < carsWithPics.length && (
        <div className="showMoreWrapper">
          <p>
            Currently viewing {visibleCount} of {cars.length} matches
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
