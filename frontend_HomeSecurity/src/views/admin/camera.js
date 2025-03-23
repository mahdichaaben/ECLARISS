import React, { useState } from "react";
import HeaderStats from "components/Headers/HeaderStats";
// components
import CameraField from "components/CameraPlace/cameraField.js";

// import MqttComponent from "components/Mqtt/Mqttcomponent.js";
// import MqttFacerecog from "components/Mqtt/MqttFacerecog.js";
const cameraData = [
  { id: 1, name: "Front Door" },
  { id: 2, name: "Garden" },
  { id: 3, name: "Indoor Home" },
];

export default function Maps() {
  const [videoUrl, setVideoUrl] = useState("");
  const [activeCamera, setActiveCamera] = useState(null);


  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleCameraClick = (cameraId) => {
    setActiveCamera(cameraId);
    // Reset video URL for selected camera or fetch new URL
    setVideoUrl(""); 
  };

  const handleActivateDeactivate = () => {
    // Handle camera activation/deactivation logic
    console.log("Toggling camera", activeCamera);
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-blueGray-100 w-full mb-6 rounded">
            <div className="flex space-x-4 mb-4">
              {cameraData.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => handleCameraClick(camera.id)}
                  className={`px-4 py-2 rounded ${activeCamera === camera.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {camera.name}
                </button>
              ))}
            </div>

            {activeCamera && (
              <>
                <input
                  type="text"
                  placeholder="Enter video URL"
                  value={videoUrl}
                  onChange={handleUrlChange}
                  className="p-2 border rounded mb-4 w-full"
                />
          
                <CameraField url={videoUrl} />
              </>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Historical Movements</h3>
              {/* <MqttComponent/> */}
            </div>



            <h3 className="text-lg font-semibold mb-2">Historical recognition</h3>
           
            </div>
          </div>
        </div>
    </>
  );
}
