# FarmGrid Project

This repository contains the source code for the FarmGrid platform, a comprehensive system to streamline the agricultural supply chain.

## Project Structure (Monorepo)

This project is structured as a monorepo containing two main packages:

-   **/backend**: The AdonisJS backend. It serves both a server-rendered web application (for admins, co-ops, buyers) and a REST API (for the mobile app).
-   **/mobile_app**: The Flutter mobile application for field operators to perform on-the-ground tasks like farmer registration and produce collection.

---

### Backend Setup (using pnpm)

1.  Navigate to the backend directory: `cd backend`
2.  Install dependencies: `pnpm install`
3.  Copy the environment file: `cp .env.example .env`
4.  Run database migrations: `node ace migration:run`
5.  Start the development server: `pnpm dev`

The server will be running at `http://127.0.0.1:3333`.

### Mobile App Setup

1.  Navigate to the mobile app directory: `cd mobile_app`
2.  Install dependencies: `flutter pub get`
3.  Run the application: `flutter run`