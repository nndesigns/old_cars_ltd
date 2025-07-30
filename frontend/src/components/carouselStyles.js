// carouselStyles.js
const carouselStyles = (props) => {
  const { canScrollLeft, canScrollRight, showArrows, above1200, modelData } =
    props;

  return {
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    marginTop: props.carStyles ? "" : "-1rem",
    paddingTop: "1rem",
    paddingBottom: "18px",
    paddingInline: !props.carsPage ? (above1200 ? "0px" : "24px") : "24px",
    gap: props.nearYou
      ? "6px"
      : modelData
      ? showArrows && !props.carStyles
        ? "14px"
        : "10px"
      : showArrows
      ? props.carStyles
        ? "10px"
        : "19px"
      : "10px",
    overflow: /* props.carStyles ? "scroll" :  */ "auto", //THIS IS NEW
    width: "100%",
    height: "100%",
    "&::before":
      props.carStyles && !props.carsPage
        ? {
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            height: "100%",
            width: "100%",
            boxShadow: `
            ${
              canScrollLeft && showArrows
                ? "inset 20px 0 15px -10px rgba(0,0,0,0.3)"
                : ""
            }
            ${canScrollLeft && canScrollRight ? "," : ""}
            ${
              canScrollRight && showArrows
                ? "inset -20px 0 15px -10px rgba(0,0,0,0.3)"
                : ""
            }
          `,
            pointerEvents: "none",
            zIndex: 1,
          }
        : "",
    zIndex: 1,
    "::-webkit-scrollbar": { display: "none" },
  };
};

export default carouselStyles;
