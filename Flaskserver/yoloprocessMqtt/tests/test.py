import cv2


# libcamera-vid -n -t 0 --width 640 --height 480 --inline -o - | ffmpeg -i - -c:v libx264 -f rtsp rtsp://192.168.1.12:8554/stream1


# Replace <raspberry_pi_ip> with the IP address of your Raspberry Pi
rtsp_url = 'rtsp://192.168.1.12:8554/mjpeg'

# Create a VideoCapture object with the RTSP URL
cap = cv2.VideoCapture(rtsp_url)

if not cap.isOpened():
    print("Error: Could not open video stream.")
    exit()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    if not ret:
        print("Error: Failed to grab frame.")
        break

    # Display the resulting frame
    cv2.imshow('RTSP Stream', frame)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and close windows
cap.release()
cv2.destroyAllWindows()
