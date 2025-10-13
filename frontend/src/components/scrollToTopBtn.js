import { useState, useEffect } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button if scrolled more than 300px (adjust as needed)
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // if (!showButton) return null; // hide the button if not scrolled enough

  return (
    <button
      className="scrollToTopBtn"
      onClick={scrollToTop}
      style={{ transform: showButton ? "" : "translateY(200px)" }}
    >
      <AiOutlineArrowUp /> BACK TO TOP
    </button>
  );
}

export default ScrollToTopButton;
