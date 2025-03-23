import React, { useState } from "react";
import CameraField from "components/CameraPlace/cameraField"; // Mock CameraField component
import { useSettings } from "context/SettingsContext";
import {
  FaPlay,
  FaStop,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const RecordingsManager = () => {
  const { settings } = useSettings();

  const initialUserData = {
    userId: "user1",
    total_size_MB: 19.53,
    cameras: [
      {
        url_last_24: `${settings.rtmpServerURL}/tmp_hls/camera1/index.m3u8`,
        url_live: `${settings.rtspServerURL}/camera1`,
        camera_name: "camera",
        detection: [
          {
            "camera_17-08-24-15-45-24": {
              url: `${settings.rtmpServerURL}/database/user1/camera/detection/camera_17-08-24-15-45-24/cam.m3u8`,
              size_MB: 7.29,
            },
          },
        ],
        recordings: [
          {
            "camera_17-08-24-15-36-25": {
              url: `${settings.rtmpServerURL}/database/user1/camera/recordings/camera_17-08-24-15-36-25/cam.m3u8`,
              size_MB: 4.95,
            },
          },
          {
            "camera_17-08-24-15-45-24": {
              url: `${settings.rtmpServerURL}/database/user1/camera/recordings/camera_17-08-24-15-36-25/cam.m3u8`,
              size_MB: 7.29,
            },
          },
        ],
        total_size_MB: 19.53,
      },



      {
        url_last_24: `${settings.rtmpServerURL}/tmp_hls/camera1/index.m3u8`,
        url_live: `${settings.rtspServerURL}/camera1`,
        camera_name: "camera",
        detection: [
          {
            "camera_17-08-24-15-45-24": {
              url: `${settings.rtmpServerURL}/database/user1/camera/detection/camera_17-08-24-15-45-24/cam.m3u8`,
              size_MB: 7.29,
            },
          },
        ],
        recordings: [
          {
            "camera_17-08-24-15-36-25": {
              url: `${settings.rtmpServerURL}/database/user1/camera/recordings/camera_17-08-24-15-36-25/cam.m3u8`,
              size_MB: 4.95,
            },
          },
          {
            "camera_17-08-24-15-45-24": {
              url: `${settings.rtmpServerURL}/database/user1/camera/recordings/camera_17-08-24-15-36-25/cam.m3u8`,
              size_MB: 7.29,
            },
          },
        ],
        total_size_MB: 19.53,
      },


      {
        url_last_24: `${settings.rtmpServerURL}/tmp_hls/camera1/index.m3u8`,
        url_live: `${settings.rtspServerURL}/camera1`,
        camera_name: "camera",
        detection: [
          {
            "camera_17-08-24-15-45-24": {
              url: `${settings.rtmpServerURL}/database/user1/camera/detection/camera_17-08-24-15-45-24/cam.m3u8`,
              size_MB: 7.29,
            },
          },
        ],
        recordings: [
          {
            "camera_17-08-24-15-36-25": {
              url: `${settings.rtmpServerURL}/database/user1/camera/recordings/camera_17-08-24-15-36-25/cam.m3u8`,
              size_MB: 4.95,
            },
          },
          {
            "camera_17-08-24-15-45-24": {
              url: `${settings.rtmpServerURL}/database/user1/camera/recordings/camera_17-08-24-15-36-25/cam.m3u8`,
              size_MB: 7.29,
            },
          },
        ],
        total_size_MB: 19.53,
      },
      // Repeat for other cameras...
    ],
  };

  const [selectedCamera, setSelectedCamera] = useState(
    initialUserData.cameras[0]
  );
  const [isDetectionOpen, setDetectionOpen] = useState(false);
  const [isRecordingsOpen, setRecordingsOpen] = useState(false);
  const [isLast24Open, setLast24Open] = useState(false);
  const [cameras, setCameras] = useState(initialUserData.cameras);
  const [selectedVideoInfo, setSelectedVideoInfo] = useState(null);

  const handleCameraChange = (cameraName) => {
    const camera = cameras.find((cam) => cam.camera_name === cameraName);
    if (camera) {
      setSelectedCamera(camera);
      setDetectionOpen(false);
      setRecordingsOpen(false);
      setLast24Open(false);
      setSelectedVideoInfo(null);
    }
  };

  const handleStartRecording = () => {
    console.log("Start recording");
    // Implement start recording logic here
  };

  const handleStopRecording = () => {
    console.log("Stop recording");
    // Implement stop recording logic here
  };

  const handleDeleteVideo = (cameraIndex, videoKey, type) => {
    const updatedCameras = cameras.map((camera, idx) => {
      if (idx === cameraIndex) {
        return {
          ...camera,
          [type]: camera[type].filter(
            (video) => !Object.keys(video).includes(videoKey)
          ),
        };
      }
      return camera;
    });

    setCameras(updatedCameras);
  };

  const handleOpenVideoFeed = (url, size_MB, cameraName, type) => {
    setSelectedVideoInfo({
      url,
      size_MB,
      cameraName,
      type,
    });
  };

  const selectedCameraData = cameras.find(
    (camera) => camera.camera_name === selectedCamera.camera_name
  );

  const renderVideoList = (videos, type) => {
    return videos.length === 0 ? (
      <p className="text-gray-600">No {type} available.</p>
    ) : (
      videos.map((video, idx) => {
        const [key, value] = Object.entries(video)[0];
        return (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <p className="font-semibold text-gray-800">{`${
              type.charAt(0).toUpperCase() + type.slice(1)
            } ID: ${key}`}</p>
            <p className="text-sm text-gray-600">
              View:{" "}
              <button
                className="text-blue-500 underline hover:text-blue-600 transition-colors duration-300"
                onClick={() =>
                  handleOpenVideoFeed(
                    value.url,
                    value.size_MB,
                    selectedCamera.camera_name,
                    type
                  )
                }
              >
                Open Video Feed
              </button>
            </p>
            <button
              onClick={() =>
                handleDeleteVideo(
                  cameras.findIndex(
                    (camera) =>
                      camera.camera_name === selectedCamera.camera_name
                  ),
                  key,
                  type
                )
              }
              className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2 hover:bg-red-600 transition-colors duration-300"
            >
              <FaTrash className="inline mr-2" />
              Delete {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
        );
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          User ID: {initialUserData.userId}
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Total Data Size: {initialUserData.total_size_MB} MB
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-8">
          {cameras.map((camera, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-md ${
                selectedCamera.camera_name === camera.camera_name
                  ? "bg-moon-blue text-moon-light"
                  : "bg-moon-light text-moon-dark hover:bg-moon-grey hover:text-moon-dark"
              }`}
              onClick={() => handleCameraChange(camera.camera_name)}
            >
              {camera.camera_name}
            </button>
          ))}
        </div>

        {selectedVideoInfo ? (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Selected Video Feed
            </h3>
            <p className="text-md font-semibold text-gray-600">
              Camera: {selectedVideoInfo.cameraName}
            </p>
            <p className="text-md text-gray-600">
              Type: {selectedVideoInfo.type}
            </p>
            <p className="text-md text-gray-600">
              Size: {selectedVideoInfo.size_MB} MB
            </p>
            <CameraField url={selectedVideoInfo.url} />
            <button
              onClick={() => setSelectedVideoInfo(null)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Back to Camera Live Stream
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full h-64 sm:h-96 lg:h-[600px]">
              <iframe
                className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                src={selectedCamera.url_live}
                scrolling="no"
                allowFullScreen
              ></iframe>
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleStartRecording}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                <FaPlay className="inline mr-2" />
                Start Recording
              </button>
              <button
                onClick={handleStopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                <FaStop className="inline mr-2" />
                Stop Recording
              </button>
            </div>

            <div className="w-full mt-4">
              <button
                onClick={() => setLast24Open(!isLast24Open)}
                className="flex items-center w-full justify-between px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors duration-300"
              >
                <span className="font-semibold">Last 24 Hours</span>
                {isLast24Open ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {isLast24Open && (
                <div className="mt-4 flex justify-center items-center space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-md">
                    <CameraField url={ selectedCamera.rtmpUrl} />
                   
                  </div>
                </div>
              )}
            </div>

            <div className="w-full mt-8">
              <button
                onClick={() => setDetectionOpen(!isDetectionOpen)}
                className="flex items-center w-full justify-between px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors duration-300"
              >
                <span className="font-semibold">Detection Records</span>
                {isDetectionOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {isDetectionOpen && (
                <div className="mt-4 space-y-4">
                  {renderVideoList(selectedCamera.detection, "detection")}
                </div>
              )}
            </div>

            <div className="w-full mt-4">
              <button
                onClick={() => setRecordingsOpen(!isRecordingsOpen)}
                className="flex items-center w-full justify-between px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors duration-300"
              >
                <span className="font-semibold">Recordings</span>
                {isRecordingsOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {isRecordingsOpen && (
                <div className="mt-4 space-y-4">
                  {renderVideoList(selectedCamera.recordings, "recording")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingsManager;
