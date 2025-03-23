import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import MqttClient from './mqttClient'; // Adjust the import path if necessary

const defaultCamera = {
  deviceName: process.env.REACT_APP_DEFAULT_CAMERA_NAME,
  cameraID: process.env.REACT_APP_DEFAULT_CAMERA_ID,
  status: JSON.parse(process.env.REACT_APP_DEFAULT_CAMERA_STATUS),
  smartMode: JSON.parse(process.env.REACT_APP_DEFAULT_CAMERA_SMART_MODE),
};

const defaultDevice = {
  deviceName: process.env.REACT_APP_DEFAULT_DEVICE_NAME,
  deviceID: process.env.REACT_APP_DEFAULT_DEVICE_ID,
  status: JSON.parse(process.env.REACT_APP_DEFAULT_DEVICE_STATUS),
};

const defaultDevice2 = {
  deviceName: process.env.REACT_APP_DEFAULT_DEVICE2_NAME,
  deviceID: process.env.REACT_APP_DEFAULT_DEVICE2_ID,
  status: JSON.parse(process.env.REACT_APP_DEFAULT_DEVICE2_STATUS),
};

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    wifiName: process.env.REACT_APP_WIFI_NAME,
    wifiPassword: process.env.REACT_APP_WIFI_PASSWORD,
    raspberryPiURL: process.env.REACT_APP_RASPBERRY_PI_URL,
    webrtcServerURL: process.env.REACT_APP_WEBRTC_SERVER_URL,
    rtmpServerURL: process.env.REACT_APP_RTMP_SERVER_URL,
    recordingserverURL: process.env.REACT_APP_RECORDINGSERVER_URL,
    processingbrokerURL: process.env.REACT_APP_PROCESSINGBROKER_URL,
    cloudbrokerURL: process.env.REACT_APP_CLOUDBROKER_URL,
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
    clientID: process.env.REACT_APP_CLIENT_ID,
    cameras: [defaultCamera],
    devices: [defaultDevice, defaultDevice2],
  });

  const mqttClient = useMemo(() => new MqttClient(
    settings.cloudbrokerURL,
    settings.username,
    settings.password,
    settings.clientID
  ), [settings.cloudbrokerURL, settings.username, settings.password, settings.clientID]);

  const initializeMqttClient = useCallback(() => {
    mqttClient.initialize();
    settings.cameras.forEach(camera => {
      mqttClient.subscribeToTopic(`camera/${camera.cameraID}/status`);
      mqttClient.subscribeToTopic(`camera/${camera.cameraID}/smartMode`); // Subscribe to smart mode topic
    });
    settings.devices.forEach(device => mqttClient.subscribeToTopic(`device/${device.deviceID}/status`));

    mqttClient.client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        const isCameraTopic = topic.startsWith('camera/');
        const isDeviceTopic = topic.startsWith('device/');

        if (isCameraTopic) {
          const [prefix, cameraID, property] = topic.split('/');
          if (property === 'status') {
            setSettings(prevSettings => ({
              ...prevSettings,
              cameras: prevSettings.cameras.map(camera =>
                camera.cameraID === cameraID ? { ...camera, status: data.status } : camera
              ),
            }));
          } else if (property === 'smartMode') {
            setSettings(prevSettings => ({
              ...prevSettings,
              cameras: prevSettings.cameras.map(camera =>
                camera.cameraID === cameraID ? { ...camera, smartMode: data.smartMode } : camera
              ),
            }));
          }
        } else if (isDeviceTopic) {
          const deviceID = topic.split('/')[1];
          setSettings(prevSettings => ({
            ...prevSettings,
            devices: prevSettings.devices.map(device =>
              device.deviceID === deviceID ? { ...device, status: data.status } : device
            ),
          }));
        }
      } catch (error) {
        console.error('Error handling MQTT message:', error);
      }
    });
  }, [mqttClient, settings]);

  useEffect(() => {
    initializeMqttClient();
    return () => {
      mqttClient.client.end();
    };
  }, [initializeMqttClient, mqttClient]);

  const updateCameraStatus = (cameraID, status) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      cameras: prevSettings.cameras.map(camera =>
        camera.cameraID === cameraID ? { ...camera, status } : camera
      ),
    }));
    mqttClient.publishMessage(`camera/${cameraID}/status`, JSON.stringify({ status }));
  };

  const updateDeviceStatus = (deviceID, status) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      devices: prevSettings.devices.map(device =>
        device.deviceID === deviceID ? { ...device, status } : device
      ),
    }));
    mqttClient.publishMessage(`device/${deviceID}/status`, JSON.stringify({ status }));
  };

  const updateCameraSmartMode = (cameraID, smartMode) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      cameras: prevSettings.cameras.map(camera =>
        camera.cameraID === cameraID ? { ...camera, smartMode } : camera
      ),
    }));
    mqttClient.publishMessage(`camera/${cameraID}/smartMode`, JSON.stringify({ smartMode }));
  };

  const updateSetting = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const addCamera = (camera) => {
    setSettings(prevSettings => {
      const newCameras = [...prevSettings.cameras, camera];
      mqttClient.subscribeToTopic(`camera/${camera.cameraID}/status`);
      mqttClient.subscribeToTopic(`camera/${camera.cameraID}/smartMode`); // Subscribe to new camera smart mode topic
      return { ...prevSettings, cameras: newCameras };
    });
  };

  const removeCamera = (cameraID) => {
    setSettings(prevSettings => {
      const newCameras = prevSettings.cameras.filter(camera => camera.cameraID !== cameraID);
      return { ...prevSettings, cameras: newCameras };
    });
  };

  const updateCamera = (cameraID, updatedCamera) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      cameras: prevSettings.cameras.map(camera =>
        camera.cameraID === cameraID ? updatedCamera : camera
      ),
    }));
  };

  const addDevice = (device) => {
    setSettings(prevSettings => {
      const newDevices = [...prevSettings.devices, device];
      mqttClient.subscribeToTopic(`device/${device.deviceID}/status`);
      return { ...prevSettings, devices: newDevices };
    });
  };

  const removeDevice = (deviceID) => {
    setSettings(prevSettings => {
      const newDevices = prevSettings.devices.filter(device => device.deviceID !== deviceID);
      return { ...prevSettings, devices: newDevices };
    });
  };

  const updateDevice = (deviceID, updatedDevice) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      devices: prevSettings.devices.map(device =>
        device.deviceID === deviceID ? updatedDevice : device
      ),
    }));
  };

  const value = useMemo(() => ({
    settings,
    updateSetting,
    addCamera,
    removeCamera,
    updateCamera,
    updateCameraStatus,
    updateCameraSmartMode, 
    addDevice,
    removeDevice,
    updateDevice,
    updateDeviceStatus
  }), [settings, mqttClient]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
