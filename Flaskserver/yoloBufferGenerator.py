import cv2
import numpy as np
import json
from ultralytics import YOLO
import datetime
from collections import defaultdict


class YOLOBufferGenerator:
    def __init__(self, video_path, model_path="yolov8n.pt", host="127.0.0.1", port=1883 ):
        self.model = YOLO(model_path)
        self.cap = cv2.VideoCapture(video_path)
        self.track_history = defaultdict(lambda: [])
        self.person_status = defaultdict(lambda: {'entry_time': None, 'exit_time': None})
        self.json_data = []

    def add_timestamp(self, frame):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        position = (10, 30)
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1
        color = (0, 255, 0)
        thickness = 2
        cv2.putText(frame, timestamp, position, font, font_scale, color, thickness)
        return frame

    def update_send(self):
        current_data = [
            {
                "id": track_id,
                "entry_time": status['entry_time'],
                "exit_time": status['exit_time']
            }
            for track_id, status in self.person_status.items()
        ]
        
        if current_data != self.json_data:
            self.json_data = current_data
            with open('person_tracking_data.json', 'w') as f:
                json.dump(self.json_data, f, indent=4)

    def process_frame(self):
        success, frame = self.cap.read()
        if not success:
            print("Failed to capture image")
            return None

        frame_with_timestamp = self.add_timestamp(frame)
        results = self.model.track(frame_with_timestamp, persist=True)
        
        if results and results[0].boxes is not None:
            boxes = results[0].boxes.xyxy.cpu()
            track_ids = results[0].boxes.id.int().cpu().tolist() if results[0].boxes.id is not None else []
            class_ids = results[0].boxes.cls.int().cpu().tolist() if results[0].boxes.cls is not None else []
            
            current_ids = set()

            for box, track_id, class_id in zip(boxes, track_ids, class_ids):
                if class_id == 0:  # Assuming 0 is the class ID for 'person'
                    x1, y1, x2, y2 = box
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    text = f"ID: {track_id}"
                    cv2.putText(frame_with_timestamp, text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 255), 1, cv2.LINE_AA)
                    cv2.rectangle(frame_with_timestamp, (x1, y1), (x2, y2), (255, 0, 255), 1)

                    track = self.track_history[track_id]
                    track.append((float(x1 + x2) / 2, float(y1 + y2) / 2))
                    if len(track) > 30:
                        track.pop(0)
                    points = np.hstack(track).astype(np.int32).reshape((-1, 1, 2))
                    cv2.polylines(frame_with_timestamp, [points], isClosed=False, color=(230, 230, 230), thickness=3)
                    
                    if self.person_status[track_id]['entry_time'] is None:
                        self.person_status[track_id]['entry_time'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    
                    current_ids.add(track_id)
            
            for track_id in list(self.person_status.keys()):
                if track_id not in current_ids:
                    if self.person_status[track_id]['exit_time'] is None:
                        self.person_status[track_id]['exit_time'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        self.update_send()
        return frame_with_timestamp

    def generate_buffer(self, frame):
        if frame is None or frame.size == 0:
            return None

        _, buffer = cv2.imencode('.jpg', frame)
        return buffer.tobytes()

    def send_buffer(self, frame):
        image_bytes = self.generate_buffer(frame)
        if image_bytes:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + image_bytes + b'\r\n')

    def send_live(self):
        while True:
            success, frame = self.cap.read()
            if success:
                yield from self.send_buffer(frame)
            else:
                break

    def cleanup(self):
        self.cap.release()
        cv2.destroyAllWindows()



