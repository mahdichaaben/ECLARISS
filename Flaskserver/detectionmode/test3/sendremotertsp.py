import cv2
import subprocess

# Set up the video capture
cap = cv2.VideoCapture(0)  # Use camera 0

# Define the FFmpeg command for RTSP streaming
ffmpeg_command = [
    'ffmpeg',
    '-y',
    '-f', 'rawvideo',
    '-vcodec', 'rawvideo',
    '-pix_fmt', 'bgr24',
    '-s', '640x480',  # Change resolution if needed
    '-r', '30',  # Frame rate
    '-i', '-',  # Input from stdin
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'veryfast',
    '-bf', '0',  # Disable B-frames
    '-f', 'rtsp',
    'rtsp://192.168.1.12:8554/source'  # RTSP server URL
]

# Open FFmpeg process as a subprocess
process = subprocess.Popen(ffmpeg_command, stdin=subprocess.PIPE)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Write the frame to the FFmpeg process
    process.stdin.write(frame.tobytes())

    # Display the frame (optional)
    # cv2.imshow('frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and close windows
cap.release()
cv2.destroyAllWindows()
process.stdin.close()
process.wait()
