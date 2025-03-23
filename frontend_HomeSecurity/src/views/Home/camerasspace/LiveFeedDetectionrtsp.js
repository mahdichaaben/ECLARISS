import React, { useState, useEffect } from "react";
import { useSettings } from "context/SettingsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "components/modals/Modal";
import CameraNavigation from "./CameraNavigation"; // Import the camera navigation component

const LiveFeedDetectionrtsp = () => {
  const { settings, updateCameraStatus, updateCameraSmartMode } = useSettings();
  const [selectedCameraID, setSelectedCameraID] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [smartMode, setSmartMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (settings.cameras.length > 0) {
      setSelectedCameraID((prevID) => prevID || settings.cameras[0].cameraID);
    }
  }, [settings]);

  useEffect(() => {
    if (selectedCameraID) {
      const selectedCamera = settings.cameras.find(
        (cam) => cam.cameraID === selectedCameraID
      );
      if (selectedCamera) {
        setIsCameraOpen(selectedCamera.status || false);
        setSmartMode(selectedCamera.smartMode || false);
      }
    }
  }, [selectedCameraID, settings.cameras]);

  const handleCameraChange = (cameraID) => {
    setSelectedCameraID(cameraID);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSmartModeToggle = () => {
    setSmartMode((prevMode) => {
      const newMode = !prevMode;
      updateCameraSmartMode(selectedCameraID, newMode);
      return newMode;
    });
  };

  const toggleCamera = () => {
    if (selectedCameraID) {
      const camera = settings.cameras.find(
        (cam) => cam.cameraID === selectedCameraID
      );
      if (camera) {
        const newStatus = !isCameraOpen;
        setIsLoading(true);
        setIsCameraOpen(newStatus);
        updateCameraStatus(selectedCameraID, newStatus);

        setTimeout(() => setIsLoading(false), 500);
      }
    }
  };

  const currentCamera = settings.cameras.find(
    (cam) => cam.cameraID === selectedCameraID
  );

  return (
    <div className="p-6 bg-moon-light text-moon-dark rounded-lg shadow-lg">
      {/* Explanation Modal */}
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
       
        <p className="text-moon-dark">
          This component displays a live video feed from a camera using RTSP and
          WebRTC technologies. The camera streams video through RTSP, which is
          processed by a YOLO object detection model hosted in the cloud. The
          YOLO processor analyzes the RTSP stream (e.g., from 'camera1'),
          detects objects or people, and sends the processed video to a smart
          mode RTSP stream (e.g., 'camera1smart'). The smart mode RTSP feed
          communicates with the WebRTC server, allowing the detected video to be
          displayed on this web page in real-time. When "Smart Mode" is enabled,
          you'll see the processed video with YOLO detections applied to the
          feed.
        </p>
      </Modal>

      {/* Info Button */}
      <button
        className="mb-4 px-4 py-2 bg-moon-blue text-moon-dark rounded-lg flex items-center hover:bg-moon-light-blue transition duration-300"
        onClick={toggleModal}
      >
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
        Show Explanation
      </button>

      {/* Camera Navigation */}
      <div className="mb-6">
        <CameraNavigation
          cameras={settings.cameras}
          selectedCameraID={selectedCameraID}
          onSelect={handleCameraChange}
        />
      </div>

      {/* Camera Controls */}
      <div className="bg-moon-light shadow-md rounded-lg p-4 md:p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            className={`flex items-center justify-center px-4 py-2 rounded-lg ${
              isCameraOpen ? "bg-red-500" : "bg-moon-light-blue"
            } text-white ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={toggleCamera}
            disabled={!selectedCameraID || isLoading}
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            ) : (
              <FontAwesomeIcon icon={faCamera} className="mr-2" />
            )}
            {isCameraOpen ? "Close Camera" : "Open Camera"}
          </button>

          <div className="flex items-center">
            <label className="mr-2 text-moon-dark">Smart Mode:</label>
            <input
              type="checkbox"
              checked={smartMode}
              onChange={handleSmartModeToggle}
              className="mr-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Video Feed */}
        {selectedCameraID && (
          <div className="video-feed-container mt-6">
            <h3 className="text-lg font-semibold mb-4 text-moon-light-blue">
              Live Video Feed
            </h3>
            {isCameraOpen && currentCamera ? (
              <div className="relative w-full h-64 sm:h-96 bg-moon-dark border border-moon-light-blue rounded-lg">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title="Camera Feed"
                  src={`${settings.webrtcServerURL}/${selectedCameraID}${
                    smartMode ? "smart" : ""
                  }`}
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className="text-moon-light">Select a camera and open it to view the live feed.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveFeedDetectionrtsp;
