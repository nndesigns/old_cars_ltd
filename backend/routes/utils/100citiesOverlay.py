import csv
import random

# 100 unique "City, ST" strings
city_state_list = [
  # Major Metros (60 — heavily Eastern/Southeastern)
  "New Orleans, LA",
  "Los Angeles, CA",
  "Miami, FL",
  "Phoenix, AZ",
  "Charlotte, NC",
  "Seattle, WA",
  "Chicago, IL",
  "Tampa, FL",
  "Denver, CO",
  "Austin, TX",
  "Atlanta, GA",
  "Houston, TX",
  "Louisville, KY",
  "Nashville, TN",
  "Portland, OR",
  "Richmond, VA",
  "San Diego, CA",
  "Savannah, GA",
  "Dallas, TX",
  "Indianapolis, IN",
  "New York, NY",
  "Birmingham, AL",
  "Bozeman, MT",
  "Boston, MA",
  "San Francisco, CA",
  "Memphis, TN",
  "Raleigh, NC",
  "Columbia, SC",
  "Charleston, SC",
  "Norfolk, VA",
  "Greenville, SC",
  "Knoxville, TN",
  "Chattanooga, TN",
  "Jackson, MS",
  "Montgomery, AL",
  "Macon, GA",
  "Tallahassee, FL",
  "Wilmington, NC",
  "Augusta, GA",
  "Fayetteville, NC",
  "Roanoke, VA",
  "Scranton, PA",
  "Harrisburg, PA",
  "Albany, NY",
  "Syracuse, NY",
  "Newark, NJ",
  "Philadelphia, PA",
  "Pittsburgh, PA",
  "Cleveland, OH",
  "Buffalo, NY",
  "Greensboro, NC",
  "Asheville, NC",
  "Huntsville, AL",
  "Little Rock, AR",
  "Mobile, AL",
  "Pensacola, FL",
  "Lexington, KY",
  "Toledo, OH",
  "Columbus, GA",
  "Florence, SC",

  # Nearby Smaller Cities (40 — mostly East/Southeast)
  "Metairie, LA",       # near New Orleans
  "Kenner, LA",         # near New Orleans
  "Germantown, TN",     # near Memphis
  "Southaven, MS",      # near Memphis
  "Decatur, GA",        # near Atlanta
  "Marietta, GA",       # near Atlanta
  "Hoover, AL",         # near Birmingham
  "Vestavia Hills, AL", # near Birmingham
  "Cary, NC",           # near Raleigh
  "Durham, NC",         # near Raleigh
  "Mount Pleasant, SC", # near Charleston
  "Summerville, SC",    # near Charleston
  "Goose Creek, SC",    # near Charleston
  "Ocoee, FL",          # near Orlando/Tampa
  "Dothan, AL",         # near Montgomery
  "Opelika, AL",        # near Auburn/Montgomery
  "Hattiesburg, MS",    # near Jackson
  "Brentwood, TN",      # near Nashville
  "Smyrna, TN",         # near Nashville
  "Franklin, TN",       # near Nashville
  "North Charleston, SC",
  "Florence, AL",       # near Huntsville
  "Peachtree City, GA", # near Atlanta
  "Roswell, GA",        # near Atlanta
  "Alpharetta, GA",     # near Atlanta
  "Haines City, FL",    # near Tampa/Orlando
  "Clayton, NC",        # near Raleigh
  "Statesboro, GA",     # near Savannah
  "Goldsboro, NC",      # near Fayetteville
  "Martinsburg, WV",    # near Hagerstown, MD
  "New Bern, NC",       # near Wilmington
  "Madison, AL",        # near Huntsville
  "Bessemer, AL",       # near Birmingham
  "Burlington, NC",     # near Greensboro
  "Concord, NC",        # near Charlotte
  "Gastonia, NC",       # near Charlotte
  "Hanover, PA",        # near York
  "Mechanicsburg, PA",  # near Harrisburg
  "Watertown, NY",      # near Syracuse
  "Bayonne, NJ"         # near Newark
]


import csv
import random

# Parse city/state into tuples
locations = [(loc.split(', ')[0], loc.split(', ')[1]) for loc in city_state_list]

# Load inventory records
with open("inv_curr.csv", "r", newline='', encoding="utf-8") as infile:
    reader = list(csv.DictReader(infile, delimiter=';'))

# Shuffle inventory to avoid bias
random.shuffle(reader)

# Create a pool that distributes locations roughly evenly (7–8 times each)
location_pool = []
for loc in locations:
    location_pool.extend([loc] * (740 // len(locations)))
while len(location_pool) < len(reader):
    location_pool.append(random.choice(locations))
random.shuffle(location_pool)

# Assign new city/state values
for i, record in enumerate(reader):
    record["city"], record["state"] = location_pool[i]

# ✅ Sort records by 'id' as an integer
reader.sort(key=lambda x: int(x["id"]))

# Write to new CSV with correct formatting
with open("inventory_modified.csv", "w", newline='', encoding="utf-8") as outfile:
    writer = csv.DictWriter(
        outfile,
        fieldnames=reader[0].keys(),
        delimiter=';',
        quotechar='"',
        quoting=csv.QUOTE_ALL
    )
    writer.writeheader()
    writer.writerows(reader)

