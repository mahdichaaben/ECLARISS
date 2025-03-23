import cv2
import numpy as np
import subprocess
import threading
from yoloProcess import YoloProcess
class RTSPStreamProcessor:
    def __init__(self, rtsp_url):
        self.rtsp_url = rtsp_url
        self.frame = None
        self.yoloprocessor = YoloProcess()
        self.lock = threading.Lock()
        self.ffmpeg_process = self.start_ffmpeg()
        self.frame_thread = threading.Thread(target=self.read_frames, daemon=True)
        self.frame_thread.start()

    def start_ffmpeg(self):
        ffmpeg_command = [
            'ffmpeg',
            '-i', self.rtsp_url,
            '-f', 'rawvideo',
            '-pix_fmt', 'bgr24',
            '-vsync', '0',
            '-an',
            '-'
        ]
        return subprocess.Popen(ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=10**8)

    def read_frames(self):
        while True:
            try:
                raw_frame = self.ffmpeg_process.stdout.read(640 * 480 * 3)  # Adjust frame size as needed
                if len(raw_frame) != 640 * 480 * 3:
                    break
                with self.lock:
                    self.frame = np.frombuffer(raw_frame, dtype=np.uint8).reshape((480, 640, 3))  # Adjust dimensions as needed
            except Exception as e:
                print(f"Error reading frame: {e}")
                break

    def process_frame(self):
        with self.lock:
            if self.frame is not None:
                frame = np.array(self.frame).copy()
                self.frame = self.yoloprocessor.process(frame)

    def display_frame(self):
        with self.lock:
            if self.frame is not None:
                cv2.imshow('RTSP Stream', self.frame)

    def run(self):
        while True:
            self.process_frame()
            self.display_frame()
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        self.cleanup()

    def cleanup(self):
        self.ffmpeg_process.stdout.close()
        self.ffmpeg_process.stderr.close()
        self.ffmpeg_process.wait()
        cv2.destroyAllWindows()

# Usage
rtsp_url = 'srt://localhost:8890?streamid=read:mystream'
processor = RTSPStreamProcessor(rtsp_url)
processor.run()
