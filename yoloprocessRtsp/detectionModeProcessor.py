import json
import os
import cv2
import numpy as np
from datetime import datetime
from yoloProcess import YoloProcess
from rtsp_receiver import RTSPReceiver
from rtsp_sender import RTSPSender
from mqtt_controller import MQTTController  # Import the MQTTController class

def seconds_to_human_readable(seconds):
    """Convert seconds to a human-readable format."""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    
    if hours > 0:
        return f"{hours} hour(s) {minutes} minute(s)"
    elif minutes > 0:
        return f"{minutes} minute(s)"
    else:
        return f"{seconds} second(s)"

class DetectionModeProcessor:
    def __init__(self, user_id, camera_id, rtsp_source_url, rtsp_destination_url, db_folder='db_detectionmode'):
        self.yoloprocessor = YoloProcess()
        self.camera_id = camera_id
        self.user_id = user_id
        self.db_folder = db_folder
        # Initialize RTSPReceiver and RTSPSender with fixed resolution and FPS
        self.frame_width = 640
        self.frame_height = 480
        self.fps = 15
        self.rtsp_receiver = RTSPReceiver(rtsp_source_url, self.frame_width, self.frame_height, self.fps)
        self.rtsp_sender = RTSPSender(rtsp_destination_url, self.frame_width, self.frame_height, self.fps)
        
        self.rtsp_receiver.start_ffmpeg_receive()
        self.rtsp_sender.start_ffmpeg_send()

        self.detection_mode = True
        self.detection_start_time = None


    def close(self):
        self.rtsp_receiver.close()
        self.rtsp_sender.close()
        cv2.destroyAllWindows()

    def process(self):
        frame = self.rtsp_receiver.get_latest_frame()  #get_latest_frame
        if frame is not None:
            img = self.yoloprocessor.process(frame)
            self.rtsp_sender.send_frame(img)  
            # cv2.imshow("track mode",img)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.close()
                return
            
    def main(self):
        try:
            while True:
                processor.process()
        except KeyboardInterrupt:
            print("Exiting...")
            processor.close()
            mqtt_controller.close()


if __name__ == "__main__":
    user_id = os.getenv("USER_ID", "admin")  
    camera_id = os.getenv("CAMERA_ID", "camera1") 
    rtsp_source_url = os.getenv("RTSP_SOURCE_URL", "rtsp://localhost:8554/camera1")  
    rtsp_destination_url = os.getenv("RTSP_DESTINATION_URL", "rtsp://localhost:8554/camera1smart")  # Default RTSP destination URL

    mqtt_broker = os.getenv("MQTT_BROKER")
    mqtt_port = int(os.getenv("MQTT_PORT", 8883)) 
    mqtt_username = os.getenv("MQTT_USERNAME")
    mqtt_password = os.getenv("MQTT_PASSWORD")
    mqtt_topic = os.getenv("MQTT_TOPIC")

    mqtt_controller = MQTTController(
        broker_url=mqtt_broker,
        broker_port=mqtt_port,
        username=mqtt_username,
        password=mqtt_password,
        topic=mqtt_topic
    )
    
    processor = DetectionModeProcessor(user_id, camera_id, rtsp_source_url, rtsp_destination_url)

    processor.main()