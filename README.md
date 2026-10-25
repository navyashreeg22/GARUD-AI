# Garud — AI-Powered Training Centre Monitoring System

**Vision for a trusted tomorrow.**

DRISHTI (Government Training Centre Monitoring System) is an AI-powered monitoring platform designed to improve transparency, attendance verification, and operational oversight across government training centres using computer vision and centralized dashboards.

## 🚀 Overview

DRISHTI uses YOLO-based computer vision to detect people in classroom footage, estimate attendance, and support the monitoring of training centre activities. It provides separate monitoring capabilities for government officials and training centre personnel.

The system aims to reduce manual monitoring effort, improve accountability, and help officials identify discrepancies between AI-estimated attendance and trainer-submitted attendance records.

## ✨ Key Features

- **AI-Based Person Detection:** Uses YOLO computer vision to detect people in classroom footage.
- **Attendance Monitoring:** Supports AI-based headcount monitoring and comparison with manually submitted attendance.
- **Government Oversight Dashboard:** Provides centralized visibility into training centre activities.
- **Training Centre Monitoring:** Supports monitoring of classes, trainers, and centre operations.
- **Attendance Discrepancy Alerts:** Highlights differences between AI estimates and manual attendance for further review.
- **Equipment Monitoring:** Supports equipment inventory tracking and reporting of damaged or missing equipment.
- **Camera and Monitoring Alerts:** Helps surface camera issues and monitoring-related warnings.
- **Remarks and Reporting:** Supports recording observations and maintaining operational records.

## 🧠 Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Computer Vision | YOLO |
| Backend | Python |
| Deployment | Vercel for supported frontend services |

## 🏗️ Project Structure

```text
GTMS-Updated-Code/
├── vercel.json
└── gov-monitoring-system/
    ├── public/
    ├── src/
    ├── package.json
    ├── yolo_camera_server.py
    └── GTMS/
        ├── public/
        ├── src/
        └── package.json
```

*Note: This is a simplified overview of the project structure. Actual files and deployment configuration may change during development.*

## ⚙️ Local Setup

### Prerequisites

- Node.js and npm
- Python, if running the backend locally
- Git

### 1. Clone the repository

```bash
git clone https://github.com/moniesh-lab/GTMS-Updated-Code.git
cd GTMS-Updated-Code
```

### 2. Install frontend dependencies

```bash
cd gov-monitoring-system
npm install
```

### 3. Start the frontend development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 4. Backend

The Python YOLO backend must be configured with its required dependencies, model weights, and API settings before live detection can work. Follow the backend's dependency and configuration requirements.

## 🌐 Deployment

The project is connected to Vercel under the project name **DRISHTI**.

Production URL: https://drishti-delta-lake.vercel.app

The frontend deployment does not, by itself, guarantee that the Python detection backend, live cameras, or all video playback features are operational. These components require separate verification.

## 🔐 Privacy and Responsible Monitoring

- Access to monitoring information should be restricted to authorized personnel.
- Attendance discrepancies should be treated as review indicators, not automatic proof of misconduct.
- Student images and video footage should be handled according to applicable privacy and data-protection requirements.
- Camera failures and missing data should be distinguished from actual attendance issues.

## 🎯 Project Objective

To develop a centralized, AI-assisted monitoring system that improves the visibility, accountability, and operational efficiency of government training centres while supporting human review and responsible use of automated detection.

## 👥 Project

**Project Name:** DRISHTI  
**Team:** Team Garud  
**Repository:** [GTMS-Updated-Code](https://github.com/moniesh-lab/GTMS-Updated-Code)

**Vision for a trusted tomorrow.**
