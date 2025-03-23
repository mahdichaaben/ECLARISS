import cv2
import numpy as np
from yoloProcess import YoloProcess

# RTSP URL
rtsp_url = 'srt://localhost:8890?streamid=read:mystream'

# Create a VideoCapture object
video_capture = cv2.VideoCapture(rtsp_url)

if not video_capture.isOpened():
    print("Error: Unable to open video stream.")
    exit()

yoloprocessor = YoloProcess()

while True:
    # Read frame from the video stream
    ret, frame = video_capture.read()
    
    if not ret:
        print("Error: Unable to read frame from video stream.")
        break

    # Optionally process the frame with YOLO or other processing
    frame = yoloprocessor.process(frame)

    # Display the frame
    cv2.imshow('RTSP Stream', frame)

    # Exit on keypress
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
video_capture.release()
cv2.destroyAllWindows()
