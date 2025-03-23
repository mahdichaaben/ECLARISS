import React, { useState, useEffect } from "react";
import LiveFeed from "components/CameraPlace/LiveFeed"

// Mockup of LiveFeed component


export default function LiveFaceRecognition() {
  // Static data for the live info
  const liveInfo = [
    { id: 1, name: "Front Door Camera", status: "Active" },
    { id: 2, name: "Garden Camera", status: "Active" },
    { id: 3, name: "Indoor Camera", status: "Inactive" },
  ];

  return (
    <>
    <div className="lg:w-">
    <LiveFeed
              streamUrl="http://192.168.1.13:8080/video_feed_face_recognition"
              feedName="Live Face Recognition"
              
            />

    </div>
  

      <div className="live-info">
        <h2>Live Feed Status</h2>
        <ul>
          {liveInfo.map((info) => (
            <li key={info.id}>
              <strong>{info.name}</strong> - {info.status}
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .live-feed {
          margin-bottom: 20px;
        }

        .live-feed video {
          width: 100%;
          height: auto;
        }

        .live-info {
          margin-top: 20px;
        }

        .live-info ul {
          list-style-type: none;
          padding: 0;
        }

        .live-info li {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }

        .live-info li:last-child {
          border-bottom: none;
        }
      `}</style>
    </>
  );
}
