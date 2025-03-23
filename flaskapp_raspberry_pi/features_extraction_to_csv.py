import os
import dlib
import csv
import numpy as np
import logging
import cv2

class FaceFeatureExtractor:
    def __init__(self, path_images="static/data_faces_from_camera/", 
                 predictor_path='static/data_dlib/shape_predictor_68_face_landmarks.dat',
                 model_path="static/data_dlib/dlib_face_recognition_resnet_model_v1.dat"):
        self.path_images_from_camera = path_images
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor(predictor_path)
        self.face_reco_model = dlib.face_recognition_model_v1(model_path)

    def return_128d_features(self, path_img):
        img_rd = cv2.imread(path_img)
        faces = self.detector(img_rd, 1)

        logging.info("%-40s %-20s", " Image with faces detected:", path_img)

        if len(faces) != 0:
            shape = self.predictor(img_rd, faces[0])
            face_descriptor = self.face_reco_model.compute_face_descriptor(img_rd, shape)
        else:
            face_descriptor = np.zeros(128)
            logging.warning("No face detected in %s", path_img)

        return face_descriptor

    def return_features_mean_personX(self, path_face_personX):
        features_list_personX = []
        photos_list = os.listdir(path_face_personX)

        if photos_list:
            for photo in photos_list:
                logging.info("%-40s %-20s", " / Reading image:", path_face_personX + "/" + photo)
                features_128d = self.return_128d_features(path_face_personX + "/" + photo)

                if not np.array_equal(features_128d, np.zeros(128)):
                    features_list_personX.append(features_128d)
        else:
            logging.warning("Warning: No images in %s", path_face_personX)

        if features_list_personX:
            features_mean_personX = np.array(features_list_personX, dtype=object).mean(axis=0)
        else:
            features_mean_personX = np.zeros(128, dtype=object)

        return features_mean_personX

    def save_features_to_csv(self, output_csv="static/features_all.csv"):
        person_list = [p for p in os.listdir(self.path_images_from_camera) if os.path.isdir(os.path.join(self.path_images_from_camera, p))]
        person_list.sort()

        with open(output_csv, "w", newline="") as csvfile:
            writer = csv.writer(csvfile)
            for person in person_list:
                logging.info("Processing person: %s", person)
                features_mean_personX = self.return_features_mean_personX(os.path.join(self.path_images_from_camera, person))

                if len(person.split('_', 2)) == 2:
                    person_name = person
                else:
                    person_name = person.split('_', 2)[-1]

                features_mean_personX = np.insert(features_mean_personX, 0, person_name, axis=0)
                writer.writerow(features_mean_personX)

        logging.info("Saved all the features of faces registered into: %s", output_csv)
        


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    extractor = FaceFeatureExtractor()
    extractor.save_features_to_csv()
