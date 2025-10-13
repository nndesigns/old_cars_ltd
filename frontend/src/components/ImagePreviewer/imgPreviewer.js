import React, { useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion"; // use framer-motion, not motion/react
import "./imagePreviewer.css";

const ImagePreviewer = ({
  images,
  currentIndex,
  onClose,
  setCurrentIndex,
  isOpen,
}) => {
  // Close when user presses Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  if (!isOpen || !images || images.length === 0) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="image_previewer_overlay"
          onClick={onClose}
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
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <button className="close_btn" onClick={onClose}>
              <IoCloseCircleOutline size={30} />
            </button>

            <button className="nav_btn left" onClick={handlePrev}>
              <FaChevronLeft size={36} />
            </button>

            <img
              src={images[currentIndex]}
              alt={`preview_${currentIndex}`}
              className="preview_image"
            />

            <button className="nav_btn right" onClick={handleNext}>
              <FaChevronRight size={36} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ImagePreviewer;
