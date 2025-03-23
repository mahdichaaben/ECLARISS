import cv2
import subprocess

# Define the RTSP server URL
rtsp_server_url = "rtsp://localhost:8554/mystream"

# Initialize VideoCapture to read from the camera (you can also use a video file by passing its path)
cap = cv2.VideoCapture(0)  # Use '0' for the default camera

# Define the FFmpeg command to send frames to the RTSP server
ffmpeg_command = [
    'ffmpeg',
    '-re',  # Read input at the native frame rate
    '-f', 'rawvideo',  # Input format
    '-pix_fmt', 'bgr24',  # Pixel format (BGR is used by OpenCV)
    '-s', f'{int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))}x{int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))}',  # Frame size
    '-r', str(int(cap.get(cv2.CAP_PROP_FPS))),  # Frame rate
    '-i', '-',  # Read input from stdin (pipe)
    '-c:v', 'libx264',  # Encode video as H.264
    '-preset', 'ultrafast',  # Encoding speed preset
    '-f', 'rtsp',  # Output format
    rtsp_server_url  # Output to the RTSP server
]

# Open a subprocess with FFmpeg
ffmpeg_process = subprocess.Popen(ffmpeg_command, stdin=subprocess.PIPE)

try:
    while cap.isOpened():
        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        # Write the frame to FFmpeg stdin
        ffmpeg_process.stdin.write(frame.tobytes())

        # Optionally, show the frame in a window
        cv2.imshow('Frame', frame)

        # Press 'q' to quit the loop
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    # Release the VideoCapture and close windows
    cap.release()
    cv2.destroyAllWindows()
    ffmpeg_process.stdin.close()
    ffmpeg_process.wait()
