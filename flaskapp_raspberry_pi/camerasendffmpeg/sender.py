import os, io, logging, json, time, re
from datetime import datetime
from threading import Condition
import threading
import argparse

from flask import Flask, render_template, request, jsonify, Response, send_file, abort
import threading
import paho.mqtt.client as mqtt

from PIL import Image
import cv2
from picamera2 import Picamera2
from picamera2.encoders import JpegEncoder
from picamera2.encoders import MJPEGEncoder
from picamera2.encoders import H264Encoder
from picamera2.outputs import FileOutput
from libcamera import Transform, controls

class CameraObject:
    def __init__(self, resolution=(640, 480),host="ipaddress", port=1883 ):
        self.fallback_image_path = "nocam.jpg"
        self.isOpencamera2 = True  # This will be controlled by MQTT
        self.camera = Picamera2()
        self.client = mqtt.Client()  # create new instance
        self.client.connect(host, port)
        self.topic="camera"
        self.resolution = resolution
        self.setup_camera()
        self.cuurent_frame=None# Assuming you have a FaceRegister class
        self.streaming_thread= threading.Thread(target=self.send_live)
        self.streaming_thread.start()


    def load_fallback_image(self):
        # Load the fallback image
        fallback_image = cv2.imread(self.fallback_image_path)
        if fallback_image is None:
            raise FileNotFoundError(f"Fallback image '{self.fallback_image_path}' not found.")
        return fallback_image

    def setup_camera(self):
        # Configure camera settings
        self.camera.preview_configuration.main.size = self.resolution
        self.camera.preview_configuration.main.format = "RGB888"
        self.camera.start()

    def capture_frame(self):
        try:
            frame = self.camera.capture_array()
            frame = cv2.resize(frame, self.resolution)
            self.cuurent_frame=frame
            return frame
        except Exception as e:
            print(f"Error capturing frame: {e}")
            return None



    def process_frame_type(self, frame_type):
        frame = self.capture_frame()
        return frame
        
 
            

    def send_live(self, frame_type="normal"):
        while True:
            
            frame = self.process_frame_type(frame_type)            
            if frame is None:
                # Use the fallback image if frame capture fails
                frame = self.load_fallback_image()
            img_str = cv2.imencode('.jpg', frame)[1].tobytes()
            self.client.publish(self.topic, img_str)
            
            # Send the buffer for the current frame
if __name__=="__main__":
	camera = CameraObject()
	camera.send_live()

            
            
