import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { ReactComponent as Logo } from "../icons/nav_icons/logo.svg";
// import Button from "./buttons/button";
import LocationModal from "./locationModal";
import { RiArrowDownSFill } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";
import { BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { createPortal } from "react-dom";
import LocationChangeModal from "./locationChangeModal.js";
import { Link } from "react-router-dom";

const Footer = ({ inv }) => {
  const [above900, setAbove900] = useState(window.innerWidth > 900);
  const [above1200, setAbove1200] = useState(window.innerWidth > 1200);
  const [below767, setBelow767] = useState(window.innerWidth < 767);

  const [locationHovered, setLocationHovered] = useState(false);
  const location = useSelector((state) => state.location);
  const [showLocationChangeModal, setShowLocationChangeModal] = useState(false);
  const [locObjs, setLocObjs] = useState(null);
  const locationRef = useRef(null);
  const locationChangeRef = useRef(null);
  const locationValueRef = useRef("");
  const mousedownInsideLCM = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setAbove900(window.innerWidth > 900);
      setAbove1200(window.innerWidth > 1200);
      setBelow767(window.innerWidth < 767);
    };
    window.addEventListener("resize", handleResize);
    // Clean up listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const PageWrapper = styled("div")(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,.4)",
    zIndex: "20",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }));

  const Footer = styled("footer")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--iconColor)",
    color: "white",
    padding: "1rem 1.5rem",
    paddingBottom: below767 ? "5rem" : "1.5rem",
    gap: "2.8rem",

    "& > *": {
      // border: "1px solid red",
      maxWidth: "1200px",
      width: "100%",
      alignSelf: "center",
      // margin: "0 auto",
    },
  }));

  const IconBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginLeft: above1200 ? "1rem" : "",
    "& > a": {
      display: "inline-flex",
      alignSelf: "center",
      margin: "0px",
      color: "white",
      fontSize: "1.75rem",
    },
  }));

  const FooterSectionBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "1rem",
    marginBottom: "2rem",

    "& > h3": {
      fontWeight: "800",
    },

    "& > a": {
      fontSize: ".9em",
      textDecoration: "none",
      color: "white",
    },
  }));

  const locationBtn = {
    padding: ".6rem 0",
    color: "white",
    fill: "white",
    backgroundColor: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: ".25rem",
    cursor: "pointer",
    fontSize: ".9em",
  };

  const LinksSection = styled("section")(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    lineHeight: ".75",
    textAlign: "center",
    "& > a": {
      textDecoration: "none",
      color: "white",
      fontSize: ".7em",
    },
  }));

  // FOOTER CHILD STYLES
  const styles = {
    footer_child: {
      display: "flex",
      flexDirection: above900 ? "row" : "column",
    },
    bottom: {
      justifyContent: above900 ? "space-between" : "",
    },
  };

  useEffect(() => {
    if (!locationHovered && !showLocationChangeModal) return;

    //LCM  outside click listener
    const handleMouseDown = (e) => {
      if (showLocationChangeModal) {
        if (!locationChangeRef.current.contains(e.target)) {
          setShowLocationChangeModal(false);
        } else {
          mousedownInsideLCM.current = true;
        }
      }
    };

    //LM outside click listener
    const handleClickOutside = (event) => {
      if (locationHovered && !showLocationChangeModal) {
        // console.log("this was triggered");
        locationValueRef.current = "";

        if (!locationRef.current.contains(event.target)) {
          setLocationHovered(false);
        }
      }

      // LOCATION MODAL
      if (
        locationHovered &&
        locationRef.current && //<LocationSpan/> exists in the DOM
        !locationRef.current.contains(event.target) && //click that triggered HCO wasn't in it
        !showLocationChangeModal && //LCM not currently displayed
        !locationValueRef.current //
      ) {
        setLocationHovered(false);
        // locationFocusRef.current = false;
        locationValueRef.current = "";
      }

      // LOCATION CHANGE MODAL
      if (
        showLocationChangeModal &&
        locationChangeRef.current &&
        !locationChangeRef.current.contains(event.target) &&
        !mousedownInsideLCM.current //if mousedown didn't occur inside of LCM
      ) {
        // console.log("THIS WAS TRIGGERED");
        setShowLocationChangeModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("mousedown", handleMouseDown);
      mousedownInsideLCM.current = false;
    };
  }, [
    locationHovered,
    setLocationHovered,
    showLocationChangeModal,
    locationValueRef,
    locationRef,
    // locationFocusRef,
    locationChangeRef,
  ]);

  return (
    <Footer>
      {showLocationChangeModal &&
        createPortal(
          <PageWrapper>
            {/****** LOCATION CHANGE MODAL ******/}
            <LocationChangeModal
              ref={locationChangeRef}
              location={location} //user Redux location passed from LocationModal
              locationValueRef={locationValueRef}
              setShowLocationChangeModal={setShowLocationChangeModal}
              inv={inv}
              locObjs={locObjs}
              setLocObjs={setLocObjs}
            />
          </PageWrapper>,
          document.body
        )}
      <div style={{ ...styles.footer_child, ...styles.top }}>
        {above1200 && (
          <Link to="/" style={{ display: "flex" }}>
            <Logo
              style={{
                fill: "#f4f5f7",
                width: "215px",
              }}
            />
          </Link>
        )}
        {above900 && (
          <IconBox>
            <a href="">
              <BsYoutube />
            </a>
            <a href="">
              <RiInstagramFill />
            </a>
            <a href="">
              <FaTiktok />
            </a>
            <a href="">
              <FaFacebook />
            </a>
          </IconBox>
        )}

        <span
          ref={locationRef}
          style={{
            display: "inline-block",
            width: "max-content",
            // border: "1px solid blue",
            position: "relative",
            marginLeft: above900 ? "auto" : "unset",
          }}
          onMouseEnter={() => {
            setLocationHovered(true);
          }}
          onMouseLeave={() => {
            setLocationHovered(false);
          }}
        >
          {locationHovered && (
            <LocationModal
              location={location}
              setShowLocationChangeModal={setShowLocationChangeModal}
              locationValueRef={locationValueRef}
              setLocObjs={setLocObjs}
              style={{
                top: "-23rem",
                left: above900 ? "unset" : "0",
                right: above900 ? "0" : "unset",
                zIndex: "3",
              }}
            />
          )}
          <button style={locationBtn}>
            <CiLocationOn style={{ height: "1.75em", width: "1.75em" }} />
            {location.city}
            <RiArrowDownSFill />
          </button>
        </span>
      </div>

      <div style={{ ...styles.footer_child, ...styles.bottom }}>
        <FooterSectionBox>
          <h3>Shop</h3>
          <a href="">Browse by category</a>
          <a href="">View all inventory</a>
          <a href="">Find a store</a>
        </FooterSectionBox>
        <FooterSectionBox>
          <h3>Sell/Trade</h3>
          <a href="">Get an online offer</a>
          <a href="">How it works</a>
        </FooterSectionBox>
        <FooterSectionBox>
          <h3>Finance</h3>
          <a href="">Get pre-qualified</a>
          <a href="">How it works</a>
          <a href="">Old Cars Ltd Financing</a>
        </FooterSectionBox>
        <FooterSectionBox>
          <h3>About</h3>
          <a href="">About Old Cars Ltd</a>
          <a href="">Contact Us</a>
          <a href="">Social impact</a>
          <a href="">Old Cars Ltd giving back</a>
          <a href="">Media center</a>
          <a href="">Supplier inclusion</a>
          <a href="">Investor relations</a>
        </FooterSectionBox>
        <FooterSectionBox>
          <h3>Careers</h3>
          <a href="">Search jobs</a>
        </FooterSectionBox>
        <FooterSectionBox>
          <h3>More</h3>
          <a href="">Service & repairs</a>
          <a href="">FAQ & support</a>
          <a href="">Why Old Cars Ltd</a>
          <a href="">Buying online</a>
          <a href="">Car research & advice</a>
          <a href="">Guide to EVs</a>
          <a href="">Warranties</a>
        </FooterSectionBox>
        {!above900 && (
          <IconBox>
            <a href="">
              <BsYoutube />
            </a>
            <a href="">
              <FaFacebook />
            </a>
            <a href="">
              <FaTiktok />
            </a>
            <a href="">
              <RiInstagramFill />
            </a>
          </IconBox>
        )}
      </div>

      <p style={{ textAlign: "center", fontSize: ".95em", lineHeight: "1.5" }}>
        By using OldCarsLtd.com, you consent to the monitoring and storing of
        your interactions with the website, including with a OldCarsLtd user,
        for use in improving and personalizing our services. See our{" "}
        <a href="" style={{ color: "white" }}>
          Privacy Policy
        </a>{" "}
        for details.
      </p>

      <LinksSection>
        <a href="">Privacy Policy</a> |{" "}
        <a href="">Do Not Sell or Share My Information</a> |{" "}
        <a href="">Financial Privacy Policy</a> |{" "}
        <a href="">Interest-Based Ads</a> | <a href="">Terms of Use</a> |{" "}
        <a href="">Responsible Disclosure</a> |{" "}
        <a href="">OldCarsLtd Recall Policy</a> |{" "}
        <a href="">Social Community Guidelines</a> |{" "}
        <a href="">CA Supply Chain Transparency</a> |{" "}
        <a href="">Accessibility</a> | <a href="">Feedback</a>
      </LinksSection>

      <p style={{ textAlign: "center", fontSize: ".75em" }}>
        Copyright &copy; 2025 OldCarsLtd, LLC
      </p>
    </Footer>
  );
};

export default Footer;
