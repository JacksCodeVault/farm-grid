# FarmGrid Project

This repository contains the source code for the FarmGrid platform, a comprehensive system to streamline the agricultural supply chain.

## Project Structure (Monorepo)

This project is structured as a monorepo containing three main packages:

-   **/backend**: The Express.js API that serves as the brain for both frontends.
-   **/web_app**: The React (Vite) web application for dashboards (Admins, Co-ops, Buyers).
-   **/mobile_app**: The Flutter mobile application for field operators.

---

### Backend Setup (Express.js)

1.  Navigate to the backend directory: `cd backend`
2.  Install dependencies: `pnpm install`
3.  Create an environment file: `cp .env.example .env` (if it exists)
4.  Start the development server: `pnpm dev`

The API will be running at `http://localhost:3333`.

### Web App Setup (React + Vite)

1.  Navigate to the web app directory: `cd web`
2.  Install dependencies: `pnpm install`
3.  Start the development server: `pnpm dev`

The web app will be running at `http://localhost:5173`.

### Mobile App Setup (Flutter)

1.  Navigate to the mobile app directory: `cd mobile_app`
2.  Install dependencies: `flutter pub get`
3.  Run the application: `flutter run`