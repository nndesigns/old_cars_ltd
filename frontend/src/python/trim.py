import os
from PIL import Image
import shutil

def process_images(folder_path, small_size=(200, 200)):
    large_folder = os.path.join(folder_path, 'large')
    small_folder = os.path.join(folder_path, 'small')

    os.makedirs(large_folder, exist_ok=True)
    os.makedirs(small_folder, exist_ok=True)

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        # Skip directories
        if not os.path.isfile(file_path):
            continue

        try:
            with Image.open(file_path) as img:
                # Move original to 'large'
                large_path = os.path.join(large_folder, filename)
                shutil.move(file_path, large_path)

                # Resize and save to 'small'
                img.thumbnail(small_size)
                small_path = os.path.join(small_folder, filename)
                img.save(small_path)

                print(f"Processed: {filename}")
        except Exception as e:
            print(f"Skipping file {filename}: {e}")

# Example usage
folder_path = './Car_Images/bmw isetta 1957 300 cabriolet'  # Change this to your folder
process_images(folder_path)
