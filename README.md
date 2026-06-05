<div align="center">

# 🎉 Eventoo

### Smart Event Management Platform

[Live Demo](https://www.eventoo.co.in) • [GitHub Repository](https://github.com/preethi624/my-Eventoo)

</div>

---

## 📖 About The Project

Eventoo is a full-stack event management platform that enables users to discover, create, and manage events seamlessly. The platform incorporates real-time communication, AI-powered assistance, QR-based attendance tracking, geolocation services, and role-based access control.

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT Authentication
* Role-Based Access Control
* Secure Login & Registration

### 🎫 Event Management

* Event Creation & Management
* Event Booking System
* Organizer Dashboard
* Event Discovery & Search

### 💬 Real-Time Communication

* Real-Time Chat using Socket.IO
* Instant Notifications

### 📍 Location Services

* Browser Geolocation
* Reverse Geocoding with OpenCage API
* Interactive Maps using Leaflet

### 📱 Attendance Tracking

* QR Ticket Generation
* QR Ticket Verification
* Attendance Management

### 🤖 AI Integration

* AI-Powered Event Assistant
* Intelligent User Support

---

## 🛠️ Tech Stack

| Category       | Technologies                                      |
| -------------- | ------------------------------------------------- |
| Frontend       | React.js, TypeScript, Redux Toolkit, Tailwind CSS |
| Backend        | Node.js, Express.js, MongoDB                      |
| Real-Time      | Socket.IO                                         |
| Maps           | Leaflet, OpenCage API                             |
| Authentication | JWT                                               |
| Deployment     | Docker, AWS                                       |

---
⚙️ Environment Variables

Create a `.env` file in the backend directory and add the following:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Optional (based on your features)
CLIENT_URL=http://localhost:3000
OPENCAGE_API_KEY=your_opencage_api_key
SOCKET_PORT=5000

## 📂 Project Structure

```text
my-Eventoo/
├── frontend/
├── backend/
├── .github/
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/preethi624/my-Eventoo.git
cd my-Eventoo
```

### Install Dependencies

```bash
npm install
```

### Start Application

```bash
npm run dev
```

---

## 🌐 Live Application

https://www.eventoo.co.in

---

## 👩‍💻 Author

**Preethi Sreejit**

* GitHub: https://github.com/preethi624
* LinkedIn: https://www.linkedin.com/in/preethi-sreejit/
