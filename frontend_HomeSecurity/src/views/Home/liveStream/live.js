import React, { useState, useEffect } from 'react';
import MqttClient from './MqttClient'; // Adjust the import based on your file structure
import MqttVideoReceiver from './mqttVideoReceiver'; // Adjust the import based on your file structure
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faCamera, faRecordVinyl } from "@fortawesome/free-solid-svg-icons";

// MQTT client configuration
const mqttClient = new MqttClient(
  'wss://3295446499b64d298ec2ec27690e9fdf.s1.eu.hivemq.cloud:8883/mqtt', // Use the provided URL
  'camera2device',
  'Camera2device',
  "clientId"
);

const Live = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [autoRecord, setAutoRecord] = useState(false);
  const [topic, setTopic] = useState('admin/camera1/detectmode/publishedframe'); // Default topic

  // Toggle YOLO process state
  const toggleYoloProcess = () => {
    const newState = !isProcessing;
    setIsProcessing(newState);
    
    // Publish MQTT message
    mqttClient.publishMessage(
      `admin/camera1/detectmode`,
      newState ? "true" : "false"
    );
  };

  // Toggle Camera state
  const toggleCamera = () => {
    const newState = !isCameraOpen;
    setIsCameraOpen(newState);

    // Publish MQTT message to open/close camera
    mqttClient.publishMessage(
      `admin/camera1/camera`,
      newState ? "open" : "close"
    );
  };

  // Toggle Auto Recording state
  const toggleAutoRecord = () => {
    const newState = !autoRecord;
    setAutoRecord(newState);

    // Publish MQTT message to toggle auto-recording
    mqttClient.publishMessage(
      `admin/camera1/autorecord`,
      newState ? "true" : "false"
    );
  };

  useEffect(() => {
    mqttClient.initialize(); // Initialize MQTT client on component mount
    return () => {
      mqttClient.client.end(); // Clean up MQTT client on component unmount
    };
  }, []);

  return (
    <div className="yolo-control p-4 md:p-6">


      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <div className="flex flex-wrap">
          <button
            className={`flex items-center justify-center px-4 py-2 rounded-lg ${
              isProcessing ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
            onClick={toggleYoloProcess}
          >
            <FontAwesomeIcon
              icon={isProcessing ? faStop : faPlay}
              className="mr-2"
            />
            {isProcessing ? "Deactivate YOLO Process" : "Activate YOLO Process"}
          </button>
          <button
            className={`flex items-center justify-center px-4 py-2 rounded-lg ${
              autoRecord ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
            onClick={toggleAutoRecord}
          >
            <FontAwesomeIcon
              icon={faRecordVinyl}
              className="mr-2"
            />
            {autoRecord ? "Auto-Recording On" : "Auto-Recording Off"}
          </button>

          <button
            className={`flex items-center justify-center px-4 py-2 rounded-lg ${
              isCameraOpen ? "bg-red-500 text-white" : "bg-blue-500 text-white"
            }`}
            onClick={toggleCamera}
          >
            <FontAwesomeIcon
              icon={faCamera}
              className="mr-2"
            />
            {isCameraOpen ? "Close Camera" : "Open Camera"}
          </button>
        </div>


      </div>

      <div className="video-feed-container mt-6">
        <h3 className="text-lg font-semibold mb-4">Live Video Feed</h3>
        {isCameraOpen && (
          <MqttVideoReceiver
            brokerUrl="ws://192.168.1.12:9001"
            topic={topic}
            clientId="react-client-motion"
            width="640px"
            height="480px"
            className="max-w-full"
          />
        )}
      </div>
    </div>
  );
};

export default Live;
