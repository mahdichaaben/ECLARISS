import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ url, width, height }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const loadHLS = (video, hlsUrl) => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      } else {
        console.error('HLS is not supported in this browser');
      }
    };

    if (video && url) {
      loadHLS(video, url);
    }

  }, [url]);

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      controls
      style={{ width:width, height:height, objectFit: 'cover' }}
    >
      Your browser does not support the video tag.
    </video>
  );
};

const CameraField = ({ url, width = "640", height = "360" }) => {
  return (
    <div>
      <VideoPlayer url={url} width={width} height={height} />
    </div>
  );
};

export default CameraField;
