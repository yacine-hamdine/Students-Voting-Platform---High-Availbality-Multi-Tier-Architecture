# Student Representative Voting Platform

A premium, distributed voting platform with separated Frontend and Backend.

## Features
- **Frontend**: React (TypeScript), Vite, Glassmorphism Design.
- **Backend**: Node.js (Express), JWT Auth (Refresh Tokens), MySQL (Master/Slave Support).
- **Architecture**: Separated Read/Write operations for High Availability.

## Setup

### Backend
1. Navigate to `/backend`
2. Install dependencies: `npm install`
3. Configure DB in `config/db.js` (Already configured as per request).
4. Run server: `npm run dev`
   - Server runs on Port 3000.
   - It will attempt to create `users` and `votes` tables on the Master DB.

### Frontend
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
   - Open `http://localhost:5173`

## Usage
1. Register a new account.
2. Login.
3. Cast your vote (Writes to Master).
4. View real-time results (Reads from Slave).
