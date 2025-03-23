import cv2
import numpy as np
import datetime
from collections import defaultdict
import json
from ultralytics import YOLO

class YoloProcess:

    def __init__(self):
        self.model = YOLO("yolov8n.pt")
        self.track_history = defaultdict(lambda: [])
        self.person_status = defaultdict(lambda: {'entry_time': None, 'exit_time': None})
        self.json_data = []
        self.results = None

    def update_send(self):
        current_data = [
            {
                "id": track_id,
                "entry_time": status['entry_time'],
                "exit_time": status['exit_time']
            }
            for track_id, status in self.person_status.items()
        ]
        
        # Send data only if there is a change
        if current_data != self.json_data:
            self.json_data = current_data
            with open('person_tracking_data.json', 'w') as f:
                json.dump(self.json_data, f, indent=4)

    def add_timestamp(self, frame):
        # Get the current timestamp
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Define the position and font for the timestamp
        position = (10, 30)
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1
        color = (0, 255, 0)
        thickness = 2
        
        # Add timestamp to the frame
        cv2.putText(frame, timestamp, position, font, font_scale, color, thickness)
        
        return frame

    def process(self, frame):
        # Add timestamp to the frame
        frame_with_timestamp = self.add_timestamp(frame)
        self.results = None
        
        # Perform tracking
        self.results = self.model.track(frame_with_timestamp, persist=True)

        tracking_results = {
            "boxes": [],
            "track_ids": [],
            "class_ids": []
        }
        current_ids = set()

        if self.results and self.results[0].boxes is not None:
            boxes = self.results[0].boxes.xyxy.cpu()
            track_ids = self.results[0].boxes.id.int().cpu().tolist() if self.results[0].boxes.id is not None else []
            class_ids = self.results[0].boxes.cls.int().cpu().tolist() if self.results[0].boxes.cls is not None else []
            
            # Update tracking and status
            for box, track_id, class_id in zip(boxes, track_ids, class_ids):
                if class_id == 0:  # Assuming 0 is the class ID for 'person'
                    if track_id not in self.track_history:
                        self.track_history[track_id] = []

                    track = self.track_history[track_id]
                    track.append((float(box[0] + box[2]) / 2, float(box[1] + box[3]) / 2))
                    if len(track) > 30:
                        track.pop(0)

                    current_ids.add(track_id)

            # Check for persons who are no longer in the frame
            for track_id in list(self.person_status.keys()):
                if track_id not in current_ids:
                    if self.person_status[track_id]['exit_time'] is None:
                        self.person_status[track_id]['exit_time'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
            # Populate tracking_results
            tracking_results["boxes"] = boxes.cpu().tolist()
            tracking_results["track_ids"] = track_ids
            tracking_results["class_ids"] = class_ids

        # Update JSON file with the latest data
        self.update_send()

        json_data = {
            "tracking_results": tracking_results,
            "person_status": self.person_status,
            "track_history": {track_id: track_history for track_id, track_history in self.track_history.items()}
        }

        return json.dumps(json_data)

    def draw_on_frame(self, frame, json_data):
        try:
            data = json.loads(json_data)
        except json.JSONDecodeError:
            print("Error decoding JSON")
            return
        tracking_results = data["tracking_results"]
        person_status = data["person_status"]
        track_history = data["track_history"]

        # Copy the frame to draw on
        frame_with_drawings = frame.copy()

        boxes = tracking_results["boxes"]
        track_ids = tracking_results["track_ids"]
        class_ids = tracking_results["class_ids"]

        for box, track_id, class_id in zip(boxes, track_ids, class_ids):
            if class_id == 0:  # Assuming 0 is the class ID for 'person'
                x1, y1, x2, y2 = map(int, box)
                text = f"ID: {track_id}"
                cv2.putText(frame_with_drawings, text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 255), 1, cv2.LINE_AA)
                cv2.rectangle(frame_with_drawings, (x1, y1), (x2, y2), (255, 0, 255), 1)

                if track_id in track_history:
                    track = track_history[track_id]
                    if len(track) > 1:
                        points = np.hstack(track).astype(np.int32).reshape((-1, 1, 2))
                        cv2.polylines(frame_with_drawings, [points], isClosed=False, color=(230, 230, 230), thickness=3)

        return frame_with_drawings
