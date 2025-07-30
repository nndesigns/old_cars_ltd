import os

def rename_webp_images_in_folders(parent_directory):
    # Walk through each subdirectory
    for folder_name in os.listdir(parent_directory):
        folder_path = os.path.join(parent_directory, folder_name)

        if os.path.isdir(folder_path):
            webp_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.webp')]
            webp_files.sort()  # Optional: sort alphabetically before renaming

            for index, filename in enumerate(webp_files, start=1):
                old_path = os.path.join(folder_path, filename)
                new_filename = f"{index}.webp"
                new_path = os.path.join(folder_path, new_filename)

                # Rename the file
                os.rename(old_path, new_path)
                print(f"Renamed: {old_path} → {new_path}")

# Example usage
parent_dir = "./modelImages/"  # ← Replace with your actual path
rename_webp_images_in_folders(parent_dir)