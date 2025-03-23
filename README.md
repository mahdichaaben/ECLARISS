# Home Security System

A smart surveillance system integrating **Face Recognition**, **Real-time RTSP Streaming**, **Flask Backend**, and **Person Detection** using YOLO algorithms for efficient home monitoring.

---

## System Overview

1. **Face Recognition & Access Control**:
   - Raspberry Pi + Flask for user verification and access management.
   - Add/remove users and manage access permissions.

2. **Backend Using Flask**:
   - Triggers recording actions (start/stop recording).
   - Provides access to metadata for users.
   - Provides real-time live stream API links for each user.

3. **Real-time RTSP Streaming**:
   - **MediaMTX** for RTSP-to-WebRTC conversion, enabling real-time streaming.
   - **Nginx** for RTMP-to-HLS conversion, allowing recordings to be stored and accessed.

4. **Person Detection**:
   - Real-time video processing using **YOLO algorithms**.
   - Detects persons in video frames and triggers alerts when motion or people are detected.

5. **Flask Backend**:
   - Manages APIs for **Face Recognition**, **Person Detection**, and **Video Streaming**.
   - Handles user authentication and access control, using **Firebase Authentication**.

6. **MQTT Communication**:
   - **HiveMQ** is used to trigger camera actions (start/stop recording).
   - **Mosquitto** is used for testing and sending frames via MQTT for processing.
