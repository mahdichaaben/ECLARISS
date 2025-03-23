import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Index from "./views/Index";
import Auth from "./layouts/Auth";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";

import HomeSpaceLayout from "./layouts/HomeSpaceLayout";
import LiveFaceRecognition from "views/Home/LiveFaceRecognition";
import RegisterNewMember from "views/Home/RegisterNewMember";
import ListMembers from "views/Home/ListMembers";
import LivePersonDetection from "views/Home/LivePersonDetection";
import CamerasSpace from "views/Home/CamerasSpace";
import VideofeedSelector from "views/Home/VideofeedSelector"
import SettingsHome from "views/Home/settingHome";
import Live from "views/Home/liveStream/live";
import FacerecognitionLayout from "./layouts/FacerecognitionLayout"
import LiveFeedRecognition from "views/Home/fecerecognitionSpace/LiveFeedRecognition";
import Members from "views/Home/fecerecognitionSpace/Members"
import NewMemberRegister from "views/Home/fecerecognitionSpace/NewMemberRegister"

import LiveFeedDetection from "views/Home/camerasspace/LiveFeedDetection"

import LiveFeedDetectionrtsp from "views/Home/camerasspace/LiveFeedDetectionrtsp"
import RecordingsManager from "views/Home/camerasspace/RecordingsManager"
import BillingAndSubscription from "views/Home/camerasspace/BillingAndSubscription";
import CamerasSpaceLayout from "./layouts/CamerasSpaceLayout"
import NotificationPage from "views/Notifications";
import ProfilePage from "views/ProfilePage";
import RecordingsManager1 from "views/Home/camerasspace/RecordingsManager1";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },

  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "login", // Relative path, no need for "/auth"
        element: <Login />,
      },
      {
        path: "register", // Relative path, no need for "/auth"
        element: <Register />,
      }
    ]
  },

  {
    path: "/home",
    element: <HomeSpaceLayout />, // Home layout with sublinks
    children: [

      {
        path: "profile",
        element: <ProfilePage/>,
      },

      {
        path:"notifications",
        element: <NotificationPage />

      },

      {
        path: "face_recognition",
        element: <FacerecognitionLayout />,

        children: [

    

          {
            path:"liveFaceRecognition",
            element: <LiveFeedRecognition />

          },

          {
            path: "registerNewMember",
            element: <NewMemberRegister />,

          },

          {
            path: "listMembers",
            element: <Members />,
          },
        ]


      },



      {
        path: "Camerasspace", 
        element: <CamerasSpaceLayout />,

        children: [

          {
            path:"Recordings",
            element: <RecordingsManager1/>

          },

          {
            path: "security-mode",
            element: <LiveFeedDetection />,

          },

          {
            path: "security-mode-rtsp",
            element: <LiveFeedDetectionrtsp />,

          },

      


        ],
      },


      {
        path: "settings",
        element: <SettingsHome />,
      },

      
      {
        path: "billing",
        element: <BillingAndSubscription />,
      },
    ],
  },



  {
    path: "/landing",
    element: <Index />,
  }
]);

export default router;