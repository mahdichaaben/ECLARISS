import os
import json

class DatabaseExtractor:
    def __init__(self, base_directory, config_file='config.json'):
        self.base_directory = base_directory
        self.config_file = config_file
        self.rtmpUrl = self.load_config().get('rtmpUrl', 'http://localhost:80')
        self.webrtcUrl = self.load_config().get('webrtcUrl', 'http://localhost:8889')
        self.generate_json("db.json")

    def load_config(self):
        """Charge la configuration depuis le fichier JSON."""
        if os.path.isfile(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        else:
            raise FileNotFoundError(f"Le fichier de configuration {self.config_file} n'existe pas.")
    
    def get_folder_size(self, folder_path):
        """Retourne la taille totale du dossier en mégaoctets."""
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(folder_path):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                total_size += os.path.getsize(filepath)
        return round(total_size / (1024 * 1024), 2)  # Convertir les octets en mégaoctets

    def extract_json_from_directory(self):
        """Extrait les données JSON de la structure du répertoire, y compris les tailles de fichiers en MB et la taille totale par utilisateur."""
        database = []

        for user_dir in os.listdir(self.base_directory):
            user_path = os.path.join(self.base_directory, user_dir)
            if os.path.isdir(user_path) and user_dir.startswith("user"):
                user_data = {"userId": user_dir, "total_size_MB": 0, "cameras": []}

                for cameraID in os.listdir(user_path):
                    camera_path = os.path.join(user_path, cameraID)
                    if os.path.isdir(camera_path):
                        camera_data = {"cameraID": cameraID, "detection": [], "recordings": [], "total_size_MB": 0}

                        detection_path = os.path.join(camera_path, "detection")
                        if os.path.isdir(detection_path):
                            for detection in os.listdir(detection_path):
                                detection_dir = os.path.join(detection_path, detection)
                                if os.path.isdir(detection_dir):
                                    cam_m3u8 = os.path.join(detection_dir, "cam.m3u8")
                                    if os.path.isfile(cam_m3u8):
                                        file_size_MB = self.get_folder_size(detection_dir)
                                        detection_url = os.path.join(self.rtmpUrl, "database", user_dir, cameraID, "detection", detection, "cam.m3u8")
                                        camera_data["detection"].append({
                                            detection: {
                                                "url": detection_url,
                                                "size_MB": file_size_MB
                                            }
                                        })
                                        camera_data["total_size_MB"] += file_size_MB

                        recordings_path = os.path.join(camera_path, "recordings")
                        if os.path.isdir(recordings_path):
                            for recording in os.listdir(recordings_path):
                                recording_dir = os.path.join(recordings_path, recording)
                                if os.path.isdir(recording_dir):
                                    cam_m3u8 = os.path.join(recording_dir, "cam.m3u8")
                                    if os.path.isfile(cam_m3u8):
                                        file_size_MB = self.get_folder_size(recording_dir)
                                        recording_url = os.path.join(self.rtmpUrl, "database", user_dir, cameraID, "recordings", recording, "cam.m3u8")
                                        camera_data["recordings"].append({
                                            recording: {
                                                "url": recording_url,
                                                "size_MB": file_size_MB
                                            }
                                        })
                                        camera_data["total_size_MB"] += file_size_MB

                        # Add RTMP and WebRTC URLs dynamically
                        camera_data["rtmpUrl"] = os.path.join(self.rtmpUrl, "database", user_dir, cameraID, "detection", cameraID + "_17-08-24-15-45-24", "cam.m3u8")
                        camera_data["webrtcUrl"] = f"{self.webrtcUrl}/{cameraID}"

                        user_data["cameras"].append(camera_data)
                        user_data["total_size_MB"] += camera_data["total_size_MB"]

                database.append(user_data)

        return {"database": database}

    def save_to_json(self, data, output_file):
        """Enregistre les données extraites dans un fichier JSON."""
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Données extraites et sauvegardées dans {output_file}")

    def generate_json(self, output_file):
        """Extrait les données du répertoire et les enregistre dans un fichier JSON."""
        data = self.extract_json_from_directory()
        self.save_to_json(data, output_file)
        print(f"Données extraites et sauvegardées dans {output_file}")

    def load_json(self, input_file):
        """Charge les données depuis un fichier JSON et les retourne."""
        if os.path.isfile(input_file):
            with open(input_file, 'r') as f:
                return json.load(f)
        else:
            raise FileNotFoundError(f"Le fichier {input_file} n'existe pas.")
        
    def load_user_data(self, userId):
        """Retourne les données d'un utilisateur spécifique à partir du fichier JSON."""
        try:
            data = self.load_json("db.json")
            for user in data.get("database", []):
                if user["userId"] == userId:
                    return user
            return {"error": "Utilisateur non trouvé"}
        except Exception as e:
            return {"error": str(e)}
        
    def filter_data(self, userId=None, cameraID=None, date=None, recording_name=None, detection_name=None, url_contains=None, size_min=None, size_max=None):
        """Filtre les données selon les critères spécifiés et retourne une liste des URLs des streams."""
        try:
            data = self.load_json("db.json")
            rtmpUrls = []

            for user in data.get("database", []):
                if userId and user["userId"] != userId:
                    continue

                for camera in user.get("cameras", []):
                    if cameraID and camera["cameraID"] != cameraID:
                        continue

                    for detection in camera.get("detection", []):
                        detection_name_key = list(detection.keys())[0]
                        if detection_name and detection_name_key != detection_name:
                            continue
                        if url_contains and url_contains not in detection[detection_name_key]["url"]:
                            continue
                        if size_min and detection[detection_name_key]["size_MB"] < size_min:
                            continue
                        if size_max and detection[detection_name_key]["size_MB"] > size_max:
                            continue

                        rtmpUrls.append(detection[detection_name_key]["url"])

                    for recording in camera.get("recordings", []):
                        recording_name_key = list(recording.keys())[0]
                        if recording_name and recording_name_key != recording_name:
                            continue
                        if url_contains and url_contains not in recording[recording_name_key]["url"]:
                            continue
                        if size_min and recording[recording_name_key]["size_MB"] < size_min:
                            continue
                        if size_max and recording[recording_name_key]["size_MB"] > size_max:
                            continue

                        rtmpUrls.append(recording[recording_name_key]["url"])

            return rtmpUrls

        except Exception as e:
            return {"error": str(e)}
