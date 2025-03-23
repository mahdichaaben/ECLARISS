import React, { useState } from "react";

export default function Settings() {
  // Example states for camera, door, alarm, security mode, and lights
  const [cameras, setCameras] = useState({
    camera1: true,
    camera2: false,
    camera3: true,
  });
  const [doorOpen, setDoorOpen] = useState(false);
  const [alarmActive, setAlarmActive] = useState(true);
  const [securityMode, setSecurityMode] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);

  // Handler functions
  const handleCameraToggle = (camera) => {
    setCameras((prev) => ({
      ...prev,
      [camera]: !prev[camera],
    }));
  };

  const handleDoorToggle = () => {
    setDoorOpen((prev) => !prev);
  };

  const handleAlarmToggle = () => {
    setAlarmActive((prev) => !prev);
  };

  const handleSecurityModeToggle = () => {
    setSecurityMode((prev) => !prev);
  };

  const handleLightsToggle = () => {
    setLightsOn((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Settings</h6>
          <button
            className="bg-lightBlue-500  active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          {/* Camera Controls */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Cameras
          </h6>
          <div className="flex flex-wrap">
            {Object.keys(cameras).map((camera, index) => (
              <div key={index} className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3 flex items-center justify-between">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor={`camera-${index}`}
                  >
                    {`Camera ${index + 1}`}
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      id={`camera-${index}`}
                      type="checkbox"
                      className="form-checkbox border-0 rounded text-lightBlue-500 ml-2 w-6 h-6 ease-linear transition-all duration-150"
                      checked={cameras[camera]}
                      onChange={() => handleCameraToggle(camera)}
                    />
                    <span className="ml-2">{cameras[camera] ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* Door Controls */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Door Controls
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <button
                  onClick={handleDoorToggle}
                  className={`bg-${doorOpen ? 'red' : 'green'}-500  font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150`}
                  type="button"
                >
                  {doorOpen ? 'Close Door' : 'Open Door'}
                </button>
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* Alarm Controls */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Alarm Controls
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 flex items-center justify-between">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox border-0 rounded text-lightBlue-500 ml-2 w-6 h-6 ease-linear transition-all duration-150"
                    checked={alarmActive}
                    onChange={handleAlarmToggle}
                  />
                  <span className="ml-2">Activate Alarm</span>
                </label>
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* Security Mode Controls */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Security Mode
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 flex items-center justify-between">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox border-0 rounded text-lightBlue-500 ml-2 w-6 h-6 ease-linear transition-all duration-150"
                    checked={securityMode}
                    onChange={handleSecurityModeToggle}
                  />
                  <span className="ml-2">Activate Security Mode</span>
                </label>
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* Light Controls */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Lights
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3 flex items-center justify-between">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox border-0 rounded text-lightBlue-500 ml-2 w-6 h-6 ease-linear transition-all duration-150"
                    checked={lightsOn}
                    onChange={handleLightsToggle}
                  />
                  <span className="ml-2">Turn Lights {lightsOn ? 'Off' : 'On'}</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
