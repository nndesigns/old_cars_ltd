import csv

input_file = 'uszips.csv'       # Replace with your actual file name
output_file = 'us_zips_cleaned.csv'

with open(input_file, mode='r', newline='', encoding='utf-8') as infile, \
     open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
    
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    for row in reader:
        # Ensure the row has enough columns
        if len(row) >= 5:
            zip_code = row[0].strip()
            latitude = row[1].strip()
            longitude = row[2].strip()
            city = row[3].strip()
            state = row[4].strip()
            pop = row[8].strip()
        
            writer.writerow([zip_code, latitude, longitude, city, state, pop])