import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import InventoryCard from "../components/inventoryCard";
import { getModelImageURLs } from "../components/axiosCalls";

const Favorites = ({ hearted_cars }) => {
  const [favoritesImagesMap, setFavoritesImagesMap] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!hearted_cars || hearted_cars.length === 0) return;

    const allModelImgKeys = [
      ...new Set(
        hearted_cars.map((obj) => obj.images?.model_imgs_key).filter(Boolean)
      ),
    ];

    if (allModelImgKeys.length === 0) return;

    const fetchImages = async () => {
      try {
        const imagesMap = await getModelImageURLs(allModelImgKeys, true);
        setFavoritesImagesMap(imagesMap);
      } catch (err) {
        console.error("Failed to fetch image map", err);
      }
    };

    fetchImages();
  }, [hearted_cars]);

  let data = [...hearted_cars].map((veh) => ({
    ...veh,
    imageArray: favoritesImagesMap[veh.images.model_imgs_key] || null,
  }));

  //   console.log("data", data);

  const FavoritesGrid = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, 268px)",
    gap: "2%, 10%",
    columnGap: "1.3rem",
    rowGap: "1.3rem",
  }));

  return (
    <div className="page_container favorites_container">
      <Box className="center_box">
        <div className="middle_content">
          <h2 className="favorites_h2">Your Favorites</h2>
          <FavoritesGrid>
            {data.map((veh, index) => (
              <InventoryCard
                key={index}
                carData={veh}
                nearYou={true}
                favorites={true}
              /> //nearYou takes off last 5 imgs, causes slider to also display a custom 'ViewMoreSlide'
            ))}
          </FavoritesGrid>
        </div>
      </Box>
    </div>
  );
};

export default Favorites;
