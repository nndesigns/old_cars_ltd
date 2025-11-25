import React, { useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion"; // use framer-motion, not motion/react
import "./imagePreviewer.css";

const ImagePreviewer = ({
  isPreviewOpen,
  setIsPreviewOpen,
  images,
  currentIndex,

  setCurrentIndex,
}) => {
  // Close when user presses Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsPreviewOpen(false);
      if (e.key === "ArrowLeft") handlePrev(e);
      if (e.key === "ArrowRight") handleNext(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      {isPreviewOpen && (
        <motion.div
          className="image_previewer_overlay"
          onClick={() => setIsPreviewOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            className="image_previewer_content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              className="close_btn"
              onClick={() => setIsPreviewOpen(false)}
            >
              <IoCloseCircleOutline size={30} />
            </button>

            <button className="nav_btn left" onClick={(e) => handlePrev(e)}>
              <FaChevronLeft size={36} />
            </button>

            <img
              src={images[currentIndex]}
              alt={`preview_${currentIndex}`}
              className="preview_image"
            />

            <button className="nav_btn right" onClick={(e) => handleNext(e)}>
              <FaChevronRight size={36} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewer;
