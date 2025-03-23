import cv2
import numpy as np
from tests.yoloProcess import YoloProcess

class StreamReceiverPublisher:

    def __init__(self):
        self.yoloprocessor = YoloProcess()
        self.cn = 0
        self.frame = None

    def process(self):
        if self.frame is not None:
            if self.cn % 10 == 0:
                self.cn = 0
                img = self.yoloprocessor.process(self.frame)
            else:
                img = self.yoloprocessor.processOptimizer(self.frame)

            # Display the processed image
            cv2.imshow('Processed Image', img)

            # Exit condition
            if cv2.waitKey(1) & 0xFF == ord('q'):
                cv2.destroyAllWindows()
                return

    def set_frame(self, frame):
        self.frame = frame

if __name__ == "__main__":
    receiver = StreamReceiverPublisher()
    rtsp_url="rtsp://192.168.1.12:8554/mystream"
    cap = cv2.VideoCapture(rtsp_url)  # Open default camera

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            receiver.set_frame(frame)
            receiver.process()
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        cap.release()
        cv2.destroyAllWindows()
