import React, { useState, useEffect } from 'react';

const sampleNotifications = [
  { id: 1, type: 'Motion Detection', message: 'Motion detected at the front door.', timestamp: '2024-08-27 12:34:56' },
  { id: 2, type: 'Facial Recognition', message: 'Person identified as Mahdi.', timestamp: '2024-08-27 12:35:30' },
  { id: 3, type: 'Intrusion Detection', message: 'Description at time and details about the intrusion...', timestamp: '2024-08-27 12:37:00' },
];

console.log(sampleNotifications);


const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(sampleNotifications);
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-moon-blue mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-moon-grey">No notifications available.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="p-4 bg-moon-light border border-moon-grey rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-moon-light-blue">{notification.type}</span>
                <span className="text-sm text-moon-grey">{notification.timestamp}</span>
              </div>
              <p className="text-moon-dark">{notification.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
