import React, { useState, useEffect } from "react";
import Button from "./buttons/button";
import { ImArrowLeft } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const SearchBackBtn = ({ page, style, mobile }) => {
  const navigate = useNavigate();
  const [below900, setBelow900] = useState(window.innerWidth < 900);
  //RESIZE LISTENER
  useEffect(() => {
    const handleResize = () => {
      setBelow900(window.innerWidth < 900);
    };
    window.addEventListener("resize", handleResize);
    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchBackBtnStyle = {
    marginBlock: below900 ? "1rem 1.5rem" : "1.5rem 1rem",
    display: "flex",
    gap: ".5rem",
    paddingInline: below900 ? ".8rem" : "1.25rem",
    height: below900 ? "40px" : "inherit",
    paddingBlock: below900 ? ".65rem" : "",
    ...style,
  };

  return (
    <Button
      text={page === "car" ? "Search" : mobile ? "Back" : "Back to Search"}
      outlineStyle2={true}
      style={searchBackBtnStyle}
      svg={<ImArrowLeft />}
      onClick={() => navigate("/cars")}
    />
  );
};

export default SearchBackBtn;
