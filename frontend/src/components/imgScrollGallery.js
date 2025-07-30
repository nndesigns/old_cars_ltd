import React, { useState, useEffect, useRef } from "react";
import { getModelImageURLs } from "./axiosCalls.js";
import "../pages/vehiclePage.css";
import {
  LeftScrollBtnLarge,
  RightScrollBtnLarge,
} from "./buttons/scrollBtns.js";
import { handleScroll } from "./utils.js";

const ImgScrollGallery = ({ model_imgs_key, below900 }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [invImagesMap, setInvImagesMap] = useState({});
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // 4. Fetch only the new image keys
        const imagesMap = await getModelImageURLs([model_imgs_key], true);
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

    scrollContainer.addEventListener("scroll", updateButtonVisibility);
    window.addEventListener("resize", updateButtonVisibility);

    // Run once immediately in case all images are already loaded
    updateButtonVisibility();

    return () => {
      scrollContainer?.removeEventListener("scroll", updateButtonVisibility);
      window.removeEventListener("resize", updateButtonVisibility);
    };
  }, [invImagesMap[model_imgs_key]]);

  return (
    <div className="gallery_wrapper">
      <div className="gallery_root" ref={scrollContainerRef}>
        {!below900 && canScrollLeft && (
          <LeftScrollBtnLarge
            onClick={() => handleScroll(scrollContainerRef, -1)}
            customStyle={{
              position: "absolute",
              top: "50%",
              left: "-5px",
              paddingInline: "20px",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          />
        )}
        <div className="first_img_container">
          <img
            src={invImagesMap[model_imgs_key]?.[0]}
            alt={`car_image_1`}
            className="first_image"
          />
        </div>
        <div className="image_grid">
          {invImagesMap[model_imgs_key]?.slice(1).map((url, index) => (
            <div className="grid_item" key={index}>
              <img
                className="grid_img"
                key={index}
                src={url}
                alt={`car_image_${index + 2}`}
              />
            </div>
          ))}
        </div>
        {!below900 && canScrollRight && (
          <RightScrollBtnLarge
            onClick={() => handleScroll(scrollContainerRef, 1)}
            customStyle={{
              position: "absolute",
              top: "50%",
              paddingInline: "20px",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImgScrollGallery;
