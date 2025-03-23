import cv2
import threading
import numpy as np
import paho.mqtt.client as mqtt
from yoloProcess import YoloProcess

class Stream_receiver_publisher:

    def __init__(self, topic='camera', host="127.0.0.1", port=1883):
        self.yoloprocessor = YoloProcess()
        self.cn = 0
        self.topic = topic
        self.frame = None
        
        self.client = mqtt.Client()  # Create instance of client 

        self.client.on_connect = self.on_connect  # Define callback function for successful connection
        self.client.message_callback_add(self.topic, self.on_message)
        
        self.client.connect(host, port)  # connecting to the broking server
        
        self.client.loop_start()  # Start networking daemon in a separate thread

    def on_connect(self, client, userdata, flags, rc):  # The callback for when the client connects to the broker
        client.subscribe(self.topic)  # Subscribe to the topic, receive any messages published on it
        print("Subscribed to topic:", self.topic)

    def on_message(self, client, userdata, msg):  # The callback for when a PUBLISH message is received from the server.
        self.cn += 1
        nparr = np.frombuffer(msg.payload, np.uint8)
        self.frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    def process(self):
        if self.frame is not None:
            img = self.yoloprocessor.process(self.frame)
            img_str = cv2.imencode('.jpg', img)[1].tobytes()
            #self.client.publish("camera_motion_detect", img_str)
            cv2.imshow('recv', img)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.client.loop_stop()  # Stop the network loop
                cv2.destroyAllWindows()
                return

if __name__ == "__main__":
    receiver = Stream_receiver_publisher(topic="camera")
    
    try:
        while True:
            receiver.process()
    except KeyboardInterrupt:
        print("Exiting...")
        receiver.client.loop_stop()
        cv2.destroyAllWindows()
