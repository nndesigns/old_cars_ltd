import boto3
import os
import re
from datetime import datetime, timezone
datetime.now(timezone.utc).isoformat()

s3 = boto3.client('s3', region_name = 'us-east-2')
dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
table = dynamodb.Table('model_images')

BUCKET_NAME = 'imgs-all'
PREFIX = 'Car_Images/Car_Models/'

# List all "folders" under Car_Models/
response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PREFIX, Delimiter='/')
for folder in response.get('CommonPrefixes', []):
    folder_key = folder['Prefix']  # e.g. Car_Images/Car_Models/bmw isetta 1957 300 cabriolet/
    model_id_original = folder_key.split('/')[-2]  # Grab the original folder name, e.g. "bmw isetta 1957 300 cabriolet"

    # Search for the first 4-digit year starting with 19 or 20
    match = re.search(r'(19|20)\d{2}', model_id_original)

    if not match:
        print(f"No valid year found in: {model_id_original}")
        continue  # Skip if no valid year found

    # Extract the year from the folder name and remove it from the original position
    year = int(match.group())
    model_id_cleaned = re.sub(r'\b(19|20)\d{2}\b','', model_id_original).strip()
    model_id_cleaned = re.sub(r'\s{2,}', ' ', model_id_cleaned).strip()

    # Rebuild the folder name with the year at the front
    model_id = f"{model_id_cleaned}".strip()

    # List images in this folder
    objects = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder_key)
    image_files = [obj['Key'] for obj in objects.get('Contents', []) if obj['Key'].endswith('.webp')]

    # Optional breakdown for DynamoDB fields
    parts = model_id.split()
    make = parts[1].capitalize() if len(parts) > 1 else "Unknown"
    model = " ".join(parts[2:]).capitalize() if len(parts) > 2 else "Unknown"

    # Construct S3 URLs (optional)
    image_urls = [f"https://{BUCKET_NAME}.s3.amazonaws.com/{key}" for key in image_files]
    
    # Insert into DynamoDB
    table.put_item(
        Item={
            'model_id': model_id,
            'make': make,
            'model': model,
            'year': year,
            'image_count': len(image_files),
            's3_prefix': folder_key,
            'image_urls': image_urls,
            'last_updated': datetime.now(timezone.utc).isoformat()
        }
    )



