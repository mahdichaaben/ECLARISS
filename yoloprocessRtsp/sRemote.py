import os
import cv2
import subprocess
import datetime
import paho.mqtt.client as mqtt
import ssl


class CameraStream:
    def __init__(self, mqtt_client_id, mqtt_username, mqtt_password, mqtt_broker, mqtt_port, rtsp_url):
        self.isOpencamera1 = True
        self.connect_count = 0

        # MQTT setup
        self.client = mqtt.Client(client_id=mqtt_client_id, userdata=None, protocol=mqtt.MQTTv5)
        self.client.tls_set(cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLS)
        self.client.username_pw_set(mqtt_username, mqtt_password)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish
        self.client.connect(mqtt_broker, mqtt_port)
        self.client.loop_start()

        # Video capture setup
        self.cap = cv2.VideoCapture(0)  # Use camera 0

        # FFmpeg process setup
        self.ffmpeg_command = [
            'ffmpeg',
            '-y',
            '-f', 'rawvideo',
            '-vcodec', 'rawvideo',
            '-pix_fmt', 'bgr24',
            '-s', '640x480',  # Change resolution if needed
            '-r', '30',  # Frame rate
            '-i', '-',  # Input from stdin
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-preset', 'veryfast',
            '-bf', '0',  # Disable B-frames
            '-f', 'rtsp',
            rtsp_url  # RTSP server URL
        ]
        self.process = subprocess.Popen(self.ffmpeg_command, stdin=subprocess.PIPE)

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if self.connect_count == 0:
            print(f"Connected with result code {rc}")
        self.connect_count += 1
        client.subscribe("user1/lighting")

    def on_message(self, client, userdata, msg):
        print(f"(user): {msg.payload.decode()}")
        message = msg.payload.decode().strip().lower()
        if message == "true":
            self.isOpencamera1 = True
        elif message == "false":
            self.isOpencamera1 = False

    def on_publish(self, client, userdata, mid):
        pass

    def add_timestamp(self, frame):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        position = (10, 30)
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1
        color = (0, 255, 0)
        thickness = 2
        cv2.putText(frame, timestamp, position, font, font_scale, color, thickness)
        return frame

    def process_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            print("Failed to capture image")
            return 

        frame_with_timestamp = self.add_timestamp(frame)

        # Write the frame to the FFmpeg process
        self.process.stdin.write(frame_with_timestamp.tobytes())

        # Optional: Display the frame locally
        # cv2.imshow('Camera Feed', frame_with_timestamp)

    def run(self):
        while True:
            if self.isOpencamera1:
                self.process_frame()
            else:
                cv2.waitKey(1000)  # Wait if the camera is off

        # Clean up resources
        self.cleanup()

    def cleanup(self):
        self.cap.release()
        cv2.destroyAllWindows()
        self.process.stdin.close()
        self.process.wait()
        self.client.loop_stop()
        self.client.disconnect()


if __name__ == "__main__":
    # Load environment variables
    mqtt_client_id = os.getenv("MQTT_CLIENT_ID")
    mqtt_username = os.getenv("MQTT_USERNAME")
    mqtt_password = os.getenv("MQTT_PASSWORD")
    mqtt_broker = os.getenv("MQTT_BROKER")
    mqtt_port = int(os.getenv("MQTT_PORT", 8883))  # Default to 8883 if not set
    rtsp_url = os.getenv("RTSP_URL")

    # Create and run the camera stream
    stream = CameraStream(
        mqtt_client_id=mqtt_client_id,
        mqtt_username=mqtt_username,
        mqtt_password=mqtt_password,
        mqtt_broker=mqtt_broker,
        mqtt_port=mqtt_port,
        rtsp_url=rtsp_url
    )
    stream.run()