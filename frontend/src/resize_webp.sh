# Check if input file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <image.webp>"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.*}_600.webp"

# Resize to 600px width, preserving aspect ratio
magick convert "$INPUT_FILE" -resize 600x "$OUTPUT_FILE"

echo "Resized image saved as: $OUTPUT_FILE"