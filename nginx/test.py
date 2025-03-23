import requests

# Define the base URL for your API
BASE_URL = 'http://localhost:5000'

def test_filter_by_user_id(user_id):
    print(f"Testing filter by user_id: {user_id}")
    url = f"{BASE_URL}/filter_database?user_id={user_id}"
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print("Response Data:")
    print(response.json())

def test_filter_by_camera_name(camera_name):
    print(f"Testing filter by camera_name: {camera_name}")
    url = f"{BASE_URL}/filter_database?camera_name={camera_name}"
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print("Response Data:")
    print(response.json())

def test_filter_by_date(date):
    print(f"Testing filter by date: {date}")
    url = f"{BASE_URL}/filter_database?date={date}"
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print("Response Data:")
    print(response.json())

def test_filter_by_recording_type(recording_type):
    print(f"Testing filter by recording_type: {recording_type}")
    url = f"{BASE_URL}/filter_database?recording_type={recording_type}"
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print("Response Data:")
    print(response.json())

if __name__ == "__main__":
    # Replace with actual test values
    test_filter_by_user_id("user1")
    test_filter_by_camera_name("camera")
    test_filter_by_date("17-08-24")
    test_filter_by_recording_type("recordings")
