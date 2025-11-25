import csv
import json

def find_incorrect_image_keys(csv_file_path, output_file_path="mismatched_entries.csv"):
    mismatches = []

    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                # Parse nested JSON from 'images'
                images_field = json.loads(row["images"])
                nested_value = images_field["model_imgs_key"]["S"].strip().lower()

                # Build expected value
                make = row["make"].strip().lower()
                model = row["model"].strip().lower()
                expected = f"{make} {model}"

                # Compare and collect mismatches
                if nested_value != expected:
                    row["expected_images_key"] = expected
                    row["actual_images_key"] = nested_value
                    mismatches.append(row)

            except Exception as e:
                row["error"] = str(e)
                mismatches.append(row)

    if mismatches:
        # Print mismatches to console
        print(f"\n⚠️ Found {len(mismatches)} mismatches:\n")
        for m in mismatches:
            print(f"ID: {m.get('id', 'N/A')}")
            print(f"Expected: {m.get('expected_images_key', '(none)')}")
            print(f"Actual:   {m.get('actual_images_key', '(none)')}")
            if 'error' in m:
                print(f"Error:    {m['error']}")
            print("-" * 60)

        # Write mismatches to new CSV
        with open(output_file_path, "w", newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=mismatches[0].keys())
            writer.writeheader()
            writer.writerows(mismatches)

        print(f"\n✅ Mismatches saved to {output_file_path}\n")
    else:
        print("✅ All entries have correct concatenated image keys!")

# Example usage
find_incorrect_image_keys("results.csv")
