import React, { useState } from "react";
import CameraField from "components/CameraPlace/cameraField"; // Mock CameraField component

const CamerasSpace = () => {
  const initialUserData = {
    userId: "user1",
    total_size_MB: 19.53,
    cameras: [
      {
        live_url:
          "http://192.168.1.12:80/database/user1/camera/detection/camera_17-08-24-15-45-24/cam.m3u8",
        camera_name: "camera",
        detection: [
          {
            "camera_17-08-24-15-45-24": {
              url: "http://192.168.1.12:80/database/user1/camera/detection/camera_17-08-24-15-45-24/cam.m3u8",
              size_MB: 7.29,
            },
          },
        ],
        recordings: [
          {
            "camera_17-08-24-15-36-25": {
              url: "http://192.168.1.12:80/database/user1/camera/recordings/camera_17-08-24-15-36-25/cam.m3u8",
              size_MB: 4.95,
            },
          },
          {
            "camera_17-08-24-15-45-24": {
              url: "http://192.168.1.12:80/database/user1/camera/recordings/camera_17-08-24-15-45-24/cam.m3u8",
              size_MB: 7.29,
            },
          },
        ],
        total_size_MB: 19.53,
      },
      // other cameras...
    ],
  };

  const [selectedCamera, setSelectedCamera] = useState(
    initialUserData.cameras[0].camera_name
  );
  const [isDetectionOpen, setDetectionOpen] = useState(false);
  const [isRecordingsOpen, setRecordingsOpen] = useState(false);
  const [cameras, setCameras] = useState(initialUserData.cameras);
  const [selectedVideoInfo, setSelectedVideoInfo] = useState(null);

  const handleCameraChange = (cameraName) => {
    setSelectedCamera(cameraName);
    setDetectionOpen(false);
    setRecordingsOpen(false);
    setSelectedVideoInfo(null);
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
    (camera) => camera.camera_name === selectedCamera
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
            className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <p className="font-semibold text-gray-800">{`${
              type.charAt(0).toUpperCase() + type.slice(1)
            } ID: ${key}`}</p>
            <p className="text-sm text-gray-600">
              View:{" "}
              <button
                className="text-blue-500 underline"
                onClick={() =>
                  handleOpenVideoFeed(
                    value.url,
                    value.size_MB,
                    selectedCamera,
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
                    (camera) => camera.camera_name === selectedCamera
                  ),
                  key,
                  type
                )
              }
              className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2 hover:bg-red-600 transition-colors duration-300"
            >
              Delete {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
        );
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">



      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          User ID: {initialUserData.userId}
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Total Data Size: {initialUserData.total_size_MB} MB
        </p>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Cameras Data Overview
        </h1>
        <div className="flex flex-wrap space-x-4 mb-8">
          {cameras.map((camera, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-300 ${
                selectedCamera === camera.camera_name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          
          <div className="flex flex-col items-center" >


        <div className="relative w-full">
          <iframe
            className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
            src="http://localhost:8889/source"
            scrolling="no"
            allowFullScreen
          ></iframe>
        </div>



        
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleStartRecording}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                Start Recording
              </button>
              <button
                onClick={handleStopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Stop Recording
              </button>
            </div>
          </div>
        )}

        <VideoSection
          title="Recordings"
          isOpen={isRecordingsOpen}
          onToggle={() => setRecordingsOpen(!isRecordingsOpen)}
          extraClasses="mt-6"
        >
          {renderVideoList(selectedCameraData.recordings, "recordings")}
        </VideoSection>

        <VideoSection
          title="Detection"
          isOpen={isDetectionOpen}
          onToggle={() => setDetectionOpen(!isDetectionOpen)}
          extraClasses="mt-6"
        >
          {renderVideoList(selectedCameraData.detection, "detection")}
        </VideoSection>
      </div>
    </div>
  );
};

const VideoSection = ({
  title,
  isOpen,
  onToggle,
  children,
  extraClasses = "",
}) => {
  return (
    <div className={`w-full lg:w-[700px] mx-auto ${extraClasses}`}>
      <div
        className="flex justify-between items-center cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md mb-4"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`text-gray-500 ${isOpen ? "rotate-180" : ""}`}>
          &#9660;
        </span>
      </div>
      {isOpen && <div className="p-4 bg-white rounded-lg shadow-md">{children}</div>}
    </div>
  );
};

export default CamerasSpace;
