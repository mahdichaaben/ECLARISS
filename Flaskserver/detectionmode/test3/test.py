from detectionModeProcessor import DetectionModeProcessor  # Import the class

# Define the necessary parameters
user_id = "admin"
camera_id = "camera1"
rtsp_source_url = "rtsp://localhost:8554/source"  # Replace with your RTSP source URL
rtsp_destination_url = "rtsp://localhost:8554/destination"  # Replace with your RTSP destination URL

# Create an instance of DetectionModeProcessor
processor = DetectionModeProcessor(user_id, camera_id, rtsp_source_url, rtsp_destination_url)

# Start detection mode
processor.start_detection_mode()

# Run the processing loop
try:
    while True:
        processor.process()
except KeyboardInterrupt:
    print("Exiting...")
    processor.close()
