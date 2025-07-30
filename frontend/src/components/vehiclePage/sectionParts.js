import { useState } from "react";
import { formatPrice } from "../utils";
import { PiArrowFatLineDownFill } from "react-icons/pi";
import { MdAttachMoney } from "react-icons/md";
import { PiSpeakerHifi } from "react-icons/pi";
import { GiSpeedometer } from "react-icons/gi";
import { PiArrowFatLinesDownBold } from "react-icons/pi"; // low miles

const calcPerYearMiles = function (carData) {
  const currentYear = new Date().getFullYear();
  const yearsToDate = currentYear - carData.year;
  const raw = Number(carData.mileage) / yearsToDate;
  const rounded = Math.ceil(raw / 100) * 100;
  // Format with commas
  return rounded.toLocaleString();
};

// TABS DROP DOWN
const TabsDropdown = ({ tabs, handleTabSelect, activeTab, sectionRefs }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tabs_dropdown">
      <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {tabs[activeTab] || "Select Tab"}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          {tabs.map((label, index) => (
            <li
              //     ref={sectionRefs[index].current}
              key={index}
              className={`dropdown-item ${index === activeTab ? "active" : ""}`}
              onClick={() => handleTabSelect(index)}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

////// SECTION PARTS /////
//// ABOUT THE PRICE
const AboutThePrice = ({ price }) => {
  return (
    <section className="section aboutPrice">
      <h3 className="section_h3">About the Price</h3>
      <div className="aboutPrice_main">
        <div className="priceDrop_box">
          <button className="priceDrop_btn">Price Drop</button>
          <div className="was_price">
            was <span className="crossOut">{formatPrice(price + 1000)}</span>
          </div>

          <div className="actualPrice">
            <PiArrowFatLineDownFill />
            <MdAttachMoney />
            {formatPrice(price)}
          </div>
        </div>
        <p className="aboutPrice_para">
          We lowered the price so that you the customer can pay less, because we
          care and we want to retain your business in the future. No problem. No
          worries.
        </p>
      </div>
    </section>
  );
};

///// OVERVIEW
const Overview = ({ carData, mobile, sectionRefs }) => {
  return (
    <section className="section overview" ref={sectionRefs.current[0]}>
      <h3 className="section_h3">Overview</h3>
      <div className={mobile ? "overview_grid_mobile" : "overview_grid"}>
        <div className="grid_cell equip">
          <GiSpeedometer />
          {mobile ? (
            <div className="text_container">
              <h4 className="cell_title">Well-Equipped</h4>
              <p className="grid_para">
                Sunroof(s), Rear View Camera, Infinity Sound System, Bluetooth
                Technology, Alloy Wheels
              </p>
            </div>
          ) : (
            <>
              <h4 className="cell_title">Well-Equipped</h4>
              <p className="grid_para">
                Sunroof(s), Rear View Camera, Infinity Sound System, Bluetooth
                Technology, Alloy Wheels
              </p>
            </>
          )}
        </div>

        <div className="grid_cell mile">
          <PiArrowFatLinesDownBold />
          {mobile ? (
            <div className="text_container">
              <h4 className="cell_title">Low Miles Per Year</h4>
              <p className="grid_para">
                Less than {calcPerYearMiles(carData)} miles per year
              </p>
            </div>
          ) : (
            <>
              <h4 className="cell_title">Low Miles Per Year</h4>
              <p className="grid_para">
                Less than {calcPerYearMiles(carData)} miles per year
              </p>
            </>
          )}
        </div>

        <div className="grid_cell audio">
          <PiSpeakerHifi />
          {mobile ? (
            <div className="text_container">
              <h4 className="cell_title">Premium Audio</h4>
              <p className="grid_para">Infinity Sound System</p>
            </div>
          ) : (
            <>
              <h4 className="cell_title">Premium Audio</h4>
              <p className="grid_para">Infinity Sound System</p>
            </>
          )}
        </div>
        {mobile && <hr style={{ marginBlock: "1.25rem", opacity: ".6" }} />}
        {mobile ? (
          <div className="bottom_grid">
            <div className="grid_cell mpg">
              <h4 className="cell_title">
                {carData.mpg_city} city / {carData.mpg_hwy} hwy
              </h4>
              <p className="grid_para">Miles per gallon</p>
            </div>
            <div className="grid_cell engine">
              <h4 className="cell_title">{carData.engine}, Gas</h4>
              <p className="grid_para">Engine</p>
            </div>
            <div className="grid_cell wheel">
              <h4 className="cell_title">
                {carData.drive_type === "FWD"
                  ? "Front Wheel Drive"
                  : "Rear Wheel Drive"}
              </h4>
              <p className="grid_para">Drive type</p>
            </div>
            <div className="grid_cell trans">
              <h4 className="cell_title">{carData.transmission}</h4>
              <p className="grid_para">Transmission</p>
            </div>
            <div className="grid_cell color">
              <h4 className="cell_title">{carData.color}</h4>
              <p className="grid_para">Color</p>
            </div>
            <div className="grid_cell use">
              <h4 className="cell_title">None</h4>
              <p className="grid_para">Prior Use</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid_cell mpg">
              <h4 className="cell_title">
                {carData.mpg_city} city / {carData.mpg_hwy} hwy
              </h4>
              <p className="grid_para">Miles per gallon</p>
            </div>
            <div className="grid_cell engine">
              <h4 className="cell_title">{carData.engine}, Gas</h4>
              <p className="grid_para">Engine</p>
            </div>
            <div className="grid_cell wheel">
              <h4 className="cell_title">
                {carData.drive_type === "FWD"
                  ? "Front Wheel Drive"
                  : "Rear Wheel Drive"}
              </h4>
              <p className="grid_para">Drive type</p>
            </div>
            <div className="grid_cell trans">
              <h4 className="cell_title">{carData.transmission}</h4>
              <p className="grid_para">Transmission</p>
            </div>
            <div className="grid_cell color">
              <h4 className="cell_title">{carData.color}</h4>
              <p className="grid_para">Color</p>
            </div>
            <div className="grid_cell use">
              <h4 className="cell_title">None</h4>
              <p className="grid_para">Prior Use</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

/////  FEATURES & SPECS
const FeaturesAndSpecs = ({ sectionRefs }) => {
  return (
    <section className="section features" ref={sectionRefs.current[1]}>
      <h3 className="section_h3">Features & Specs</h3>
    </section>
  );
};

/////  DELIVERY BOX
const DeliveryBox = ({}) => {
  return (
    <section className="section delivery">
      <h3 className="section_h3">Delivery Box</h3>
    </section>
  );
};

/////  GET PERSONALIZED TERMS
const GetPersonalizedTerms = ({}) => {
  return (
    <section className="section personalized">
      <h3 className="section_h3">Get Personalized terms in minutes</h3>
    </section>
  );
};

/////  HISTORY & INSPECTION
const HistoryAndInspection = ({ sectionRefs }) => {
  return (
    <section className="section history" ref={sectionRefs.current[2]}>
      <h3 className="section_h3">History & inspection</h3>
    </section>
  );
};

/////  WARRANTY
const Warranty = ({ sectionRefs }) => {
  return (
    <section className="section warranty" ref={sectionRefs.current[3]}>
      <h3 className="section_h3">Warranty</h3>
    </section>
  );
};

/////  RATINGS & REVIEWS
const RatingsReviews = ({ sectionRefs }) => {
  return (
    <section className="section ratings" ref={sectionRefs.current[4]}>
      <h3 className="section_h3">Ratings & Reviews</h3>
    </section>
  );
};

export {
  AboutThePrice,
  Overview,
  FeaturesAndSpecs,
  GetPersonalizedTerms,
  HistoryAndInspection,
  Warranty,
  RatingsReviews,
  DeliveryBox,
  TabsDropdown,
};
