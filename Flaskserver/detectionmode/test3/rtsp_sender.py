import subprocess

class RTSPSender:
    def __init__(self, rtsp_destination_url, frame_width, frame_height, fps):
        self.rtsp_destination_url = rtsp_destination_url
        self.frame_width = frame_width
        self.frame_height = frame_height
        self.fps = fps
        self.ffmpeg_send_process = None

    def start_ffmpeg_send(self):
        """
        Starts the FFmpeg process for sending frames to the RTSP destination.
        """
        # Define the FFmpeg command for sending
        ffmpeg_command = [
            'ffmpeg',
            '-f', 'rawvideo',
            '-pix_fmt', 'bgr24',
            '-s', f'{self.frame_width}x{self.frame_height}',
            '-r', str(self.fps),
            '-i', '-',  # Input from stdin
            '-c:v', 'libx264',  # Use H.264 encoder
            '-preset', 'ultrafast',
            '-f', 'rtsp',
            self.rtsp_destination_url
        ]


        ffmpeg_command = [
        'ffmpeg',
        '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-pix_fmt', 'bgr24',
        '-s', '640x480',  # Change resolution if needed
        '-r', '15',  # Frame rate
        '-i', '-',  # Input from stdin
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'veryfast',
        '-bf', '0',  # Disable B-frames
        '-f', 'rtsp',
        self.rtsp_destination_url
        ]

        # Open a subprocess with FFmpeg for sending
        self.ffmpeg_send_process = subprocess.Popen(
            ffmpeg_command,
            stdin=subprocess.PIPE
        )

    def send_frame(self, frame):
        """
        Sends a frame to the RTSP server.

        :param frame: The video frame to send (numpy array).
        """
        if self.ffmpeg_send_process:
            try:
                # Write the frame to FFmpeg stdin
                self.ffmpeg_send_process.stdin.write(frame.tobytes())
            except Exception as e:
                print(f"Error sending frame: {e}")

    def close(self):
        """
        Cleans up resources.
        """
        if self.ffmpeg_send_process:
            self.ffmpeg_send_process.stdin.close()
            self.ffmpeg_send_process.terminate()
            self.ffmpeg_send_process.wait()
