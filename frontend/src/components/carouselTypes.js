import React from "react";
import {
  LeftScrollBtnSmall,
  RightScrollBtnSmall,
} from "./buttons/scrollBtns.js";
import Box from "@mui/joy/Box";

const CarouselTypes = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  return (
    <div className="wrapper_box">
      {canScrollLeft && (
        <LeftScrollBtnSmall
          onClick={() => handleScroll(scrollContainerRef, -1)}
        />
      )}
      <Box ref={scrollContainerRef}>
        {data.map((item, index) => (
          <StyleCard
            showArrows={showArrows}
            orientation="vertical"
            key={index}
            size={showArrows ? "md" : "sm"}
          >
            <AspectRatio sx={{ width: 130 }}>
              {item.icon && (
                <item.icon
                  style={{
                    fill: "var(--iconColor)",
                  }}
                />
              )}
            </AspectRatio>
            <Box sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
              <Typography>{item.title}</Typography>{" "}
            </Box>
          </StyleCard>
        ))}
      </Box>

      {canScrollRight && (
        <LeftScrollBtnSmall
          onClick={() => handleScroll(scrollContainerRef, -1)}
        />
      )}
    </div>
  );
};

export default CarouselTypes;
