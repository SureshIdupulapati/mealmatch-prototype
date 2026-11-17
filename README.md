# MealMatch — Campus Food Rescue Platform

A full-stack, production-ready web application built to eliminate campus food waste and connect university students with free leftover catered meals.

Designed to match the high-fidelity Figma UI specification pixel-for-pixel, powered by an **Express.js** REST API and a persistent **SQLite** database.

---

## 🚀 Live Demo & Server

The server is currently running locally at:
👉 **[http://localhost:3000](http://localhost:3000)**

To run or restart the server manually:
```bash
# Install dependencies (Express, CORS)
npm install

# Start the full-stack server
npm start
# or
node server.js
```

---

## 📱 Features & Exact UI Implementation

### 1. Screen 1: Home Feed (`#home`)
- **Campus Selector**: Pinned to *"North Campus • UC Berkeley"* with leaf icon.
- **Dynamic Search**: Real-time filtering against title, event, host, and dietary tags.
- **Filter Chips**: Instant filtering by *All, Vegan, Halal, Hot Meals, Snacks*.
- **Promo Banner**: *"3 Active Drops Nearby - Good food. Less waste. All yours."*
- **Drop Cards**: Dynamic cards showing portions remaining, allergen tags, and countdown timers.

### 2. Screen 2: Food Drop Details (`#detail`)
- **Hero Image**: Platter photos with *"FREE FOOD • GOOD MOOD"* pill badge.
- **Host & Location**: Verified club host, room number, and walking distance.
- **Portion Bar**: Real-time progress bar reflecting remaining portions in SQLite.
- **Allergen Checklist**: Verified tags (*Nut-Free, Dairy-Free, Halal Friendly*).
- **Pickup Instructions**: Step-by-step instructions for entering the building.
- **Reserve CTA**: *"Claim 1 Box (Hold for 20m)"* button that reserves a portion in the database.

### 3. Screen 3: Digital Pickup Pass (`#pass`)
- **Ticket Pass**: Scannable vector QR Code and unique ticket code (e.g. `MM-CAL-2084`).
- **Live Synchronized Timer**: 20-minute countdown synced directly with the database expiry timestamp.
- **Stylized Campus Map**: Visual route from current location to *Bechtel Hall, Room 210*.
- **Complete Pickup Action**: *"I Received My Meal"* button that triggers a confetti celebration and dynamically updates the student's impact stats.
- **Cancel Hold**: Releases the claimed box back to the active campus feed.

### 4. Screen 4: Student Impact Dashboard (`#impact`)
- **Student Profile**: *Alex Chen* (*Cognitive Science '27, Campus verified*).
- **Semester Impact Stats**:
  - **Meals Rescued** (count increments upon pickup)
  - **kg $\text{CO}_2$ Saved** (+1.3 kg per rescued meal)
  - **Dollars Saved** (+$10 per meal)
- **Active Reservations**: One-tap access to the pickup pass.
- **Favorite Drop Spots**: Campus buildings (*Bechtel Hall, MLK Student Union, Sutardja Dai Hall*).

### 5. Campus Organizer Mode: "+ Post Food Drop" Modal
- Allows campus clubs, caterers, or student organizers to broadcast leftover food in 30 seconds.
- Automatically creates a new record in SQLite and broadcasts it to the home feed.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Node.js v24 + Express 5 + `node:sqlite` (native zero-dependency SQLite engine)
- **Database**: `mealmatch.db` (Tables: `drops`, `users`, `reservations`, `drop_spots`)
- **Frontend**: HTML5 + Tailwind CSS + Lucide Icons + Canvas Confetti
- **Assets**: High-resolution local image assets stored in `public/assets/`

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/drops?tag=...&search=...` | List active drops with optional filtering |
| `GET` | `/api/drops/:id` | Get single drop details & remaining portions |
| `POST` | `/api/drops` | Post a new food drop (organizers) |
| `POST` | `/api/drops/:id/claim` | Reserve 1 portion (generates ticket + 20m hold) |
| `GET` | `/api/reservations/active` | Get current active reservation pass |
| `POST` | `/api/reservations/:id/pickup` | Mark as picked up (increments impact stats) |
| `POST` | `/api/reservations/:id/cancel` | Cancel reservation (releases portion) |
| `GET` | `/api/user/profile` | Get student profile and real-time impact stats |

