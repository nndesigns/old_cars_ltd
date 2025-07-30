import json
import csv


# Load JSON data
with open('king_data_NEW.json', 'r') as json_file:
    data = json.load(json_file)  # Read JSON file

# Define CSV file name
csv_file = "inventory.csv"

# Define CSV column headers
headers = [
    "year", "make", "model", "color", "price", "mpg_city", "mpg_hwy",
    "transmission", "engine", "drive_type", "prev_owners", "mileage",
    "vin", "status", "date_created",  "city", "state","style",
]

# Write CSV file
with open(csv_file, "w", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=headers)
    writer.writeheader()
    
    for row in data:
        row["style"] = ",".join(row["style"])  # Convert JSON array to CSV string
        writer.writerow(row)

print(f"CSV file '{csv_file}' created successfully!")


