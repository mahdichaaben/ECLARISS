import os
import io
import logging
import json
import time
import re
from datetime import datetime
from threading import Condition
import threading
import argparse
from mqttProvider import MqttProvider  
from flask import Flask, render_template, request, jsonify, Response, send_file, abort,send_from_directory
from PIL import Image
import cv2
from picamera2 import Picamera2
from picamera2.encoders import JpegEncoder, MJPEGEncoder, H264Encoder
from picamera2.outputs import FileOutput
from libcamera import Transform, controls
from cameraObject import CameraObject
from attendence import Face_Recognizer
from flask_cors import CORS, cross_origin

from features_extraction_to_csv import  FaceFeatureExtractor
from dotenv import load_dotenv
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)

broker = os.getenv('MQTT_BROKER')
port = int(os.getenv('MQTT_PORT', 8883))
username = os.getenv('MQTT_USERNAME')
password = os.getenv('MQTT_PASSWORD')
topic = os.getenv('MQTT_TOPIC')


mqtt_provider = MqttProvider(broker, port, username, password, topic)
camera = CameraObject()

# Endpoint to create a temporary file
@app.route('/files/<filename>')
def serve_file(filename):
    try:
        return send_from_directory(FILE_DIRECTORY, filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404



@app.route('/create_tmp_file', methods=['POST'])
@cross_origin()
def create_tmp_folder():
    try:
        data = request.get_json()
        name = data.get('name')
        if not name:
            return jsonify(success=False, message="Name is required"), 400
        
        tmp_folder_path= camera.create_tmp_folder(name)  # Implement this method in CameraObject
        return jsonify(success=True, tmpFolderName=tmp_folder_path)
    except Exception as e:
        logging.error(f"Error in create_tmp_file: {str(e)}")
        return jsonify(success=False, message=str(e)), 500

# Endpoint to capture photo
@app.route('/capture_face', methods=['POST'])
@cross_origin()
def capture_face():
    try:
        data = request.get_json()
        tmp_folder_name = data.get('tmpFolderName')
        if not tmp_folder_name:
            return jsonify(success=False, message="Temporary file name is required"), 400
        
        image_data = camera.capture_face(tmp_folder_name)  # Implement this method in CameraObject
        return jsonify(success=True, capturedImage=image_data)
    except Exception as e:
        logging.error(f"Error in capture_photo: {str(e)}")
        return jsonify(success=False, message=str(e)), 500
        
@app.route('/<member_name>_tmp', methods=['GET'])
@cross_origin()
def get_member_tmp_images(member_name):
    try:
        tmp_folder_path = os.path.join(f'data/tmp/{member_name}_tmp')
        if not os.path.exists(tmp_folder_path):
            return jsonify(success=False, message="Folder not found"), 404

        image_files = [f for f in os.listdir(tmp_folder_path) if os.path.isfile(os.path.join(tmp_folder_path, f))]
        image_urls = [f'/static/tmp/{member_name}/{file}' for file in image_files]

        return jsonify(success=True, images=image_urls)
    except Exception as e:
        logging.error(f"Error in get_member_tmp_images: {str(e)}")
        return jsonify(success=False, message=str(e)), 500



# Endpoint to create a face folder
@app.route('/create_face_folder', methods=['POST'])
@cross_origin()
def create_face_folder():
    try:
        data = request.get_json()
    
        camera.create_face_folder(data)  # Implement this method in CameraObject
        return jsonify(success=True, message="Folder created successfully")
    except Exception as e:
        logging.error(f"Error in create_face_folder: {str(e)}")
        return jsonify(success=False, message=str(e)), 500

@app.route('/video_feed_<live_type>')
def video_feed(live_type):
    global camera
    try:
        if camera:
            return Response(camera.send_live(live_type), mimetype='multipart/x-mixed-replace; boundary=frame')
        else:
            abort(404, description="Camera not found")
    except Exception as e:
        logging.error(f"Error in video_feed: {str(e)}")
        return jsonify(success=False, message=str(e))


@app.route('/tmp_faces_<membername>/img_face_<cn>.jpg')
def serve_image(membername, cn):
    directory = f'static/tmp/{membername}_tmp'
    filename = f'img_face_{cn}.jpg'
    
    try:
        return send_from_directory(directory, filename)
    except FileNotFoundError:
        app.logger.error(f'File not found: {directory}/{filename}')
        abort(404)
    except Exception as e:
        app.logger.error(f'Error serving file: {e}')
        abort(500)
        
        
@app.route('/tmp_faces_<membername>/images')
def list_images(membername):
    directory = f'static/tmp/{membername}_tmp'
    
    try:
        image_files = [f for f in os.listdir(directory) if f.startswith('img_face_') and f.endswith('.jpg')]
        
        if not image_files:
            app.logger.error(f'No images found in directory: {directory}')
            abort(404)
        
        image_urls = [f'/tmp_faces_{membername}/img_face_{f.split("_")[-1]}' for f in image_files]
        print(image_urls)
        
        return jsonify(image_urls)
    except FileNotFoundError:
        app.logger.error(f'Directory not found: {directory}')
        abort(404)
    except Exception as e:
        app.logger.error(f'Error listing images: {e}')
        abort(500)

@app.route('/members', methods=['GET'])
@cross_origin()
def fetch_members_data():
    try:
        members_directory = 'data/members_json'  
        all_members_data = []

        for filename in os.listdir(members_directory):
            if filename.endswith('.json'):
                filepath = os.path.join(members_directory, filename)
                with open(filepath, 'r') as json_file:
                    member_data = json.load(json_file)
                    all_members_data.append(member_data)
        print(all_members_data)
        return jsonify(success=True, membersData=all_members_data)
    
    except Exception as e:
        logging.error(f"Error in fetch_members_data: {str(e)}")
        return jsonify(success=False, message=str(e)), 500


@app.route('/train_facerecognizer', methods=['GET'])
@cross_origin()
def train_facerecognizer():
    try:
        # Initialize the FaceFeatureExtractor
        extractor = FaceFeatureExtractor()

        # Train the model by extracting features and saving them to CSV
        extractor.save_features_to_csv()

        return jsonify(success=True, message="Model trained successfully.")
    except Exception as e:
        logging.error(f"Error in train_facerecognizer: {str(e)}")
        return jsonify(success=False, message=str(e)), 500


if __name__ == "__main__":
    
    parser = argparse.ArgumentParser(description='PiCamera2 WebUI')
    parser.add_argument('--port', type=int, default=8080, help='Port number to run the web server on')
    args = parser.parse_args()
    
    # Run Flask server
    app.run(host='0.0.0.0', port=args.port)
