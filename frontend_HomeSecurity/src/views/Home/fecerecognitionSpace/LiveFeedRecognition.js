import React, { useState } from "react";
import LiveFeed from "components/CameraPlace/LiveFeed";
import { Transition } from '@headlessui/react';
import { useSettings } from 'context/SettingsContext'; // Import the custom hook

// Mock historical attendance data
const historicalData = [
  { timestamp: "2024-08-24 09:00:00", faces: { "John Doe": ["2024-08-24 09:00:00"], "Jane Smith": ["2024-08-24 09:00:00"] } },
  { timestamp: "2024-08-24 10:00:00", faces: { "John Doe": ["2024-08-24 10:05:00"], "Unknown": ["2024-08-24 10:10:00"] } },
];

export default function LiveFeedRecognition() {
  const [isDetailed, setIsDetailed] = useState(false);
  const [filteredData, setFilteredData] = useState(historicalData);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLightOn, setIsLightOn] = useState(false);
  
  // Use the context
  const { settings } = useSettings();

  const toggleDetails = () => {
    setIsDetailed(!isDetailed);
  };

  const handleFilterChange = () => {
    if (startDate && endDate) {
      const filtered = historicalData.filter(entry => 
        new Date(entry.timestamp) >= new Date(startDate) && new Date(entry.timestamp) <= new Date(endDate)
      );
      setFilteredData(filtered);
    }
  };

  const handleAction = (action) => {
    // Implement the logic for each action (open door, lock door, control light)
    console.log(`Action: ${action}`);
  };

  const toggleLight = () => {
    setIsLightOn(!isLightOn);
    handleAction(isLightOn ? 'turnOffLight' : 'turnOnLight');
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="live-feed-container mb-6 rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <LiveFeed
          streamUrl={`${settings.raspberryPiURL}/video_feed_face_recognition`} // Use the URL from context
          feedName="Live Face Recognition"
        />
      </div>

      <div className="attendance-history">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Historical Attendance</h2>
          <button onClick={toggleDetails} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            {isDetailed ? "Hide Details" : "Show Details"}
          </button>
        </div>

        <Transition
          show={isDetailed}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            <div className="filter-container mb-6">
              <h2 className="font-semibold mb-2">Filter Historical Data</h2>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded-md"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded-md"
                />
                <button
                  onClick={handleFilterChange}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Apply Filter
                </button>
              </div>
            </div>
            <ul className="list-none p-0">
              {filteredData.length > 0 ? (
                filteredData.map((entry, index) => (
                  <li key={index} className="mb-4 p-4 border rounded-md bg-gray-100 shadow-md transition-transform transform hover:scale-105">
                    <strong className="block text-lg mb-2">{entry.timestamp}</strong>
                    <ul className="list-none p-0">
                      {Object.entries(entry.faces).map(([person, timestamps]) => (
                        <li key={person} className="py-1">
                          <strong>{person}:</strong> {timestamps.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              ) : (
                <p>No historical data available.</p>
              )}
            </ul>
          </div>
        </Transition>
      </div>
    </div>
  );
}
