import dlib
import numpy as np
import cv2
import os
import pandas as pd
import time
import logging
from datetime import datetime
import paho.mqtt.client as mqtt
import json
from picamera2 import Picamera2


from mqttProvider import MqttProvider 

# Initialize the face detector, predictor, and face recognition model
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('static/data_dlib/shape_predictor_68_face_landmarks.dat')
face_reco_model = dlib.face_recognition_model_v1("static/data_dlib/dlib_face_recognition_resnet_model_v1.dat")

class Face_Recognizer:
    def __init__(self):
        self.font = cv2.FONT_ITALIC
        self.frame_time = 0
        self.frame_start_time = 0
        self.fps = 0
        self.fps_show = 0
        self.start_time = time.time()
        self.frame_cnt = 0
        self.face_features_known_list = []
        self.face_name_known_list = []
        self.last_frame_face_centroid_list = []
        self.current_frame_face_centroid_list = []
        self.last_frame_face_name_list = []
        self.current_frame_face_name_list = []
        self.last_frame_face_cnt = 0
        self.current_frame_face_cnt = 0
        self.current_frame_face_X_e_distance_list = []
        self.current_frame_face_position_list = []
        self.current_frame_face_feature_list = []
        self.last_current_frame_centroid_e_distance = 0
        self.reclassify_interval_cnt = 0
        self.reclassify_interval = 10
        self.json_frame_counter = 0

        # Initialize detected names list
        self.detected_names = []
        self.attendance_data = {}

        # Load face database
        self.isOk = self.get_face_database()



    def get_face_database(self):
        if os.path.exists("data/features_all.csv"):
            path_features_known_csv = "data/features_all.csv"
            csv_rd = pd.read_csv(path_features_known_csv, header=None)
            for i in range(csv_rd.shape[0]):
                features_someone_arr = []
                self.face_name_known_list.append(csv_rd.iloc[i][0])
                for j in range(1, 129):
                    features_someone_arr.append(csv_rd.iloc[i][j] if csv_rd.iloc[i][j] != '' else '0')
                self.face_features_known_list.append(features_someone_arr)
            logging.info("Faces in Database: %d", len(self.face_features_known_list))
            return True
        else:
            logging.warning("'features_all.csv' not found!")
            logging.warning("Please run 'get_faces_from_camera.py' and 'features_extraction_to_csv.py' before 'face_reco_from_camera.py'")
            return False

    def update_fps(self):
        now = time.time()
        if int(self.start_time) != int(now):
            self.fps_show = self.fps
        self.start_time = now
        self.frame_time = now - self.frame_start_time
        self.fps = 1.0 / self.frame_time
        self.frame_start_time = now

    def return_euclidean_distance(self, feature_1, feature_2):
        feature_1 = np.array(feature_1)
        feature_2 = np.array(feature_2)
        return np.sqrt(np.sum(np.square(feature_1 - feature_2)))

    def centroid_tracker(self):
        for i in range(len(self.current_frame_face_centroid_list)):
            e_distance_current_frame_person_x_list = []
            for j in range(len(self.last_frame_face_centroid_list)):
                self.last_current_frame_centroid_e_distance = self.return_euclidean_distance(
                    self.current_frame_face_centroid_list[i], self.last_frame_face_centroid_list[j])
                e_distance_current_frame_person_x_list.append(self.last_current_frame_centroid_e_distance)
            last_frame_num = e_distance_current_frame_person_x_list.index(min(e_distance_current_frame_person_x_list))
            self.current_frame_face_name_list[i] = self.last_frame_face_name_list[last_frame_num]

    def draw_note(self, img_rd):
        cv2.putText(img_rd, "Face Recognizer", (20, 40), self.font, 1, (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(img_rd, "Frame:  " + str(self.frame_cnt), (20, 100), self.font, 0.8, (0, 255, 0), 1, cv2.LINE_AA)
        cv2.putText(img_rd, "FPS:    " + str(self.fps.__round__(2)), (20, 130), self.font, 0.8, (0, 255, 0), 1, cv2.LINE_AA)
        cv2.putText(img_rd, "Faces:  " + str(self.current_frame_face_cnt), (20, 160), self.font, 0.8, (0, 255, 0), 1, cv2.LINE_AA)
        for i in range(len(self.current_frame_face_name_list)):
            cv2.putText(img_rd, "Face_" + str(i + 1), tuple([int(self.current_frame_face_centroid_list[i][0]), int(self.current_frame_face_centroid_list[i][1])]),
                         self.font, 0.8, (255, 190, 0), 1, cv2.LINE_AA)
                         
                         
                         
    def process(self, frame):
        if self.isOk:
            img_rd = frame
            self.frame_cnt += 1
            if self.frame_cnt % 100 == 0:
                self.frame_cnt = 0

            # Detect faces
            faces = detector(img_rd, 0)

            # Update counts
            self.last_frame_face_cnt = self.current_frame_face_cnt
            self.current_frame_face_cnt = len(faces)

            # Update lists
            self.last_frame_face_name_list = self.current_frame_face_name_list[:]
            self.last_frame_face_centroid_list = self.current_frame_face_centroid_list
            self.current_frame_face_centroid_list = []

            # Ensure correct initialization of face name list
            self.current_frame_face_name_list = ["unknown"] * self.current_frame_face_cnt
            self.current_frame_face_position_list = []

            if self.current_frame_face_cnt != 0:
                for k, d in enumerate(faces):
                    self.current_frame_face_position_list.append(
                        tuple([faces[k].left(), int(faces[k].bottom() + (faces[k].bottom() - faces[k].top()) / 4)]))
                    self.current_frame_face_centroid_list.append(
                        [int(faces[k].left() + faces[k].right()) / 2, int(faces[k].top() + faces[k].bottom()) / 2])
                    img_rd = cv2.rectangle(img_rd, tuple([d.left(), d.top()]), tuple([d.right(), d.bottom()]), (255, 255, 255), 2)

                for i in range(self.current_frame_face_cnt):
                    self.current_frame_face_feature_list.append(
                        face_reco_model.compute_face_descriptor(img_rd, predictor(img_rd, faces[i])))
                    min_euclidean_distance_list = []
                    for known_face_feature in self.face_features_known_list:
                        e_distance = self.return_euclidean_distance(known_face_feature, self.current_frame_face_feature_list[i])
                        min_euclidean_distance_list.append(e_distance)
                    if min_euclidean_distance_list:
                        min_euclidean_distance = min(min_euclidean_distance_list)
                        if min_euclidean_distance < 0.5:
                            self.current_frame_face_name_list[i] = self.face_name_known_list[min_euclidean_distance_list.index(min_euclidean_distance)]
                        else:
                            self.current_frame_face_name_list[i] = "unknown"
                    else:
                        self.current_frame_face_name_list[i] = "unknown"
                    
                    # Draw the name on the frame
                    img_rd = cv2.putText(img_rd, self.current_frame_face_name_list[i], self.current_frame_face_position_list[i], self.font, 0.8, (0, 255, 255), 2, cv2.LINE_AA)
                
                self.draw_note(img_rd)
            return img_rd

                             
                             
                             
                             
                             
                         
                         
                         
                         
                         
        
