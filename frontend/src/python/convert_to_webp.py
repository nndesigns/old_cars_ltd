import os

base_dir = "./Car_Images"

# Walk through all folders and files
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.lower().endswith(".jpg"):
            jpg_path = os.path.join(root, file)
            try:
                os.remove(jpg_path)
                print(f"🗑️ Deleted: {jpg_path}")
            except Exception as e:
                print(f"❌ Failed to delete {jpg_path}: {e}")

print("✅ JPG cleanup complete!")
