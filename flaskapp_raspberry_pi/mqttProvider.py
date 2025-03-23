import paho.mqtt.client as mqtt
import ssl

class MqttProvider:
    def __init__(self, broker, port, username, password, topic):
        self.broker = broker
        self.port = port
        self.username = username
        self.password = password
        self.topic = topic
        self.client = mqtt.Client()
        self.isOpencamera2 = True
        self.connect_count = 0
        
        # Set up MQTT callbacks
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish

        # Configure TLS/SSL settings if needed
        self.client.tls_set(cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLS)
        self.client.username_pw_set(username, password)

        # Connect to the broker
        self.client.connect(broker, port)
        self.client.loop_start()

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if self.connect_count == 0:
            print(f"Connected with result code {rc}")
        self.connect_count += 1
        self.client.subscribe(self.topic)

    def on_message(self, client, userdata, msg):
        print(f"(user): {msg.payload.decode()}")
        message = msg.payload.decode().strip().lower()
        if message == "true":
            self.isOpencamera2 = True
        elif message == "false":
            self.isOpencamera2 = False

    def on_publish(self, client, userdata, mid):
        pass

    def process_messages(self):
        while True:
            if self.isOpencamera2:
                self.process()
            if cv2.waitKey(1) & 0xFF == ord('e'):
                break

    def process(self):
        # Implement the logic for processing the camera feed
        pass

    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()
