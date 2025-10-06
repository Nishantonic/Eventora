# 🎟️ Eventora

Eventora is a modern full-stack event booking platform where users can **discover events, book tickets, manage their bookings, and download tickets securely**.  
It is built using **React, TailwindCSS, Node.js, Express, and MySql**, with a responsive UI and clean design.

---

## ✨ Features

- 🔐 **Authentication & Authorization**  
  Secure login/register with JWT-based authentication.

- 🎉 **Event Discovery**  
  Browse events with details, date, price, and venue info.

- 🛒 **Ticket Booking**  
  Simple booking flow with real-time availability.

- 📂 **My Bookings Dashboard**  
  Users can view their past and upcoming bookings.

- 📄 **Download Tickets (PDF)**  
  Generate and re-download your event tickets.

- 🛠️ **Admin Dashboard**  
  Manage events, bookings, and users.

- 📱 **Responsive UI**  
  Optimized for desktop, tablet, and mobile with TailwindCSS.

- 🔒 **Security First**  
  Password hashing, secure cookies, HTTPS-ready, and a [Security Policy](./src/pages/SecurityPolicy.jsx).

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React (with Vite)
- 🎨 TailwindCSS
- 🎞️ Framer Motion
- 🖼️ Lucide Icons

### Backend
- 🟢 Node.js + Express
- 🍃 MySql (Prisma ORM)
- 🔑 JWT Authentication

---

## 🚀 Getting Started

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Nishantonic/Eventora.git
   cd eventora

2. **Install dependencies**

# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
npm install


3. **Environment variables**
Create .env file inside server/ with:

DATABASE_URL="mysql://username:password@host:port/database"
JWT_SECRET="Jwt_Secret_Key"
PORT=5000
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBhG9Eqa3Z5w9u7fRsi-ZMDZRHEysFVcTg // **This is Google Map Api**


4. **Run the app**

# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev


Open http://localhost:5173
 in your browser 🎉

