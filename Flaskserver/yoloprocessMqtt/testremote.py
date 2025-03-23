import json
import cv2
import numpy as np
from datetime import datetime
from yoloProcess import YoloProcess

from mqtt_controller import MQTTController
import paho.mqtt.client as mqtt
import ssl

# Initialize MQTTController with the provided parameters
mqtt_controller = MQTTController(
    broker_url="3295446499b64d298ec2ec27690e9fdf.s1.eu.hivemq.cloud",
    broker_port=8883,
    username="camera1",
    password="Camera12",
    topic="camera/camera1/status"
)

# Main loop to print incoming messages from the MQTT topic
try:
    while True:
        message = mqtt_controller.get_msg()
        if message:
            print(f"Received message: {message}")
            mqtt_controller.msg = False  # Reset the message status after processing
except KeyboardInterrupt:
    print("Program interrupted.")
finally:
    mqtt_controller.close()
