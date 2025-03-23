import cv2
import subprocess

class RTSPStreamer:
    def __init__(self, rtsp_server_url, frame_width, frame_height, fps):
        self.rtsp_server_url = rtsp_server_url
        self.frame_width = frame_width
        self.frame_height = frame_height
        self.fps = fps
        self.ffmpeg_process = None

    def start_ffmpeg(self):
        """
        Starts the FFmpeg process for streaming to the RTSP server using UDP.
        """
        # Define the FFmpeg command
        ffmpeg_command = [
            'ffmpeg',
            '-re',
            '-f', 'rawvideo',
            '-pix_fmt', 'bgr24',
            '-s', f'{self.frame_width}x{self.frame_height}',
            '-r', str(self.fps),
            '-i', '-',
            '-c:v', 'libx264',  # Use H.264 encoder
            '-preset', 'ultrafast',
            '-f', 'rtsp',
            '-rtsp_transport', 'udp',  # Use UDP for RTSP transport
            self.rtsp_server_url
        ]

        # Open a subprocess with FFmpeg
        self.ffmpeg_process = subprocess.Popen(ffmpeg_command, stdin=subprocess.PIPE)

    def send_frame(self, frame):
        """
        Sends a single frame to the RTSP server using FFmpeg.

        :param frame: The video frame to send (numpy array).
        """
        if self.ffmpeg_process:
            try:
                # Write the frame to FFmpeg stdin
                self.ffmpeg_process.stdin.write(frame.tobytes())
            except Exception as e:
                print(f"Error sending frame: {e}")

    def close(self):
        """
        Cleans up resources.
        """
        if self.ffmpeg_process:
            self.ffmpeg_process.stdin.close()
            self.ffmpeg_process.wait()