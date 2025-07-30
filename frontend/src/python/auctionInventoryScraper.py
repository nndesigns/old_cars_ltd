import requests

url = "https://www.classicautomall.com/vehicles"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
}

response = requests.get(url, headers=headers)

# Print the first 500 characters to inspect response content
print(response.text[:500]) 