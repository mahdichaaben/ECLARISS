import os, io, logging, json, time, re
from datetime import datetime
from threading import Condition
import threading
import argparse

from mqttProvider import MqttProvider  
from flask import Flask, render_template, request, jsonify, Response, send_file, abort

from PIL import Image
import cv2
from picamera2 import Picamera2
from picamera2.encoders import JpegEncoder
from picamera2.encoders import MJPEGEncoder
from picamera2.encoders import H264Encoder
from picamera2.outputs import FileOutput
from libcamera import Transform, controls

from attendance_mqtt import Face_Recognizer
from face_register import Face_Register
class CameraObject:
    def __init__(self, resolution=(640, 480)):
        self.fallback_image_path = "nocam.jpg"
        self.isOpencamera2 = True  # This will be controlled by MQTT
        self.camera = Picamera2()
        self.resolution = resolution
        self.setup_camera()
        self.facerecognizer = Face_Recognizer()
        self.faceregister = Face_Register()
        self.cuurent_frame=None# Assuming you have a FaceRegister class

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

    def generate_buffer(self, frame):
        if frame is None or frame.size == 0:
            return None

        # Encode the frame as JPEG
        _, buffer = cv2.imencode('.jpg', frame)

        # Convert the buffer to bytes
        image_bytes = buffer.tobytes()
        return image_bytes

    def send_buffer(self, frame):
        image_bytes = self.generate_buffer(frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + image_bytes + b'\r\n')

    def process_frame_type(self, frame_type):
        frame = self.capture_frame()
        if frame_type == "face_register":
            frame = self.faceregister.process(frame)
        elif frame_type == "face_recognition":
            frame = self.facerecognizer.process(frame)
        return frame
        
    
    def collect_photo():
        if self.cuurent_frame :
            photoface=self.faceregister.save_current_face(self.cuurent_frame)
            return send_buffer(photoface)
            
            
    def create_face_folder(self,data):
        self.faceregister.create_face_folder(data)
        
    def capture_face(self,tmp_folder_name):
        return self.faceregister.capture_face(tmp_folder_name)
    def create_tmp_folder(self,name):
        return self.faceregister.create_tmp_folder(name)
        
            
            

    def send_live(self, frame_type="normal"):
        while True:
            
            
        
            frame = self.process_frame_type(frame_type)
            if frame is None:
                # Use the fallback image if frame capture fails
                frame = self.load_fallback_image()
            
            # Send the buffer for the current frame
            yield from self.send_buffer(frame)
            
