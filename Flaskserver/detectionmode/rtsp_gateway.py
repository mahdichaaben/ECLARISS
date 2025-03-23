import subprocess
import numpy as np
import threading
import io

class RTSPGateway:
    def __init__(self, rtsp_source_url, rtsp_destination_url, frame_width, frame_height, fps):
        self.rtsp_source_url = rtsp_source_url
        self.rtsp_destination_url = rtsp_destination_url
        self.frame_width = frame_width
        self.frame_height = frame_height
        self.fps = fps
        self.ffmpeg_process = None
        self.frame_buffer = None
        self.buffer_lock = threading.Lock()
        self.frame_thread = None
        self.ffmpeg_send_process = None

    def start_ffmpeg_receive(self):
        """
        Starts the FFmpeg process for receiving RTSP stream and captures the latest frame.
        """
        # Define the FFmpeg command for receiving
        ffmpeg_command = [
            'ffmpeg',
            '-i', self.rtsp_source_url,
            '-f', 'rawvideo',
            '-pix_fmt', 'bgr24',
            '-s', f'{self.frame_width}x{self.frame_height}',
            '-r', str(self.fps),
            '-'
        ]

        # Open a subprocess with FFmpeg for receiving
        self.ffmpeg_process = subprocess.Popen(
            ffmpeg_command,
            stdout=subprocess.PIPE,
            bufsize=10**8  # Adjust buffer size as needed
        )

        # Start a thread to read frames from FFmpeg
        self.frame_thread = threading.Thread(target=self.read_frames)
        self.frame_thread.start()

    def read_frames(self):
        """
        Continuously reads frames from the FFmpeg process and stores the latest frame.
        """
        frame_size = self.frame_width * self.frame_height * 3  # BGR24 format
        while self.ffmpeg_process.poll() is None:  # Check if FFmpeg is still running
            frame_data = self.ffmpeg_process.stdout.read(frame_size)
            if len(frame_data) == frame_size:
                frame = np.frombuffer(frame_data, dtype=np.uint8).reshape((self.frame_height, self.frame_width, 3))
                with self.buffer_lock:
                    self.frame_buffer = frame

    def get_latest_frame(self):
        """
        Retrieves the latest frame stored by the `read_frames` method.

        :return: The latest video frame as a numpy array.
        """
        with self.buffer_lock:
            return self.frame_buffer.copy() if self.frame_buffer is not None else None

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
        if self.ffmpeg_process:
            self.ffmpeg_process.terminate()
            self.ffmpeg_process.wait()
        if self.ffmpeg_send_process:
            self.ffmpeg_send_process.stdin.close()
            self.ffmpeg_send_process.terminate()
            self.ffmpeg_send_process.wait()
        if self.frame_thread:
            self.frame_thread.join()
