


#  MAP ALL OF Car_Models TO MODEL_IMAGES (DYNAMO)
# import boto3
# import os
# import re
# from datetime import datetime, timezone

# # AWS clients
# s3 = boto3.client('s3', region_name='us-east-2')
# dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
# table = dynamodb.Table('model_images')

# BUCKET_NAME = 'imgs-all'
# PREFIX = 'Car_Images/Car_Models/'

# # List all "folders" under Car_Models/
# response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PREFIX, Delimiter='/')
# for folder in response.get('CommonPrefixes', []):
#     folder_key = folder['Prefix']  # e.g. Car_Images/Car_Models/bmw isetta 1957 300 cabriolet/
#     model_id_original = folder_key.split('/')[-2]

#     # Search for the first 4-digit year
#     match = re.search(r'(19|20)\d{2}', model_id_original)
#     if match:
#         year = int(match.group())
#     else:
#         year = None
#         print(f"No valid year found in: {model_id_original}, setting year=None")

#     # Clean model_id (remove year from string)
#     model_id_cleaned = re.sub(r'\b(19|20)\d{2}\b', '', model_id_original).strip()
#     model_id_cleaned = re.sub(r'\s{2,}', ' ', model_id_cleaned).strip()
#     model_id = model_id_cleaned

#     # --- Collect image files from large/ and mobile/ ---
#     image_files_large = []
#     image_files_mobile = []

#     for subdir in ["large/", "mobile/"]:
#         subdir_key = folder_key + subdir
#         objects = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=subdir_key)

#         if objects.get('Contents'):
#             if subdir == "large/":
#                 image_files_large = [
#                     obj['Key'] for obj in objects['Contents'] if obj['Key'].endswith('.webp')
#                 ]
#             elif subdir == "mobile/":
#                 image_files_mobile = [
#                     obj['Key'] for obj in objects['Contents'] if obj['Key'].endswith('.webp')
#                 ]

#     # Optional breakdown for DynamoDB fields
#     parts = model_id.split()
#     make = parts[1].capitalize() if len(parts) > 1 else "Unknown"
#     model = " ".join(parts[2:]).capitalize() if len(parts) > 2 else "Unknown"

#     # Construct S3 URLs
#     image_urls_large = [f"https://{BUCKET_NAME}.s3.amazonaws.com/{key}" for key in image_files_large]
#     image_urls_mobile = [f"https://{BUCKET_NAME}.s3.amazonaws.com/{key}" for key in image_files_mobile]

#     # Insert into DynamoDB
#     table.put_item(
#         Item={
#             'model_id': model_id,
#             'make': make,
#             'model': model,
#             'year': year,
#             'image_count_large': len(image_files_large),
#             'image_count_mobile': len(image_files_mobile),
#             's3_prefix': folder_key,
#             'image_urls_large': image_urls_large,
#             'image_urls_mobile': image_urls_mobile,
#             'last_updated': datetime.now(timezone.utc).isoformat()
#         }
#     )


#  MAP A SINGLE CAR MODEL FOLDER TO 'MODEL_IMAGES' (DYNAMO)
# import boto3
# import re
# from datetime import datetime, timezone

# # AWS clients
# s3 = boto3.client('s3', region_name='us-east-2')
# dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
# table = dynamodb.Table('model_images')

# BUCKET_NAME = 'imgs-all'
# SPECIFIC_FOLDER = 'Car_Images/Car_Models/amc javelin/'

# # Extract folder name
# model_id_original = SPECIFIC_FOLDER.split('/')[-2]

# # Search for the first 4-digit year (optional)
# match = re.search(r'(19|20)\d{2}', model_id_original)
# if match:
#     year = int(match.group())
# else:
#     year = None
#     print(f"No valid year found in: {model_id_original}, setting year=None")

# # Clean model_id (remove year if present)
# model_id_cleaned = re.sub(r'\b(19|20)\d{2}\b', '', model_id_original).strip()
# model_id_cleaned = re.sub(r'\s{2,}', ' ', model_id_cleaned).strip()
# model_id = model_id_cleaned

# # --- Collect image files from large/ and mobile/ ---
# image_files_large = []
# image_files_mobile = []

# for subdir in ["large/", "mobile/"]:
#     subdir_key = SPECIFIC_FOLDER + subdir
#     objects = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=subdir_key)

#     if objects.get('Contents'):
#         if subdir == "large/":
#             image_files_large = [
#                 obj['Key'] for obj in objects['Contents'] if obj['Key'].endswith('.webp')
#             ]
#         elif subdir == "mobile/":
#             image_files_mobile = [
#                 obj['Key'] for obj in objects['Contents'] if obj['Key'].endswith('.webp')
#             ]

# # Optional breakdown for DynamoDB fields
# parts = model_id.split()
# make = parts[1].capitalize() if len(parts) > 1 else "Unknown"
# model = " ".join(parts[2:]).capitalize() if len(parts) > 2 else "Unknown"

# # Construct S3 URLs
# image_urls_large = [f"https://{BUCKET_NAME}.s3.amazonaws.com/{key}" for key in image_files_large]
# image_urls_mobile = [f"https://{BUCKET_NAME}.s3.amazonaws.com/{key}" for key in image_files_mobile]

# # Insert into DynamoDB (this will ADD the item; existing items remain untouched)
# table.put_item(
#     Item={
#         'model_id': model_id,
#         'make': make,
#         'model': model,
#         'year': year,
#         'image_count_large': len(image_files_large),
#         'image_count_mobile': len(image_files_mobile),
#         's3_prefix': SPECIFIC_FOLDER,
#         'image_urls_large': image_urls_large,
#         'image_urls_mobile': image_urls_mobile,
#         'last_updated': datetime.now(timezone.utc).isoformat()
#     }
# )

# print(f"Added '{model_id}' to DynamoDB.")


