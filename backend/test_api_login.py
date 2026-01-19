import requests
import json

url = 'http://localhost:8000/api/users/login/'
data = {
    'username': 'sahuaryan254@gmail.com', # Trying with email as username
    'password': '1saryan'
}

print(f"Sending POST to {url} with data: {data}")

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
