import React, { useState, useEffect } from "react";
import CameraField from "components/CameraPlace/cameraField"; // Mock CameraField component
import { useSettings } from "context/SettingsContext";
import CameraNavigation from "./CameraNavigation";
import {
  FaPlay,
  FaStop,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const VideoList = ({ videos, type, onOpenVideoFeed, onDeleteVideo }) => (
  <div className="space-y-4">
    {videos.length === 0 ? (
      <p className="text-gray-600">No {type} available.</p>
    ) : (
      videos.map((video, idx) => {
        const [key, value] = Object.entries(video)[0];
        return (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">{`${
                type.charAt(0).toUpperCase() + type.slice(1)
              } ID: ${key}`}</p>
              <p className="text-sm text-gray-600">
                View:{" "}
                <button
                  className="text-blue-500 underline hover:text-blue-600 transition-colors duration-300"
                  onClick={() =>
                    onOpenVideoFeed(
                      value.url,
                      value.size_MB,
                      value.cameraID,
                      type
                    )
                  }
                >
                  Open Video Feed
                </button>
              </p>
            </div>
            <button
              onClick={() => onDeleteVideo(key, type)}
              className=" text-moon-dark rounded-lg transition-colors duration-300"
            >
              <FaTrash className="inline mr-2" />
            </button>
          </div>
        );
      })
    )}
  </div>
);

const RecordingsManager1 = () => {
  const { settings } = useSettings();
  const recordingserverURL = settings.recordingserverURL;

  const [selectedCamera, setSelectedCamera] = useState({});
  const [isRecordingsOpen, setRecordingsOpen] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [selectedVideoInfo, setSelectedVideoInfo] = useState(null);
  const [userId, setUserId] = useState("user1"); // Default userId or retrieve dynamically
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${recordingserverURL}/get_user_data/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setCameras(data.cameras || []);
        setSelectedCamera(data.cameras ? data.cameras[0] : null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, recordingserverURL]);

  const handleCameraChange = (cameraID) => {
    const camera = cameras.find((cam) => cam.cameraID === cameraID);
    if (camera) {
      setSelectedCamera(camera);
      setRecordingsOpen(false);
      setSelectedVideoInfo(null);
    }
  };

  const handleStartRecording = async () => {
    try {
      const response = await fetch(`${recordingserverURL}/start_recording`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cameraID: selectedCamera.cameraID }),
      });
      if (!response.ok) throw new Error("Failed to start recording");
      const result = await response.json();
      console.log("Recording started:", result);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const response = await fetch(`${recordingserverURL}/stop_recording`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cameraID: selectedCamera.cameraID }),
      });
      if (!response.ok) throw new Error("Failed to stop recording");
      const result = await response.json();
      console.log("Recording stopped:", result);
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const handleDeleteVideo = async (videoKey, type) => {
    try {
      const response = await fetch(`${recordingserverURL}/delete_stream`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cameraID: selectedCamera.cameraID,
          stream_type: type,
          stream_name: videoKey,
        }),
      });
      if (!response.ok) throw new Error("Failed to delete stream");
      const result = await response.json();
      console.log("Stream deleted:", result);
      setCameras((prevCameras) =>
        prevCameras.map((camera) =>
          camera.cameraID === selectedCamera.cameraID
            ? {
                ...camera,
                [type]: camera[type].filter(
                  (video) => !Object.keys(video).includes(videoKey)
                ),
              }
            : camera
        )
      );
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleOpenVideoFeed = (url, size_MB, cameraID, type) => {
    setSelectedVideoInfo({ url, size_MB, cameraID, type });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-moon-light text-moon-dark rounded-lg shadow-lg">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          User ID: {userId}
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Total Data Size:{" "}
          {cameras.reduce((total, camera) => total + camera.total_size_MB, 0)}{" "}
          MB
        </p>

        <CameraNavigation
          cameras={cameras}
          selectedCameraID={selectedCamera.cameraID}
          onSelect={handleCameraChange}
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex w-full flex-col md:flex-row">
          {selectedVideoInfo ? (
            <div className="w-full max-w-xl mx-auto mb-8">
              <div className="flex-1">
              <p className="text-lg text-gray-700">
                  <span className="font-medium text-gray-600">{selectedVideoInfo.recodingID}</span>{" "}
                  
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-medium text-gray-600">Type:</span>{" "}
                  {selectedVideoInfo.type}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-medium text-gray-600">Size:</span>{" "}
                  {selectedVideoInfo.size_MB} MB
                </p>
              </div>
              <CameraField url={selectedVideoInfo.url} />
            </div>
          ) : (
            <div className="w-full max-w-xl mx-auto mb-8">
              <div className="relative w-full h-64 sm:h-96">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-300"
                  title="Camera Feed"
                  src={selectedCamera.webrtcUrl}
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={
                    isRecording ? handleStopRecording : handleStartRecording
                  }
                  className={`px-4 py-2 rounded-lg text-white ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <FaStop className="inline mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <FaPlay className="inline mr-2" />
                      Start Recording
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          <div className=" w-full md:w-[40%] h-full">
            <button
              onClick={() => setRecordingsOpen(!isRecordingsOpen)}
              className="px-4 py-2 w-full rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300"
            >
              {isRecordingsOpen ? (
                <>
                  <FaChevronUp className="inline mr-2" />
                  Hide Recordings
                </>
              ) : (
                <>
                  <FaChevronDown className="inline mr-2" />
                  Show Recordings
                </>
              )}
            </button>

            {isRecordingsOpen && selectedCamera && (
              <div className="w-full max-w-xl mx-auto mt-4 space-y-6">
                <VideoList
                  videos={selectedCamera.recordings || []}
                  type="recording"
                  onOpenVideoFeed={handleOpenVideoFeed}
                  onDeleteVideo={handleDeleteVideo}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingsManager1;
