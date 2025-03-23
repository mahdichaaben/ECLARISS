import cv2
import numpy as np
from tests.yoloProcess import YoloProcess

# Initialize YOLO processor
yoloprocessor = YoloProcess()
rtsp_url = 'rtsp://192.168.1.12:8554/mystream'
cap = cv2.VideoCapture(rtsp_url)

# Counter for processing frequency
cn = 0

def process(frame):
    global cn
    if frame is not None:
        if cn % 1000 == 0:
            cn = 0
            img = yoloprocessor.process(frame)
        else:
            cn += 1
            img = yoloprocessor.processOptimizer(frame)

        # Display the processed image
        cv2.imshow('Processed Image', img)

while True:
    # Read a frame from the RTSP stream
    ret, frame = cap.read()
    
    if not ret:
        print("Failed to grab frame or end of stream.")
        break  # Break if there's no more frame or failed to read

    # Process the frame
    process(frame)

    # Display the original RTSP stream
    cv2.imshow('RTSP Stream', frame)

    # Exit condition
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
