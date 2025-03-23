import paho.mqtt.client as mqtt
import ssl
import json
import threading

class MQTTController:
    def __init__(self, broker_url, broker_port, username, password, topic, client_id="mqtt_controller"):
        self.broker_url = broker_url
        self.broker_port = broker_port
        self.username = username
        self.password = password
        self.topic = topic
        self.client_id = client_id
        self.client = mqtt.Client(client_id=client_id, userdata=None, protocol=mqtt.MQTTv5)
        self.msg = False

        # Set TLS for secure connection
        self.client.tls_set(cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLS)
        self.client.username_pw_set(username, password)
        
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish

        # Connect to broker and start the loop in a separate thread
        self.client.connect(broker_url, broker_port)
        self.loop_thread = threading.Thread(target=self.client.loop_forever)
        self.loop_thread.start()

    def on_connect(self, client, userdata, flags, rc, properties=None):
        print(f"Connected with result code {rc}")
        client.subscribe(self.topic)

    def on_message(self, client, userdata, msg):
        try:
            # Decode the message payload and parse it as JSON
            message = json.loads(msg.payload.decode())
            self.msg = message
            print(f"Message received: {self.msg}")
        except json.JSONDecodeError:
            print("Failed to decode JSON message.")

    def on_publish(self, client, userdata, mid):
        pass

    def close(self):
        self.client.loop_stop()
        self.client.disconnect()
        self.loop_thread.join()  # Wait for the loop thread to finish

    def get_msg(self):
        # Check if msg is not empty and contains the 'status' key
        if self.msg and 'smartMode' in self.msg:
            # Return True if status is True or any other truthy value, False otherwise
            return bool(self.msg['smartMode'])
        return False
    

    
