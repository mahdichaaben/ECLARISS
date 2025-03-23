import cv2
import numpy as np
import json
from ultralytics import YOLO
import datetime
from collections import defaultdict
import paho.mqtt.client as mqtt
import ssl

class MQTTpubsub:
    def __init__(self, broker_address, port, client_id, username, password, topic, cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLS):
        self.is_active = True  # Generic flag to handle MQTT message logic
        self.connect_count = 0
        self.client = mqtt.Client(client_id=client_id, userdata=None, protocol=mqtt.MQTTv5)
        self.client.tls_set(cert_reqs=cert_reqs, tls_version=tls_version)
        self.client.username_pw_set(username, password)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish
        self.client.connect(broker_address, port)
        self.topic = topic
        self.client.loop_start()

    def on_message(self, client, userdata, msg):
        message = msg.payload.decode().strip().lower()
        if message == "true":
            self.is_active = True
        elif message == "false":
            self.is_active = False
        # Handle other message types here

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if self.connect_count == 0:
            print(f"Connected with result code {rc}")
        self.connect_count += 1
        client.subscribe(self.topic)

    def on_publish(self, client, userdata, mid):
        pass  # Custom handling after publishing a message can be added here

    def publish(self, topic, payload, qos=1):
        self.client.publish(topic, payload, qos=qos)

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

# Example of initializing the generalized MQTT client
mqtt_client = MQTTpubsub(
    broker_address="3295446499b64d298ec2ec27690e9fdf.s1.eu.hivemq.cloud",
    port=8883,
    client_id="genericdevice",
    username="deviceuser",
    password="devicepassword",
    topic="device_topic"
)
