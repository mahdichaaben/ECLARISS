import React, { useState } from 'react';
import { useSettings } from 'context/SettingsContext'; // Adjust import path if necessary

const SettingsHome = () => {
  const { 
    settings, 
    updateSetting, 
    addCamera, 
    removeCamera, 
    updateCamera, 
    updateCameraStatus, 
    addDevice, 
    removeDevice, 
    updateDevice, 
    updateDeviceStatus 
  } = useSettings();

  // State for managing form inputs
  const [newCamera, setNewCamera] = useState({ deviceName: '', cameraID: '', status: true });
  const [newDevice, setNewDevice] = useState({ deviceName: '', deviceID: '', status: true });

  // Handlers for form submissions
  const handleAddCamera = () => {
    addCamera(newCamera);
    setNewCamera({ deviceName: '', cameraID: '', status: true });
  };

  const handleAddDevice = () => {
    addDevice(newDevice);
    setNewDevice({ deviceName: '', deviceID: '', status: true });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* WiFi Settings Section */}
      <section className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">WiFi Settings</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="wifiName" className="block text-gray-700 mb-1">WiFi Name</label>
            <input
              id="wifiName"
              type="text"
              value={settings.wifiName}
              onChange={(e) => updateSetting('wifiName', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="wifiPassword" className="block text-gray-700 mb-1">WiFi Password</label>
            <input
              id="wifiPassword"
              type="password"
              value={settings.wifiPassword}
              onChange={(e) => updateSetting('wifiPassword', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
        </div>
      </section>

      {/* URL Settings Section */}
      <section className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">URL Settings</h2>
        <div className="flex flex-col flex-wrap md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="raspberryPiURL" className="block text-gray-700 mb-1">Raspberry Pi URL</label>
            <input
              id="raspberryPiURL"
              type="text"
              value={settings.raspberryPiURL}
              onChange={(e) => updateSetting('raspberryPiURL', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>


          <div className="flex-1">
            <label htmlFor="raspberryPiURL" className="block text-gray-700 mb-1">recordingserverURL</label>
            <input
              id="raspberryPiURL"
              type="text"
              value={settings.recordingserverURL}
              onChange={(e) => updateSetting('recordingserverURL', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="rtspServerURL" className="block text-gray-700 mb-1">webrtcServerURL</label>
            <input
              id="rtspServerURL"
              type="text"
              value={settings.webrtcServerURL}
              onChange={(e) => updateSetting('rtspServerURL', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="rtmpServerURL" className="block text-gray-700 mb-1">RTMP Server URL</label>
            <input
              id="rtmpServerURL"
              type="text"
              value={settings.rtmpServerURL}
              onChange={(e) => updateSetting('rtmpServerURL', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
        </div>
      </section>

      {/* MQTT Settings Section */}
      <section className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">MQTT Settings</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="cloudbrokerURL" className="block text-gray-700 mb-1">MQTT Broker URL</label>
            <input
              id="cloudbrokerURL"
              type="text"
              value={settings.cloudbrokerURL}
              onChange={(e) => updateSetting('cloudbrokerURL', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="username" className="block text-gray-700 mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={settings.username}
              onChange={(e) => updateSetting('username', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={settings.password}
              onChange={(e) => updateSetting('password', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="clientID" className="block text-gray-700 mb-1">Client ID</label>
            <input
              id="clientID"
              type="text"
              value={settings.clientID}
              onChange={(e) => updateSetting('clientID', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
        </div>
      </section>

      {/* Camera Management Section */}
      <section className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Manage Cameras</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="cameraDeviceName" className="block text-gray-700 mb-1">Camera Device Name</label>
            <input
              id="cameraDeviceName"
              type="text"
              value={newCamera.deviceName}
              onChange={(e) => setNewCamera(prev => ({ ...prev, deviceName: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="cameraID" className="block text-gray-700 mb-1">Camera ID</label>
            <input
              id="cameraID"
              type="text"
              value={newCamera.cameraID}
              onChange={(e) => setNewCamera(prev => ({ ...prev, cameraID: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <button 
            onClick={handleAddCamera}
            className="self-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Camera
          </button>
        </div>

        <ul>
          {settings.cameras.map(camera => (
            <li key={camera.cameraID} className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex-1">{camera.deviceName} - {camera.cameraID}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCameraStatus(camera.cameraID, !camera.status)}
                  className={`px-4 py-2 rounded-lg ${camera.status ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} hover:opacity-80`}
                >
                  {camera.status ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => removeCamera(camera.cameraID)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-80"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Device Management Section */}
      <section className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Manage Devices</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="deviceName" className="block text-gray-700 mb-1">Device Name</label>
            <input
              id="deviceName"
              type="text"
              value={newDevice.deviceName}
              onChange={(e) => setNewDevice(prev => ({ ...prev, deviceName: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="deviceID" className="block text-gray-700 mb-1">Device ID</label>
            <input
              id="deviceID"
              type="text"
              value={newDevice.deviceID}
              onChange={(e) => setNewDevice(prev => ({ ...prev, deviceID: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <button 
            onClick={handleAddDevice}
            className="self-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Device
          </button>
        </div>

        <ul>
          {settings.devices.map(device => (
            <li key={device.deviceID} className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex-1">{device.deviceName} - {device.deviceID}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateDeviceStatus(device.deviceID, !device.status)}
                  className={`px-4 py-2 rounded-lg ${device.status ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} hover:opacity-80`}
                >
                  {device.status ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => removeDevice(device.deviceID)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-80"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SettingsHome;
