import React, { useState, useEffect } from "react";

const LiveFeed = ({ streamUrl, feedName }) => {
  const [videoSrc, setVideoSrc] = useState(`${streamUrl}?t=${new Date().getTime()}`);

  useEffect(() => {
    const interval = setInterval(() => {
      // Add a timestamp query parameter to force reload the image
      setVideoSrc(`${streamUrl}?t=${new Date().getTime()}`);
    }, 5000); 

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [streamUrl]);

  return (
    <div className="flex flex-wrap">
      {/* Add the video feed */}
      <div className="w-full ">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-lg text-blueGray-700">
                  {feedName}
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            {/* Live video feed */}
            <img
              src={videoSrc}
              alt={feedName}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
