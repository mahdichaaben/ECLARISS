import cv2
import numpy as np
import paho.mqtt.client as mqtt
from tests.yoloProcess2 import YoloProcess

class Stream_receiver_publisher:

    def __init__(self, topic='camera', host="127.0.0.1", port=1883):
        self.yoloprocessor = YoloProcess()
        self.topic = topic
        self.frame = None
        
        self.client = mqtt.Client()  # Create instance of client 

        self.client.on_connect = self.on_connect  # Define callback function for successful connection
        self.client.message_callback_add(self.topic, self.on_message)
        
        self.client.connect(host, port)  # Connecting to the broker server
        
        self.client.loop_start()  # Start networking daemon in a separate thread

    def on_connect(self, client, userdata, flags, rc):  # The callback for when the client connects to the broker
        client.subscribe(self.topic)  # Subscribe to the topic, receive any messages published on it
        print("Subscribed to topic:", self.topic)

    def on_message(self, client, userdata, msg):  # The callback for when a PUBLISH message is received from the server.
        nparr = np.frombuffer(msg.payload, np.uint8)
        self.frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    def process(self):
        if self.frame is not None:
            # Process the frame and get tracking data
            data = self.yoloprocessor.process(self.frame)
            
            # Draw annotations on the frame
            frame_with_drawings = self.yoloprocessor.draw_on_frame(self.frame, data)
            
            # Encode the frame to JPEG format
            #img_str = cv2.imencode('.jpg', frame_with_drawings)[1].tobytes()
            
            # Publish the annotated frame
            self.client.publish("camera_motion_detect_json",data)
            
            cv2.imshow('recv', frame_with_drawings)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.client.loop_stop()  # Stop the network loop
                cv2.destroyAllWindows()
                return

if __name__ == "__main__":
    receiver =Stream_receiver_publisher(topic="camera")
    try:
        while True:
            receiver.process()
    except KeyboardInterrupt:
        print("Exiting...")
        receiver.client.loop_stop()
        cv2.destroyAllWindows()
