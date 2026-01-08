import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { getModelImageURLs } from "./axiosCalls.js";
import "../pages/vehiclePage.css";
import {
  LeftScrollBtnLarge,
  RightScrollBtnLarge,
} from "./buttons/scrollBtns.js";
import { handleScroll } from "./utils.js";
import ImagePreviewer from "./ImagePreviewer/imgPreviewer.js";
// import { LoadingWave } from "../components/inventoryGrid/loadingWave.js";
import NoImage from "../images/no_image.webp";

import { AnimatePresence } from "framer-motion";
// import { FadeTransition } from "../App.js";
import { FadeTransition } from "../animations.js";

const ImgScrollGallery = ({ model_imgs_key, below900 }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(null);
  const [canScrollRight, setCanScrollRight] = useState(null);
  const [invImagesMap, setInvImagesMap] = useState({});

  const placeholderArray = Array(10).fill(NoImage);

  //IMAGE PREVIEWER
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // SCROLL CONTAINER
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesMap = await getModelImageURLs([model_imgs_key], true);

        let updatedMap = imagesMap;
        if (imagesMap[model_imgs_key] === null) {
          updatedMap = {
            [model_imgs_key]: placeholderArray,
          };
        }

        // Preload all images BEFORE updating state
        const preloadImage = (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve; // resolve once fully loaded
            img.onerror = resolve; // fail gracefully
          });

        await Promise.all(updatedMap[model_imgs_key].map(preloadImage));
        // Only update state now — all images in browser cache
        setInvImagesMap((prev) => ({
          ...prev,
          ...updatedMap,
        }));
      } catch (err) {
        console.error("Failed to fetch image map", err);
      }
    };

    fetchImages();
  }, [model_imgs_key]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const updateButtonVisibility = () => {
      if (!scrollContainer) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      setCanScrollLeft(Math.ceil(scrollLeft) > 0);
      setCanScrollRight(Math.floor(scrollLeft + clientWidth) < scrollWidth - 1);
    };
    const images = scrollContainer?.querySelectorAll("img");
    if (!images || images.length === 0) return;
    let loadedCount = 0;
    const onImgLoad = () => {
      loadedCount += 1;
      if (loadedCount === images.length) {
        updateButtonVisibility();
      }
    };
    images.forEach((img) => {
      if (img.complete) {
        onImgLoad();
      } else {
        img.addEventListener("load", onImgLoad);
        img.addEventListener("error", onImgLoad);
      }
    });
    updateButtonVisibility();
    scrollContainer.addEventListener("scroll", updateButtonVisibility);
    window.addEventListener("resize", updateButtonVisibility);

    return () => {
      scrollContainer?.removeEventListener("scroll", updateButtonVisibility);
      window.removeEventListener("resize", updateButtonVisibility);
    };
  }, [invImagesMap[model_imgs_key]]);

  ///IMAGE PREVIEWER
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsPreviewOpen(true);
  };

  // const allImages = invImagesMap[model_imgs_key] || [NoImage];
  const allImages = invImagesMap[model_imgs_key] ?? [NoImage];

  return (
    <>
      <div className="gallery_wrapper">
        {Object.keys(invImagesMap).length === 0 && (
          <AnimatePresence mode="wait">
            <FadeTransition key="loading" className="gallery_root">
              <div className="first_img_container load" />
              <div className="image_grid">
                {Array(9)
                  .fill(null)
                  .map((_, i) => (
                    <div className="grid_item load" key={i} />
                  ))}
              </div>
            </FadeTransition>
          </AnimatePresence>
        )}

        {Object.keys(invImagesMap).length > 0 && (
          <AnimatePresence mode="wait">
            <FadeTransition
              key="content"
              className="gallery_root"
              ref={scrollContainerRef}
            >
              {!below900 && canScrollLeft && (
                <LeftScrollBtnLarge
                  onClick={() => handleScroll(scrollContainerRef, -1)}
                  customStyle={{ marginLeft: "-5px" }}
                />
              )}
              <div
                className="first_img_container"
                onClick={() => handleImageClick(0)}
              >
                <img
                  src={invImagesMap[model_imgs_key]?.[0]}
                  alt={`car_image_1`}
                  className="first_image car_img"
                />
              </div>
              <div className="image_grid">
                {invImagesMap[model_imgs_key]?.slice(1).map((url, index) => (
                  <div
                    className="grid_item"
                    key={index}
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <img
                      className="grid_img car_img"
                      src={url}
                      alt={`car_image_${index + 2}`}
                    />
                  </div>
                ))}
              </div>
              {!below900 && canScrollRight && (
                <RightScrollBtnLarge
                  onClick={() => handleScroll(scrollContainerRef, 1)}
                />
              )}
            </FadeTransition>
          </AnimatePresence>
        )}
      </div>
      <ImagePreviewer
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
        images={allImages}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />
    </>
  );
};

export default ImgScrollGallery;
