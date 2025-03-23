import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCamera, FaCog, FaUser, FaHome, FaBell, FaSignOutAlt } from 'react-icons/fa';
import CollapsibleSection from './CollapsibleSection'; // Adjust path as needed
import FaceRecognitionIcon from "assets/icons/FaceRecognitionIcon";
import { doSignOut } from '../../firebase/auth'
import camIcon from "assets/img/securitycam.png"

export default function AuthSidebar() {
  const navigate = useNavigate(); 
  const handleSignOut = async () => {
    try {
      await doSignOut();
      console.log("ok");
      navigate('/auth/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  return (
    <div className="relative flex flex-col justify-between w-full min-h-[80vh] max-w-[20rem] rounded-xl bg-moon-light bg-clip-border p-4 text-moon-dark shadow-xl shadow-moon-dark/10">
      {/* Header */}

      {/* Navigation */}
      <nav className="flex flex-col ml-2 gap-1 p-2 font-sans text-base font-normal text-moon-dark">
      <h1 className="text-xl font-bold">Welcome, Mahdi</h1>
        
        {/* <CollapsibleSection title="Admin Dashboard" icon={<FaHome />}>
          <div className="flex flex-col gap-1">
            <Link to="/admin/dashboard" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              Users
            </Link>
            <Link to="/admin/analytics" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              Analytics
            </Link>
            <Link to="/admin/settings" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              Settings
            </Link>
          </div>
        </CollapsibleSection> */}

        <CollapsibleSection title="Camera Space" icon={<img src={camIcon} className='w-6' alt="icon" />}>
          <div className="flex flex-col gap-1">
            <Link to="/home/Camerasspace/Recordings" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              Recordings
            </Link>
            <Link to="/home/Camerasspace/security-mode" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              Security Mode MQTT
            </Link>
            <Link to="/home/Camerasspace/security-mode-rtsp" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              Security Mode RTSP
            </Link>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Face recognition" icon={<FaceRecognitionIcon />}>
          <div className="flex flex-col gap-1">
            <Link to="/home/face_recognition/liveFaceRecognition" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              Live Face Recognition
            </Link>
            <Link to="/home/face_recognition/registerNewMember" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              Register New Member
            </Link>
            <Link to="/home/face_recognition/listMembers" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
              List Members
            </Link>
          </div>
        </CollapsibleSection>

        <Link to="/home/notifications" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
          <div className="grid mr-4 place-items-center">
            <FaBell />
          </div>
          Notifications
          <div className="grid ml-auto place-items-center justify-self-end">
            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-moon-blue text-moon-light">
              <span>14</span>
            </div>
          </div>
        </Link>

        <Link to="/home/profile" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
          <div className="grid mr-4 place-items-center">
            <FaUser />
          </div>
          Profile
        </Link>

        <Link to="/home/settings" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
          <div className="grid mr-4 place-items-center">
            <FaCog />
          </div>
          Settings
        </Link>
      </nav>

      {/* Footer */}
      <footer className="mt-4 text-center">
        <button  onClick={handleSignOut} className="flex items-center justify-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-opacity-80 hover:text-moon-dark focus:bg-moon-grey focus:bg-opacity-80 focus:text-moon-dark active:bg-moon-grey active:bg-opacity-80 active:text-moon-dark">
          <div className="grid mr-4 place-items-center">
            <FaSignOutAlt />
          </div>
          Log Out
        </button>
        <p className="mt-2 text-sm text-gray-500">© 2024 Smart Home Security</p>
      </footer>
    </div>
  );
}
