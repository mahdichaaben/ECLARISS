import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { useSettings } from 'context/SettingsContext'; 


let client = null;

const initializeMqttClient = (brokerUrl, username, password, clientId) => {

  
  if (client) {
    client.end();
  }

  client = mqtt.connect(brokerUrl, {
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    port: 9001,
    connectTimeout: 30 * 1000, // 30 seconds timeout for the connection
    keepalive: 60,
    clean: true,
    reconnectPeriod: 1000,
    username: username,
    password: password,
  });

  client.on('connect', function () {
    console.log('Connected to MQTT broker');
  });

  client.on('error', function (error) {
    console.error('Connection error: ', error);
  });

  return client;
};

const MqttVideoReceiver = ({
  brokerUrl = 'ws://localhost:9001',
  topic,
  username = '',
  password = '',
  clientId,
  width = '640px',
  height = '360px'
}) => {
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    client = initializeMqttClient(brokerUrl, username, password, clientId);

    client.subscribe(topic, (err) => {
      if (err) {
        console.error('Subscription error: ', err);
      }
    });

    client.on('message', (topic, message) => {
      // Assuming the message is the URL or data for the image
      setFrame(URL.createObjectURL(new Blob([message])));
    });

    return () => {
      if (client) {
        client.unsubscribe(topic);
        client.end(); // Cleanup the MQTT connection on component unmount
      }
    };
  }, [brokerUrl, topic, username, password, clientId]);

  return (
    <div>
      {frame ? (
        <img
          src={frame}
          alt="Stream"
          style={{ width: width, height: height }}
        />
      ) : (
        <p>Waiting for video stream...</p>
      )}
    </div>
  );
};

export default MqttVideoReceiver;



          /* Video Receiver Component */
          /* <div className="relative">
            <MqttVideoReceiver
              brokerUrl="ws://192.168.1.12:9001"
              topic={selectedCamera.topic }
              clientId="react-client-motion"
              width="100%"
              height="auto"
              className="max-w-full"
            />
          </div> */
