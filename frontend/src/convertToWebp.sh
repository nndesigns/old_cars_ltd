#!/bin/bash

# for file in *.{jpg,jpeg,png,avif}; do
#   [ -e "$file" ] || continue   # skip if no match
#   base="${file%.*}"
#   magick "$file" "$base.webp"
#   echo "Converted: $file → $base.webp"
# done

# for file in *.{jpg,jpeg,png,avif}; do
#   [ -e "$file" ] || continue   # skip if no match
#   base="${file%.*}"
#   magick "$file" "$base.webp" && rm "$file"
#   echo "Converted and replaced: $file → $base.webp"
# done


# if [ $# -gt 0 ]; then
#   # Process only the file passed as an argument
#   for file in "$@"; do
#     [ -f "$file" ] || continue
#     base="${file%.*}"
#     magick "$file" "$base.webp" && rm "$file"
#     echo "Converted and replaced: $file → $base.webp"
#   done
# else
#   # Default: process all matching files in current directory
#   for file in *.{jpg,jpeg,png,avif}; do
#     [ -e "$file" ] || continue
#     base="${file%.*}"
#     magick "$file" "$base.webp" && rm "$file"
#     echo "Converted and replaced: $file → $base.webp"
#   done
# fi



#!/bin/bash

# for file in *; do
#   [ -f "$file" ] || continue   # skip directories
#   base="${file%.*}"
#   ext="${file##*.}"

#   # Get the real format of the file using ImageMagick
#   real_format=$(identify -format "%m" "$file" 2>/dev/null)

#   # If it's already a proper WEBP, skip it
#   if [ "$real_format" = "WEBP" ]; then
#     echo "Skipping (already valid WebP): $file"
#     continue
#   fi

#   # If extension says webp but format isn't webp → fix in place
#   if [ "$ext" = "webp" ] && [ "$real_format" != "WEBP" ]; then
#     magick "$file" "$file.tmp.webp" && mv "$file.tmp.webp" "$file"
#     echo "Fixed fake WebP → real WebP: $file"
#     continue
#   fi

#   # If it's a jpg/jpeg/png → convert to .webp
#   if [[ "$ext" =~ ^(jpg|jpeg|png)$ ]]; then
#     magick "$file" "$base.webp"
#     echo "Converted: $file → $base.webp"
#   fi
# done

#!/bin/bash

for file in *; do
  [ -f "$file" ] || continue   # skip directories
  base="${file%.*}"
  ext="${file##*.}"

  # Get the real format of the file using ImageMagick
  real_format=$(identify -format "%m" "$file" 2>/dev/null)

  # If it's already a proper WEBP, skip it
  if [ "$real_format" = "WEBP" ]; then
    echo "Skipping (already valid WebP): $file"
    continue
  fi

  # If extension says webp but format isn't webp → fix in place
  if [ "$ext" = "webp" ] && [ "$real_format" != "WEBP" ]; then
    magick "$file" -resize 600x "$file.tmp.webp" && mv "$file.tmp.webp" "$file"
    echo "Fixed fake WebP → resized real WebP: $file"
    continue
  fi

  # If it's a jpg/jpeg/png → convert & resize to .webp, then replace
  if [[ "$ext" =~ ^(jpg|jpeg|png)$ ]]; then
    magick "$file" -resize 600x "$base.webp" && rm "$file"
    echo "Converted and replaced: $file → $base.webp"
  fi
done
