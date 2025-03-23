import React from 'react';

const CameraNavigation = ({ cameras, selectedCameraID, onSelect }) => {
  return (
    <div className="flex overflow-x-auto bg-moon-light p-2 rounded-lg border border-moon-light-blue">
      {cameras.map((camera) => (
        <button
          key={camera.cameraID}
          onClick={() => onSelect(camera.cameraID)}
          className={`px-4 py-2 rounded-lg mx-1 whitespace-nowrap text-moon-dark ${
            selectedCameraID === camera.cameraID
              ? 'bg-moon-light-blue text-moon-light font-bold'
              : 'bg-moon-light text-moon-dark'
          } hover:bg-moon-light-blue   transition duration-300`}
        >
          {camera.deviceName || camera.cameraID}
        </button>
      ))}
    </div>
  );
};

export default CameraNavigation;
