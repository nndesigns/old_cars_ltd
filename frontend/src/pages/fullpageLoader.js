import React from "react";
import "./fullpageLoader.css";
import logoCar from "../images/logoCar_lg.png"; // adjust path
import { LoadingWave } from "../components/inventoryGrid/loadingWave";

const homeStyles = {
  background: "rgba(65, 86, 88, .6)",
};

const otherStyles = {
  // position: "absolute",
  marginTop: -137.19,
  // zIndex: -100,
};

const FullPageLoader = ({ home }) => {
  return (
    <div className="loader-overlay" style={home ? homeStyles : otherStyles}>
      <div className="loader-content">
        <LoadingWave style={{ color: home ? "white" : "var(--iconColor" }} />
      </div>
    </div>
  );
};

export default FullPageLoader;
