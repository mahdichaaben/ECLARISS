import json
import cv2
import numpy as np
import os
from datetime import datetime
from yoloProcess import YoloProcess
import paho.mqtt.client as mqtt
import threading
from rtspstreamer import RTSPStreamer

def seconds_to_human_readable(seconds):
    """Convert seconds to a human-readable format."""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    
    if hours > 0:
        return f"{hours} hour(s) {minutes} minute(s)"
    elif minutes > 0:
        return f"{minutes} minute(s)"
    else:
        return f"{seconds} second(s)"

class DetectionModeProcessor:
    def __init__(self, user_id, camera_id, rtsp_server_url, host="127.0.0.1", port=1883, db_folder='db_detectionmode'):
        self.yoloprocessor = YoloProcess()
        self.camera_id = camera_id
        self.user_id = user_id
        self.topic_prefix = f"{user_id}/{camera_id}/detectmode"
        self.topic_recevedsignal = f"{self.topic_prefix}/on"
        self.topic_recevedframe = f"{self.topic_prefix}/receivingframe"
        self.topic_published = f"{self.topic_prefix}/publishedframe"

        self.frames = {}
        self.frame = None
        self.detection_mode = False
        self.detection_start_time = None
        self.db_folder = db_folder
        self.json_file = os.path.join(self.db_folder, f'{user_id}.json')

        # Ensure the database folder exists
        os.makedirs(self.db_folder, exist_ok=True)

        # Load user data
        self.load_user_data()

        # MQTT Client setup
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(host, port)
        self.client.loop_start()

        # Start threads for topic subscriptions
        self.thread_receiving = threading.Thread(target=self.listen_to_receiving_frame_topic)
        self.thread_receiving.start()

        self.thread_detection_mode = threading.Thread(target=self.listen_to_detection_mode_topic)
        self.thread_detection_mode.start()


        self.rtsp_streamer = RTSPStreamer(rtsp_server_url, 
                                          int(cv2.VideoCapture(0).get(cv2.CAP_PROP_FRAME_WIDTH)),
                                          int(cv2.VideoCapture(0).get(cv2.CAP_PROP_FRAME_HEIGHT)),
                                          int(cv2.VideoCapture(0).get(cv2.CAP_PROP_FPS)))
        self.rtsp_streamer.start_ffmpeg()

    def on_connect(self, client, userdata, flags, rc):
        print(f"Connected with result code {rc}")
        self.client.subscribe(self.topic_recevedsignal)
        print(f"Subscribed to topic: {self.topic_recevedsignal}")
        
        self.client.subscribe(self.topic_recevedframe)
        print(f"Subscribed to topic: {self.topic_recevedframe}")

        
    def on_message(self, client, userdata, msg):
        if msg.topic == self.topic_recevedsignal:
            self.handle_detection_mode_message(msg)
        elif msg.topic==self.topic_recevedframe:
            self.handle_receiving_frame_message(msg)

    def handle_detection_mode_message(self, msg):
        payload = msg.payload.decode('utf-8')
        if payload == 'true':
            self.start_detection_mode()
        else:
            self.stop_detection_mode()

    def handle_receiving_frame_message(self, msg):
        if self.detection_mode:
            nparr = np.frombuffer(msg.payload, np.uint8)
            self.frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    def listen_to_receiving_frame_topic(self):
        # Placeholder: MQTT client on_message will handle this topic
        pass

    def listen_to_detection_mode_topic(self):
        # Placeholder: MQTT client on_message will handle this topic
        pass

    def start_detection_mode(self):
        self.detection_mode = True
        self.detection_start_time = datetime.now()
        print(f"Detection mode activated for camera {self.camera_id}")

    def stop_detection_mode(self):
        if self.detection_mode:
            duration = datetime.now() - self.detection_start_time
            self.save_detection_duration(duration)
        self.detection_mode = False
        self.detection_start_time = None
        print(f"Detection mode deactivated for camera {self.camera_id}")

    def save_detection_duration(self, duration):
        # Load existing data
        data = self.load_user_camera_data()

        # Convert duration to seconds
        duration_seconds = int(duration.total_seconds())

        # Update duration
        camera_data = next((cam for cam in data['cameras'] if cam['cameraID'] == self.camera_id), None)
        if not camera_data:
            camera_data = {
                'cameraID': self.camera_id,
                'detection_mode': 'on' if self.detection_mode else 'off',
                'total_duration': 0,  # Total duration in seconds
                'detection_periods': [],
                'topic': f"{self.topic_prefix}/publishedframe"
            }
            data['cameras'].append(camera_data)
        
        camera_data['detection_periods'].append({
            'start_time': self.detection_start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'duration_seconds': duration_seconds
        })

        # Calculate total duration
        self.calculate_total_durations(data)

        # Save data back to file
        with open(self.json_file, 'w') as file:
            json.dump(data, file, indent=4)

    def calculate_total_durations(self, data):
        camera_data = next((cam for cam in data['cameras'] if cam['cameraID'] == self.camera_id), None)
        if camera_data:
            total_seconds = 0
            for record in camera_data['detection_periods']:
                total_seconds += record['duration_seconds']
            camera_data['total_duration'] = seconds_to_human_readable(total_seconds)

    def load_user_data(self):
        if os.path.exists(self.json_file):
            with open(self.json_file, 'r') as file:
                return json.load(file)
        else:
            return {'userID': self.user_id, 'cameras': []}

    def load_user_camera_data(self):
        data = self.load_user_data()
        return next((cam for cam in data['cameras'] if cam['cameraID'] == self.camera_id), {'cameraID': self.camera_id, 'detection_mode': 'off', 'total_duration': '0 seconds', 'detection_periods': []})

    def close(self):
        self.client.loop_stop()
        self.client.disconnect()
        cv2.destroyAllWindows()
        self.thread_receiving.join()
        self.thread_detection_mode.join()

    def process(self):
        if self.frame is not None:
            img = self.yoloprocessor.process(self.frame)
            img_str = cv2.imencode('.jpg', img)[1].tobytes()
            self.client.publish(self.topic_published, img_str)
            self.rtsp_streamer.send_frame(img)  # Send frame to RTSP server

            #cv2.imshow('recv', img)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.close()
                return

# Usage example
if __name__ == "__main__":
    user_id = "admin"
    camera_id = "camera1"
    rtsp_server_url = "rtsp://localhost:8554/mystreamdetection"

    processor = DetectionModeProcessor(user_id, camera_id, rtsp_server_url)
    processor.start_detection_mode()
    try:
        while True:
            processor.process()
    except KeyboardInterrupt:
        print("Exiting...")
        processor.close()
