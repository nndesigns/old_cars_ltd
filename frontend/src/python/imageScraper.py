import os
import requests
from bs4 import BeautifulSoup

# Define the car listing URL
car_listing_url = "https://www.classicautomall.com/vehicles/6973/1987-buick-regal-grand-national"

# Set headers to mimic a real browser request
headers = {"User-Agent": "Mozilla/5.0"}

# Send a request to the car listing page
response = requests.get(car_listing_url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Find the gallery container
gallery_container = soup.find("div", class_="cam-vehicle-gallery-row")

# Find all <a> tags with image URLs in the gallery
image_links = gallery_container.find_all("a", class_="gallery-item", href=True)

# Limit to the first 10 images
image_urls = [a["href"] for a in image_links[:10]]

# Extract car name from the URL (e.g., "1967-ford-thunderbird-landau-hardtop")
car_name = car_listing_url.rstrip("/").split("/")[-1]

# Create a folder for the car images
car_folder = os.path.join("Car_Images", car_name)
os.makedirs(car_folder, exist_ok=True)

# Download each image
for index, img_url in enumerate(image_urls):
    img_name = f"{index + 1}.jpg"  # Naming images sequentially
    img_data = requests.get(img_url, headers=headers).content

    with open(os.path.join(car_folder, img_name), "wb") as img_file:
        img_file.write(img_data)

    print(f"Downloaded: {img_name}")




print(f"All images saved in {car_folder}")



