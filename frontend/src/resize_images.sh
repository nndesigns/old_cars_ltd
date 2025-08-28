#!/bin/bash

# Base folder containing your 106 subfolders
# BASE_DIR="Car_Images"

# # Loop through each subfolder in Car_Images
# for SUBFOLDER in "$BASE_DIR"/*/; do
#     echo "Processing $SUBFOLDER"

#     # Create 'large' and 'mobile' subfolders
#     mkdir -p "${SUBFOLDER}large"
#     mkdir -p "${SUBFOLDER}mobile"

#     # Move original images into 'large'
#     mv "${SUBFOLDER}"*.jpg "${SUBFOLDER}large/" 2>/dev/null
#     mv "${SUBFOLDER}"*.jpeg "${SUBFOLDER}large/" 2>/dev/null
#     mv "${SUBFOLDER}"*.png "${SUBFOLDER}large/" 2>/dev/null
#     mv "${SUBFOLDER}"*.webp "${SUBFOLDER}large/" 2>/dev/null

#     # Resize and compress images from 'large' into 'mobile'
#     magick mogrify -path "${SUBFOLDER}mobile" -resize 600x600 -quality 80 -format webp "${SUBFOLDER}large"/*.{jpg,jpeg,png,webp} 2>/dev/null
# done


# BASE_DIR="Car_Images"

# # # Loop through each subfolder in Car_Images
# for SUBFOLDER in "$BASE_DIR"/*/; do
#     echo "Processing $SUBFOLDER"

#     LARGE_DIR="${SUBFOLDER}large"
#     MOBILE_DIR="${SUBFOLDER}mobile"

#     # Check if the 'large' folder exists
#     if [ ! -d "$LARGE_DIR" ]; then
#         echo "  Skipping $SUBFOLDER: 'large' folder not found."
#         continue
#     fi

#     # Loop through all images in 'large' and convert to mobile
#     for img in "$LARGE_DIR"/*.{jpg,jpeg,png,webp}; do
#         [ -f "$img" ] || continue  # Skip if no matching files
#         filename=$(basename "${img%.*}")  # Get the filename without extension
#         magick convert "$img" -resize 600x -quality 80 "$MOBILE_DIR/${filename}.webp"
#         echo "  Converted $img -> $MOBILE_DIR/${filename}.webp"
#     done
# done


TARGET_DIR="python/Car_Images/1969-amc-javelin-sst"

# Ensure target dir exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Directory $TARGET_DIR not found."
  exit 1
fi

# Define subdirectories
LARGE_DIR="${TARGET_DIR}/large"
MOBILE_DIR="${TARGET_DIR}/mobile"

# Create subdirectories if they don’t exist
mkdir -p "$LARGE_DIR"
mkdir -p "$MOBILE_DIR"

echo "Processing directory: $TARGET_DIR"

# Move original images into 'large'
mv "$TARGET_DIR"/*.{jpg,jpeg,png,webp,avif} "$LARGE_DIR/" 2>/dev/null

# Convert images from 'large' into 'mobile'
for img in "$LARGE_DIR"/*.{jpg,jpeg,png,webp,avif}; do
  [ -f "$img" ] || continue  # skip if no files
  filename=$(basename "${img%.*}")  # strip extension
  magick convert "$img" -resize 600x -quality 80 "$MOBILE_DIR/${filename}.webp"
  echo "Converted: $img → $MOBILE_DIR/${filename}.webp"
done

echo "Done!"
