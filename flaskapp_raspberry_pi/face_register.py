import dlib
import numpy as np
import cv2
import os
import shutil
import time
import json
import logging
from datetime import datetime

# Use frontal face detector of Dlib
detector = dlib.get_frontal_face_detector()

class Face_Register:
    def __init__(self):
        self.member_info=""
        self.current_frame_faces_cnt = 0
        self.existing_faces_cnt = 0
        self.ss_cnt = 0

        self.path_photos_from_camera = "static/data_faces_from_camera/"
        self.tmp_folder_path="" 
        self.current_face_dir = ""
        self.input_name_char = "knon"
        self.font = cv2.FONT_ITALIC

        # Initialize frame and face ROI position variables
        self.current_frame = None
        self.face_ROI_image = None
        self.face_ROI_width_start = 0
        self.face_ROI_height_start = 0
        self.face_ROI_width = 0
        self.face_ROI_height = 0
        self.ww = 0
        self.hh = 0

        self.out_of_range_flag = False
        self.face_folder_created_flag = False

        # FPS tracking
        self.frame_time = 0
        self.frame_start_time = 0
        self.fps = 0
        self.fps_show = 0
        self.start_time = time.time()

        self.check_existing_faces_cnt()
        self.pre_work_mkdir()

    def check_existing_faces_cnt(self):
        if os.listdir(self.path_photos_from_camera):
            person_list = [p for p in os.listdir(self.path_photos_from_camera) if os.path.isdir(os.path.join(self.path_photos_from_camera, p))]
            person_num_list = []

            for person in person_list:
                parts = person.split('_')
                if len(parts) > 1:
                    try:
                        person_order = int(parts[1])
                        person_num_list.append(person_order)
                    except ValueError:
                        logging.warning(f"Skipping invalid folder name: {person}")

            if person_num_list:
                self.existing_faces_cnt = max(person_num_list)
            else:
                self.existing_faces_cnt = 0
        else:
            self.existing_faces_cnt = 0

    def pre_work_mkdir(self):
        # Create folders to save face images and csv
        if not os.path.isdir(self.path_photos_from_camera):
            os.mkdir(self.path_photos_from_camera)

    def clear_data(self):
        try:
            folders_rd = os.listdir(self.path_photos_from_camera)
            for folder in folders_rd:
                shutil.rmtree(os.path.join(self.path_photos_from_camera, folder))

            if os.path.isfile("static/features_all.csv"):
                os.remove("static/features_all.csv")

            self.existing_faces_cnt = 0
            print("Face images and `features_all.csv` removed!")
        except Exception as e:
            logging.error("Failed to clear data: %s", str(e))
            print(f"Error clearing data: {e}")

    def create_user_json_file(self, member_info):
        try:
            json_file_path = os.path.join(self.path_photos_from_camera, f"user_{member_info['name']}.json")
            with open(json_file_path, 'w') as json_file:
                json.dump(member_info, json_file, indent=4)
            logging.info("JSON file created: %s", json_file_path)
            print(f"User JSON file created at: {json_file_path}")
        except Exception as e:
            logging.error("Failed to create user JSON file: %s", str(e))
            print(f"Error creating member JSON file: {e}")

    def update_user_json_file(self,name, photo_location):
        try:
            json_file_path = os.path.join(self.path_photos_from_camera, f"user_{name}.json")
            if os.path.isfile(json_file_path):
                with open(json_file_path, 'r') as json_file:
                    member_info = json.load(json_file)

                # Update Dataset with the new photo location
                member_info["Dataset"]=[]
                member_info["Dataset"].append(photo_location)

                with open(json_file_path, 'w') as json_file:
                    json.dump(member_info, json_file, indent=4)

                logging.info("Updated JSON file: %s", json_file_path)
                print(f"Updated JSON file with new photo location: {photo_location}")
                
                return member_info
            else:
                print(f"JSON file not found for user {self.existing_faces_cnt}.")
        except Exception as e:
            logging.error("Failed to update user JSON file: %s", str(e))
            print(f"Error updating user JSON file: {e}")



    def create_face_folder(self, member_info):
        try:
            # Increment face count and prepare folder paths
            self.existing_faces_cnt += 1
            name = member_info['name']
            self.current_face_dir = os.path.join(
                self.path_photos_from_camera,
                f"person_{self.existing_faces_cnt}_{name}"
            )

            # Create the new face directory
            os.makedirs(self.current_face_dir , exist_ok=True)
            logging.info("Directory created: %s", self.current_face_dir)
            print(f"\"{self.current_face_dir}/\" created!")

            # Create JSON file for the new user
            self.create_user_json_file(member_info)

            # Create a temporary folder for face images

            # Move all images from the temporary folder to the new face folder
            if os.path.isdir(self.current_face_dir):
                for filename in os.listdir(self.tmp_folder_path):
                    src = os.path.join(self.tmp_folder_path, filename)
                    dst = os.path.join(self.current_face_dir, filename)
                    shutil.move(src, dst)
                    self.member_info=self.update_user_json_file(name,dst)
                    logging.info("Moved file from %s to %s", src, dst)

                # Remove the temporary folder
                shutil.rmtree(self.tmp_folder_path)
                logging.info("Temporary folder removed: %s", self.tmp_folder_path)
            self.tmp_folder_path=""
            self.ss_cnt = 0
            self.face_folder_created_flag = True

        except Exception as e:
            logging.error("Failed to create face folder: %s", str(e))
            print(f"Error creating folder: {e}")

    def save_current_face(self):
        if self.current_frame_faces_cnt == 1:
            if not self.out_of_range_flag:
                self.ss_cnt += 1

                # Create blank image according to the size of face detected
                if self.current_frame is not None:
                    self.face_ROI_image = np.zeros((self.face_ROI_height * 2, self.face_ROI_width * 2, 3), np.uint8)

                    self.face_ROI_image[
                        :self.face_ROI_height * 2,
                        :self.face_ROI_width * 2
                    ] = self.current_frame[
                        self.face_ROI_height_start - self.hh:
                        self.face_ROI_height_start + self.face_ROI_height + self.hh,
                        self.face_ROI_width_start - self.ww:
                        self.face_ROI_width_start + self.face_ROI_width + self.ww
                    ]

                    self.face_ROI_image = cv2.cvtColor(self.face_ROI_image, cv2.COLOR_BGR2RGB)
                    file_path = os.path.join(self.current_face_dir, f"img_face_{self.ss_cnt}.jpg")
                    cv2.imwrite(file_path, self.face_ROI_image)
                    print(f"\"{file_path}\" saved!")
                    logging.info("Save into: %s", file_path)

                    # Update JSON file with the new photo location
                    self.update_user_json_file(file_path)

                    return self.face_ROI_image
                else:
                    print("Current frame is not available.")
            else:
                print("Please do not go out of range!")
        else:
            print("No face in the current frame!")

    def update_fps(self):
        now = time.time()
        if int(self.start_time) != int(now):
            self.fps_show = self.fps

        self.frame_time = now - self.frame_start_time
        self.fps = 1.0 / self.frame_time
        self.frame_start_time = now

    def process(self, frame):
        self.current_frame = frame
        faces = detector(self.current_frame, 0)  # Detect faces

        # Update FPS and face count
        self.update_fps()
        self.current_frame_faces_cnt = len(faces)

        # Process each detected face
        for k, d in enumerate(faces):
            self.face_ROI_width_start = d.left()
            self.face_ROI_height_start = d.top()
            self.face_ROI_height = d.bottom() - d.top()
            self.face_ROI_width = d.right() - d.left()
            self.hh = int(self.face_ROI_height / 2)
            self.ww = int(self.face_ROI_width / 2)
                        # Check if face ROI is out of range
            if (d.right() + self.ww) > 640 or (d.bottom() + self.hh > 480) or (d.left() - self.ww < 0) or (d.top() - self.hh < 0):
                self.out_of_range_flag = True
                color_rectangle = (255, 0, 0)
            else:
                self.out_of_range_flag = False
                color_rectangle = (255, 255, 255)
            
            # Draw rectangle around face ROI on the current frame
            self.current_frame = cv2.rectangle(self.current_frame,
                                               (d.left() - self.ww, d.top() - self.hh),
                                               (d.right() + self.ww, d.bottom() + self.hh),
                                               color_rectangle, 2)


        return self.current_frame

    def create_tmp_folder(self,name):
        try:
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            self.tmp_folder_path ="static/tmp/"+ f"{name}_tmp"
            os.mkdir(self.tmp_folder_path)
            tmp_folder_path=self.tmp_folder_path
            logging.info("Temporary file created: %s", tmp_folder_path)

            return tmp_folder_path
        except Exception as e:
            logging.error("Failed to create temporary folder: %s", str(e))
            return None
            
          
    def save_current_face(self):
        if self.face_folder_created_flag:
            if self.current_frame_faces_cnt == 1:
                if not self.out_of_range_flag:
                    self.ss_cnt += 1
                    #  Create blank image according to the size of face detected
                    self.face_ROI_image = np.zeros((int(self.face_ROI_height * 2), self.face_ROI_width * 2, 3),
                                                   np.uint8)
                    for ii in range(self.face_ROI_height * 2):
                        for jj in range(self.face_ROI_width * 2):
                            self.face_ROI_image[ii][jj] = self.current_frame[self.face_ROI_height_start - self.hh + ii][
                                self.face_ROI_width_start - self.ww + jj]
                                
                                
                    self.log_all["text"] = "\"" + self.current_face_dir + "/img_face_" + str(
                        self.ss_cnt) + ".jpg\"" + " saved!"
                    self.face_ROI_image = cv2.cvtColor(self.face_ROI_image, cv2.COLOR_BGR2RGB)

                    logging.info("%-40s %s/img_face_%s.jpg", "Save into：",
                                 str(self.current_face_dir), str(self.ss_cnt) + ".jpg")
                else:
                    self.log_all["text"] = "Please do not out of range!"
            else:
                self.log_all["text"] = "No face in current frame!"
        else:
            self.log_all["text"] = "Please run step 2!"  
            
    def capture_face(self, tmpFolderName):
        if self.current_frame_faces_cnt == 1:
            if not self.out_of_range_flag:
                # Increment the counter for saving images
                self.ss_cnt += 1
                
                # Check if current frame is available
                if self.current_frame is not None:
                    # Define the path for saving the face image
                    
                    # Create blank image according to the size of the detected face
                    self.face_ROI_image = np.zeros((self.face_ROI_height * 2, self.face_ROI_width * 2, 3), np.uint8)
                    self.face_ROI_image = np.zeros((int(self.face_ROI_height * 2), self.face_ROI_width * 2, 3),
                                                   np.uint8)
                    for ii in range(self.face_ROI_height * 2):
                        for jj in range(self.face_ROI_width * 2):
                            self.face_ROI_image[ii][jj] = self.current_frame[self.face_ROI_height_start - self.hh + ii][
                                self.face_ROI_width_start - self.ww + jj]

                    # Convert the color from BGR to RGB
                    cv2.imwrite(tmpFolderName + "/img_face_" + str(self.ss_cnt) + ".jpg", self.face_ROI_image)

                    print(f"\"{tmpFolderName}\" saved!")
                    logging.info("Saved face image to: %s", tmpFolderName)
                    
                    # Return the path to the saved face image
                    return tmpFolderName
                else:
                    print("Current frame is not available.")
                    logging.error("Current frame is not available for saving face.")
                    return None
            else:
                print("Please do not go out of range!")
                logging.warning("Face detection is out of range, cannot save face.")
                return None
        else:
            print("No face in the current frame!")
            logging.warning("No face detected in the current frame.")
            return None
