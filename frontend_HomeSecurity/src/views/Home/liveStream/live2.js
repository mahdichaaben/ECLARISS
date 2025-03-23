// src/Live.js
import React, { useState, useEffect } from "react";
import MqttClient from './MqttClient';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faBell,
  faBellSlash,
  faExclamationTriangle,
  faLightbulb,
  faCamera,
  faCameraRetro,
} from "@fortawesome/free-solid-svg-icons";

const cameraData = {
  userID: "user1",
  cameras: [
    // Camera data here...
  ],
};

const mqttClient = new MqttClient(
  'wss://3295446499b64d298ec2ec27690e9fdf.s1.eu.hivemq.cloud:8884/mqtt',
  'camera2device',
  'Camera2device',
  "clientId"
);

const Live = () => {
  const [trackingMode, setTrackingMode] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(true);
  const [smartRecording, setSmartRecording] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [autoAlarm, setAutoAlarm] = useState(false);
  const [lighting, setLighting] = useState(false);

  useEffect(() => {
    mqttClient.initialize(); // Initialize MQTT client on component mount
    return () => {
      mqttClient.client.end(); // Clean up MQTT client on component unmount
    };
  }, []);

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
  };

  const toggleSmartRecording = () => {
    setSmartRecording((prevState) => !prevState);
    mqttClient.publishMessage(
      `${cameraData.userID}/camera1/smartRecording`,
      !smartRecording ? "true" : "false"
    );
  };

  const toggleNotifications = () => {
    setNotifications((prevState) => !prevState);
    mqttClient.publishMessage(
      `${cameraData.userID}/notifications`,
      !notifications ? "true" : "false"
    );
  };

  const toggleAutoAlarm = () => {
    setAutoAlarm((prevState) => !prevState);
    mqttClient.publishMessage(
      `${cameraData.userID}/alarm`,
      !autoAlarm ? "true" : "false"
    );
  };

  const toggleLighting = () => {
    setLighting((prevState) => !prevState);
    mqttClient.publishMessage(
      `${cameraData.userID}/lighting`,
      !lighting ? "true" : "false"
    );
  };

  const toggleCameraMode = () => {
    if (selectedCamera) {
      const newMode = selectedCamera.detection_mode === "on" ? "off" : "on";
      setSelectedCamera((prevState) => ({
        ...prevState,
        detection_mode: newMode,
      }));
      mqttClient.publishMessage(
        `${cameraData.userID}/${selectedCamera.cameraID}/detectmode`,
        newMode
      );
    }
  };

  return (
    <div className="video-feed-selector p-4 md:p-6">
      {/* Camera Selection Navbar */}
      <nav className="bg-gray-50 p-3 md:p-4 shadow-lg rounded-lg mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Select Camera</h2>
        <div className="flex flex-wrap gap-2 md:gap-4">
          {cameraData.cameras.map((camera) => (
            <button
              key={camera.cameraID}
              className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCamera?.cameraID === camera.cameraID
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => handleCameraSelect(camera)}
            >
              {/* Optionally include an icon for each camera */}
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 12c2.28 0 4.15-1.86 4.15-4.15S14.28 3.7 12 3.7s-4.15 1.86-4.15 4.15S9.72 12 12 12zm0 0v5.1m0 0l-3 3m3-3l3 3"
                ></path>
              </svg>
              Camera {camera.cameraID}
            </button>
          ))}
        </div>
      </nav>

      {/* Camera Details and Controls */}
      {selectedCamera && (
        <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
          {/* Responsive Iframe */}
          <div className="relative w-full pb-[56.25%] mb-4">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src="http://localhost:8889/source"
              scrolling="no"
              allowFullScreen
            ></iframe>
          </div>

          {/* Controls */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 space-y-4">
            <h3 className="text-md md:text-lg font-semibold mb-4">Camera Controls</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  selectedCamera.detection_mode === "on"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={toggleCameraMode}
              >
                <FontAwesomeIcon
                  icon={selectedCamera.detection_mode === "on" ? faCameraRetro : faCamera}
                  className="mr-2"
                />
                {selectedCamera.detection_mode === "on"
                  ? "Deactivate Camera"
                  : "Activate Camera"}
              </button>
              <button
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  smartRecording
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
                onClick={toggleSmartRecording}
              >
                <FontAwesomeIcon
                  icon={smartRecording ? faStop : faPlay}
                  className="mr-2"
                />
                {smartRecording
                  ? "Deactivate Smart Recording"
                  : "Activate Smart Recording"}
              </button>
              <button
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  autoAlarm
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={toggleAutoAlarm}
              >
                <FontAwesomeIcon
                  icon={autoAlarm ? faExclamationTriangle : faBell}
                  className="mr-2"
                />
                {autoAlarm ? "Deactivate Auto Alarm" : "Activate Auto Alarm"}
              </button>
              <button
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  lighting
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={toggleLighting}
              >
                <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                {lighting ? "Turn Off Lights" : "Turn On Lights"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Live;
