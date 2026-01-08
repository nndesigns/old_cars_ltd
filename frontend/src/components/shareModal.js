import React, { useState, useEffect } from "react";

import LinkIcon from "@mui/icons-material/Link";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import RedditIcon from "@mui/icons-material/Reddit";
import { LiaSmsSolid } from "react-icons/lia";
import { motion, AnimatePresence } from "framer-motion";
import "./invCard.css";
import { unlockScroll } from "../uiSlice";
import { useDispatch } from "react-redux";

const ITEM_STYLE = {
  border: "none",
  paddingBlock: ".8rem",
  paddingLeft: "3rem",
  background: "transparent",
  width: "100%",
  display: "flex",
  gap: "2rem",
  flexWrap: "unset",
  alignContent: "center",
  color: "var(--iconColor)",
  fontFamily: "inherit",
  cursor: "pointer",
  fontWeight: "inherit",
  transition: "all 0.3s ease",
};

const LABEL_STYLE = {
  display: "flex",
  alignItems: "center",
  fontSize: "1rem",
};

const SVG_STYLE = {
  color: "var(--invCardTitle)",
  fontSize: "2em",
  transition: "all 0.3s ease",
  //   fill: "var(--invCardTitle)",
};

const ShareModal = ({
  car,
  chosenCars,
  showShareModal,
  setShowShareModal,
  // setPreventScroll,
  compare,
}) => {
  // console.log("ShareModal received car", car);
  // console.log("chosenCars", chosenCars);
  // console.log("compare argument (shareModal)", compare);
  const [currentUrl, setCurrentUrl] = useState(
    compare ? window.location.href : `localhost3000/car/${car.id}`
  );
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState();
  const dispatch = useDispatch();

  const handleCopyLink = (prop) => {
    console.log("received prop", prop);
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setCopyMessage(`${compare ? "Compare" : "Car"} URL copied!`);
        setTimeout(() => {
          setCopied(false);
          setCopyMessage();
        }, 1500); // reset after 2 sec
      })
      .catch((err) => console.error("Copy failed", err));
  };

  const shareLinks = {
    sms: {
      scheme: (url) => `sms:?body=Check out this classic! ${url}`,
    },
    email: {
      scheme: (url) =>
        `mailto:?subject=Check out this classic!&body=${encodeURIComponent(
          url
        )}`,
    },
    telegram: {
      scheme: (url) => `tg://msg?text=Check out this classic! ${url}`,
      web: (url) =>
        `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=Check out this classic!`,
    },
    whatsApp: {
      scheme: (url) => `whatsapp://send?text=Check out this classic! ${url}`,
      web: (url) =>
        `https://api.whatsapp.com/send?text=${encodeURIComponent(
          "Check out this classic! " + url
        )}`,
    },
    facebook: {
      web: (url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
    },
    x: {
      web: (url) =>
        `https://x.com/intent/tweet?text=${encodeURIComponent(
          "Check out this classic! " + url
        )}`,
    },
    linkedIn: {
      web: (url) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          "Check out this classic! " + url
        )}`,
    },
    reddit: {
      web: (url) =>
        `https://www.reddit.com/submit?url=${encodeURIComponent(
          url
        )}&title=Check out this classic!`,
    },
  };

  const openPopupWindow = (url, title = "Share", width = 600, height = 600) => {
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const features = `
    width=${width},
    height=${height},
    left=${left},
    top=${top},
    resizable=yes,
    scrollbars=yes,
    status=no,
    toolbar=no,
    menubar=no
  `.replace(/\s+/g, "");

    window.open(url, title, features);
  };

  //   const handleClick = (key) => {
  //     const platform = shareLinks[key];
  //     if (!platform) return;

  //     const url = currentUrl;

  //     // Try to open a system-level client first, if one exists
  //     if (platform.scheme) {
  //       const schemeUrl = platform.scheme(url);
  //       const a = document.createElement("a");
  //       a.href = schemeUrl;
  //       a.style.display = "none";
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);

  //       // Wait a short time, then fall back to the web share URL
  //       if (platform.web) {
  // //         setTimeout(() => {
  //           /* window.open(platform.web(url), "_blank", "noopener,noreferrer"); */
  //           openPopupWindow(platform.web(url));
  // //         }, 500);
  //       }
  //     } else if (platform.web) {
  //       // If there's only a web option
  //       window.open(platform.web(url), "_blank", "noopener,noreferrer");
  //     }
  //   };
  const handleClick = (key) => {
    const platform = shareLinks[key];
    if (!platform) {
      console.log("no platform detected");
      return;
    }

    const url = currentUrl;

    // Try system scheme first
    if (platform.scheme) {
      const schemeUrl = platform.scheme(url);
      const a = document.createElement("a");
      a.href = schemeUrl;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Immediately open web fallback in a new window
    if (platform.web) {
      openPopupWindow(platform.web(url));
    }
  };
  // CLOSE SHARE
  const closeShare = (e) => {
    setShowShareModal(false);
    // setPreventScroll(false);
    dispatch(unlockScroll());
    e.stopPropagation();
  };

  const socialItems = [
    {
      type: "button",
      icon: <LinkIcon style={SVG_STYLE} />,
      label: "Copy link",
      onClick: () => handleCopyLink(car),
    },
    //// OPEN SYSTEM CLIENTS
    {
      type: "link",
      key: "sms",
      icon: <LiaSmsSolid style={SVG_STYLE} />,
      label: "SMS Text",
    },

    {
      type: "link",
      key: "email",
      icon: <EmailIcon style={SVG_STYLE} />,
      label: "Email",
    },
    {
      type: "link",
      key: "telegram",
      icon: <TelegramIcon style={SVG_STYLE} />,
      label: "Telegram",
    },
    {
      type: "link",
      key: "whatsApp",
      icon: <WhatsAppIcon style={SVG_STYLE} />,
      label: "Whatsapp",
    },
    //// OPEN BROWSER POPUP
    {
      type: "link",
      key: "facebook",
      icon: <FacebookIcon style={SVG_STYLE} />,
      label: "Facebook",
    },
    {
      type: "link",
      key: "x",
      icon: <TwitterIcon style={SVG_STYLE} />,
      label: "X (Twitter)",
    },
    {
      type: "link",
      key: "linkedIn",
      icon: <LinkedInIcon style={SVG_STYLE} />,
      label: "LinkedIn",
    },
    {
      type: "link",
      key: "reddit",
      icon: <RedditIcon style={SVG_STYLE} />,
      label: "Reddit",
    },
  ];

  return (
    <>
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            key="shareBG"
            className="featSpecBG"
            style={{ alignItems: "center" }}
            // ref={shareModalRef}
            onClick={(e) => {
              closeShare(e);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              key="shareModal"
              className="spec_box share"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className="share_title"
                style={{ paddingBlock: compare ? "1.25rem .75rem" : "" }}
              >
                Share Options
              </h3>
              {!compare && (
                <h4 className="share_subTitle">
                  {car.year} {car.make} {car.model}
                </h4>
              )}
              <ul>
                {socialItems.map((item, index) => {
                  const isHovered = hoveredIndex === index;
                  const iconStyle = {
                    ...SVG_STYLE,
                    transform: isHovered ? "scale(1.32)" : "scale(1)",
                    animation: isHovered
                      ? "shakeIcon 0.6s ease-in-out 1"
                      : "none",
                  };
                  const commonProps = {
                    style: ITEM_STYLE,
                    onMouseEnter: () => setHoveredIndex(index),
                    onMouseLeave: () => setHoveredIndex(null),
                    "aria-label": item.label,
                  };
                  return (
                    <li className="list_item" key={index}>
                      {item.type === "link" ? (
                        <a
                          className="share_item"
                          {...commonProps}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClick(item.key);
                          }}
                        >
                          {React.cloneElement(item.icon, { style: iconStyle })}
                          <span style={LABEL_STYLE}>{item.label}</span>
                        </a>
                      ) : (
                        <button
                          className="share_item"
                          {...commonProps}
                          type="button"
                          onClick={item.onClick}
                        >
                          {React.cloneElement(item.icon, { style: iconStyle })}
                          <span style={LABEL_STYLE}>{item.label}</span>
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    className="vinCopiedSpan carsCopySpan"
                    initial={{ opacity: 0, scale: 0.3, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.3, y: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {copyMessage}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>
        {`
          @keyframes shakeIcon {
            0% { transform: scale(1.1) rotate(0deg); }
            8% { transform: scale(1.25) rotate(0deg); }
            14%{ transform: scale(1.32) rotate(0deg); }
            25% { transform: scale(1.32) rotate(-10deg); }
            50% { transform: scale(1.32) rotate(10deg); }
            75% { transform: scale(1.32) rotate(-10deg); }
            100% { transform: scale(1.32) rotate(0deg); }
          }`}
      </style>
    </>
  );
};

export default ShareModal;
