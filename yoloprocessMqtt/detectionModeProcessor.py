import os
import cv2
import numpy as np
import paho.mqtt.client as mqtt
import json
from yoloProcess import YoloProcess
from mqtt_controller import MQTTController
from time import sleep

class DetectionModeProcessor:
    def __init__(self, user_id, camera_id, host="127.0.0.1", port=1883, json_file='users_cameras.json'):
        self.yoloprocessor = YoloProcess()
        self.topic_prefix = f"camera/{camera_id}"
        self.frame = None
        self.detection_mode = True # Default to detection mode being off
        self.json_file = json_file

        self.load_user_data()

        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(host, port)
        self.client.loop_start()

    def load_user_data(self):
        try:
            with open(self.json_file, 'r') as file:
                self.user_data = json.load(file)
        except FileNotFoundError:
            print("JSON file not found. Creating a new one.")
            self.user_data = []
        except json.JSONDecodeError:
            print("Error decoding JSON file. Creating a new one.")
            self.user_data = []

    def save_user_data(self):
        with open(self.json_file, 'w') as file:
            json.dump(self.user_data, file, indent=4)

    def on_connect(self, client, userdata, flags, rc):
        print(f"Connected with result code {rc}")
        self.client.subscribe(f"{self.topic_prefix}/on")
        self.client.subscribe(f"{self.topic_prefix}/simpleframe")
        print(f"Subscribed to topics: {self.topic_prefix}/on and {self.topic_prefix}/simpleframe")

    def on_message(self, client, userdata, msg):
        topic = msg.topic
        if topic == f"{self.topic_prefix}/on":
            if msg.payload.decode('utf-8').lower() == 'true':
                self.start_detection_mode()
            else:
                self.stop_detection_mode()
        elif topic == f"{self.topic_prefix}/simpleframe":
            nparr = np.frombuffer(msg.payload, np.uint8)
            self.frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    def start_detection_mode(self):
        self.detection_mode = True
        print("Detection mode activated")

    def stop_detection_mode(self):
        self.detection_mode = False
        print("Detection mode deactivated")

    def process_frame(self):
        if self.detection_mode and self.frame is not None:
            processed_img = self.yoloprocessor.process(self.frame)
            img_str = cv2.imencode('.jpg', processed_img)[1].tobytes()
            self.client.publish(f"{self.topic_prefix}/detectionframe", img_str)

    def close(self):
        self.client.loop_stop()
        self.client.disconnect()
        cv2.destroyAllWindows()

# Usage example
if __name__ == "__main__":
    # Get the values from the environment variables
    broker_url = os.getenv("BROKER_URL")
    broker_port = int(os.getenv("BROKER_PORT", 8883))  # Default to 8883 if not set
    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")
    topic = os.getenv("TOPIC")

    # Initialize MQTTController with values from .env
    mqtt_controller = MQTTController(
        broker_url=broker_url,
        broker_port=broker_port,
        username=username,
        password=password,
        topic=topic
    )

while True:
    status = mqtt_controller.get_msg()   
    print(status)     
    if status:  # Assuming you process the frame when 'status' is True or a certain value
        processor.process_frame()
    else:
        sleep(1)
