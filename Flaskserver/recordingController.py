import os
import subprocess
import signal
import datetime
from database_extractor import DatabaseExtractor

import shutil

class RecordingController:
    def __init__(self, base_directory):
        self.base_directory = base_directory
        self.ffmpeg_processes = {}
        self.db_extractor = DatabaseExtractor(base_directory)
    def delete_stream(self, userId, cameraID, stream_type, stream_name):
        try:
            stream_folder = os.path.join(self.base_directory, userId, cameraID, stream_type, stream_name)
            print(stream_folder)
            if os.path.exists(stream_folder):
                print("ok")
                self.update_database()
                shutil.rmtree(stream_folder)
                return {"message": f"{stream_name} has been deleted successfully."}
            else:
                return {"error": "Stream folder not found."}
        except Exception as e:
            return {"error": str(e)}

    def start_recording(self, userId, cameraID):
        if cameraID in self.ffmpeg_processes:
            return {"error": "Recording already in progress"}

        timestamp = datetime.datetime.now().strftime("%d-%m-%y-%H-%M-%S")
        output_dir = os.path.join(self.base_directory, f"{userId}", cameraID, "recordings", f"{cameraID}_{timestamp}")
        os.makedirs(output_dir, exist_ok=True)

        ffmpeg_command = [
            'ffmpeg',
            '-i', f'rtmp://localhost/live/{cameraID}',
            '-c:v', 'libx264',
            '-acodec', 'copy',
            '-b:v', '256k',
            '-vf', 'scale=480:trunc(ow/a/2)*2',
            '-tune', 'zerolatency',
            '-preset', 'veryfast',
            '-crf', '23',
            '-g', '60',
            '-hls_time', '10',
            '-hls_list_size', '0',
            '-hls_flags', 'delete_segments',
            '-f', 'hls',
            os.path.join(output_dir, 'cam.m3u8')
        ]

        try:
            process = subprocess.Popen(ffmpeg_command)
            self.ffmpeg_processes[cameraID] = process.pid
            self.update_database()
            return {"message": "Recording started"}
        except Exception as e:
            return {"error": str(e)}

    def stop_recording(self, userId, cameraID):
        if cameraID not in self.ffmpeg_processes:
            return {"error": "No recording in progress"}

        try:
            pid = self.ffmpeg_processes[cameraID]
            os.kill(pid, signal.SIGTERM)
            del self.ffmpeg_processes[cameraID]
            self.update_database()
            return {"message": "Recording stopped"}
        except Exception as e:
            return {"error": str(e)}

    def update_database(self):
        """Updates the database JSON file with current directory structure."""
        self.db_extractor.generate_json('db.json')
    

    


