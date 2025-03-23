import paho.mqtt.client as mqtt
import ssl

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

        self.client.connect(broker_url, broker_port)
        self.client.loop_start()

    def on_connect(self, client, userdata, flags, rc, properties=None):
        print(f"Connected with result code {rc}")
        client.subscribe(self.topic)

    def on_message(self, client, userdata, msg):
        message = msg.payload.decode().strip().lower()
        self.msg = message
        print(self.msg)

    def on_publish(self, client, userdata, mid):
        pass

    def close(self):
        self.client.loop_stop()
        self.client.disconnect()

    def get_msg(self):
        return self.msg
