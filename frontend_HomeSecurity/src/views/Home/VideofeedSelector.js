// /* eslint-disable jsx-a11y/iframe-has-title */
// import React, { useState } from "react";
// import MqttVideoReceiver from "./mqttVideoReceiver";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faPlay,
//   faStop,
//   faBell,
//   faBellSlash,
//   faExclamationTriangle,
//   faLightbulb,
// } from "@fortawesome/free-solid-svg-icons";

// const cameraData = {
//   userID: "user1",
//   cameras: [
//     {
//       cameraID: "camera1",
//       detection_mode: "off",
//       total_duration: "1 hour 15 minutes",
//       topic: "admin/camera1/detectmode/publishedframe",
//       detection_periods: [
//         {
//           start_time: "2024-08-21 13:00:00",
//           end_time: "2024-08-21 13:30:00",
//           duration_seconds: "30 minutes",
//         },
//         {
//           start_time: "2024-08-22 14:00:00",
//           end_time: "2024-08-22 14:45:00",
//           duration_seconds: "45 minutes",
//         },
//       ],
//     },
//     {
//       cameraID: "camera2",
//       detection_mode: "on",
//       total_duration: "30 minutes",
//       topic: "admin/camera1/detectmode/publishedframe",
//       detection_periods: [
//         {
//           start_time: "2024-08-23 09:00:00",
//           end_time: "2024-08-23 09:30:00",
//           duration_seconds: "30 minutes",
//         },
//       ],
//     },
//   ],
// };

// const VideoFeedSelector = () => {
//   const [trackingMode, setTrackingMode] = useState(false);
//   const [selectedCamera, setSelectedCamera] = useState(null);
//   const [smartRecording, setSmartRecording] = useState(false);
//   const [notifications, setNotifications] = useState(false);
//   const [autoAlarm, setAutoAlarm] = useState(false);
//   const [lighting, setLighting] = useState(false);

//   const toggleTrackingMode = () => {
//     setTrackingMode((prevState) => !prevState);
//   };

//   const handleCameraSelect = (camera) => {
//     setSelectedCamera(camera);
//   };

//   const toggleSmartRecording = () => {
//     setSmartRecording((prevState) => !prevState);
//   };

//   const toggleNotifications = () => {
//     setNotifications((prevState) => !prevState);
//   };

//   const toggleAutoAlarm = () => {
//     setAutoAlarm((prevState) => !prevState);
//   };

//   const toggleLighting = () => {
//     setLighting((prevState) => !prevState);
//   };

//   return (
//     <div className="video-feed-selector p-4 md:p-6">
//       {/* Camera Selection Navbar */}
//       <nav className="bg-gray-100 p-3 md:p-4 shadow-md rounded-t-lg mb-6">
//         <h2 className="text-lg md:text-xl font-semibold mb-4">Select Camera</h2>
//         <div className="flex flex-wrap space-x-2 md:space-x-4">
//           {cameraData.cameras.map((camera) => (
//             <button
//               key={camera.cameraID}
//               className={`px-3 py-2 md:px-4 md:py-2 rounded-lg ${
//                 selectedCamera?.cameraID === camera.cameraID
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//               onClick={() => handleCameraSelect(camera)}
//             >
//               Camera {camera.cameraID}
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Camera Details and Controls */}
//       {selectedCamera && (
//         <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
//           <div>
//           <iframe src="http://localhost:8889/source" width="600"  height="400" scrolling="no" ></iframe>
//           </div>
//           {/* Controls */}
//           <div className="bg-white shadow-md rounded-lg p-4 md:p-6 space-y-4">
//             <h3 className="text-md md:text-lg font-semibold mb-4">
//               Camera Controls
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
//               <button
//                 className={`flex items-center justify-center px-4 py-2 rounded-lg ${
//                   smartRecording
//                     ? "bg-red-500 text-white"
//                     : "bg-green-500 text-white"
//                 }`}
//                 onClick={toggleSmartRecording}
//               >
//                 <FontAwesomeIcon
//                   icon={smartRecording ? faStop : faPlay}
//                   className="mr-2"
//                 />
//                 {smartRecording
//                   ? "Deactivate Smart Recording"
//                   : "Activate Smart Recording"}
//               </button>
//               <button
//                 className={`flex items-center justify-center px-4 py-2 rounded-lg ${
//                   notifications
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//                 onClick={toggleNotifications}
//               >
//                 <FontAwesomeIcon
//                   icon={notifications ? faBellSlash : faBell}
//                   className="mr-2"
//                 />
//                 {notifications
//                   ? "Disable Notifications"
//                   : "Enable Notifications"}
//               </button>
//               <button
//                 className={`flex items-center justify-center px-4 py-2 rounded-lg ${
//                   autoAlarm
//                     ? "bg-red-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//                 onClick={toggleAutoAlarm}
//               >
//                 <FontAwesomeIcon
//                   icon={autoAlarm ? faExclamationTriangle : faBell}
//                   className="mr-2"
//                 />
//                 {autoAlarm ? "Deactivate Auto Alarm" : "Activate Auto Alarm"}
//               </button>
//               <button
//                 className={`flex items-center justify-center px-4 py-2 rounded-lg ${
//                   lighting
//                     ? "bg-yellow-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//                 onClick={toggleLighting}
//               >
//                 <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
//                 {lighting ? "Turn Off Lights" : "Turn On Lights"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoFeedSelector;
