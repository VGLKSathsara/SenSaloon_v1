# 💇‍♀️ SenSaloon - Salon Booking Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)
![PayHere](https://img.shields.io/badge/Payments-PayHere-orange.svg)

**Complete Salon Management System with Real-Time Booking & PayHere Payment Integration**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Coming_Soon-2ea44f?style=for-the-badge)](https://github.com)
[![Report Bug](https://img.shields.io/badge/Report_Bug-🐛-red?style=for-the-badge)](https://github.com)
[![Request Feature](https://img.shields.io/badge/Request_Feature-✨-blue?style=for-the-badge)](https://github.com)

</div>

---

## 📸 **Dashboard Preview**

<div align="center">
  <img src="https://via.placeholder.com/1200x600/5F6FFF/ffffff?text=SenSaloon+-+Salon+Booking+Platform" alt="Dashboard Screenshot" width="90%">
  <br>
  <em>Professional salon management with real-time booking and payment processing</em>
</div>

---

## ✨ **Features**

### 🎯 **User Features**

| Feature                    | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| 👤 **User Registration**   | Sign up/Login with JWT authentication                    |
| 💇 **Browse Stylists**     | Filter by service type (Haircut, Facial, Manicure, etc.) |
| 📅 **Book Appointments**   | Real-time slot availability with 30-min intervals        |
| 💳 **PayHere Payments**    | Secure Sri Lankan payment gateway integration            |
| 📋 **Manage Appointments** | View, cancel, and track appointment history              |
| 👤 **Profile Management**  | Update personal info and profile picture                 |

### 👨‍⚕️ **Stylist Features**

| Feature                    | Description                                     |
| -------------------------- | ----------------------------------------------- |
| 📊 **Dashboard**           | View earnings, appointments, and customer count |
| 📋 **Appointment List**    | See all assigned appointments                   |
| ✅ **Complete/Cancel**     | Mark appointments as completed or cancelled     |
| 🔄 **Availability Toggle** | Set status as Available/Busy                    |
| 👤 **Profile Update**      | Edit fees, address, and about section           |

### 🔧 **Admin Features**

| Feature                     | Description                                  |
| --------------------------- | -------------------------------------------- |
| 👥 **Stylist Management**   | Add new stylists, delete existing ones       |
| 📊 **Dashboard**            | View stylists, appointments, customers count |
| 📋 **All Appointments**     | Monitor and cancel any appointment           |
| 🔄 **Availability Control** | Toggle stylist availability                  |

---

## 💳 **PayHere Payment Integration**

### Payment Flow

| Step | Description                                  |
| ---- | -------------------------------------------- |
| 1️⃣   | User clicks "Pay Now" on appointment         |
| 2️⃣   | Backend creates PayHere order with signature |
| 3️⃣   | Redirect to PayHere secure payment page      |
| 4️⃣   | User enters card details on PayHere          |
| 5️⃣   | PayHere processes payment                    |
| 6️⃣   | Redirect back to app with confirmation       |

### Test Cards (Sandbox Mode)

| Card Type     | Card Number           | Expiry     | CVV          |
| ------------- | --------------------- | ---------- | ------------ |
| 💳 Visa       | `4916 1100 0000 0000` | Any future | Any 3 digits |
| 💳 Mastercard | `5213 0000 0000 0000` | Any future | Any 3 digits |

---

## 🛠️ **Tech Stack**

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

</div>

| Layer       | Technology                                |
| ----------- | ----------------------------------------- |
| Frontend    | React 18, Vite, TailwindCSS, React Router |
| Backend     | Node.js, Express.js                       |
| Database    | MongoDB (Mongoose ODM)                    |
| Auth        | JWT (JSON Web Tokens)                     |
| File Upload | Cloudinary                                |
| Payments    | **PayHere** (Sri Lanka)                   |

---

## 📁 **Project Structure**
