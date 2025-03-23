import cv2
import subprocess

# Define the RTSP server URL
# rtsp_server_url = "rtsp://localhost:8554/mystream"
srt_server_url = "srt://localhost:8890?streamid=publish:mystream"

# Initialize VideoCapture to read from the camera (you can also use a video file by passing its path)
cap = cv2.VideoCapture(0)  # Use '0' for the default camera

# Define the FFmpeg command to send frames to the RTSP server
ffmpeg_command = [
    'ffmpeg',
    '-re',
    '-f', 'rawvideo',
    '-pix_fmt', 'bgr24',
    '-s', f'{int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))}x{int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))}',
    '-r', str(int(cap.get(cv2.CAP_PROP_FPS))),
    '-i', '-',
    '-c:v', 'libx264',  # Use H.265 (HEVC) encoder
    '-preset', 'ultrafast',
    '-f', 'mpegts',  # Output format for SRT
    srt_server_url
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
