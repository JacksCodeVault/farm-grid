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

---

## API Routes Grouped by Shared Roles

### Shared by SYSTEM_ADMIN and BOARD_MEMBER
- **Users**
  - `GET /api/v1/users` — List users
  - `GET /api/v1/users/:id` — Get user by ID
- **Organizations**
  - `GET /api/v1/organizations` — List organizations
  - `GET /api/v1/organizations/:id` — Get organization by ID
- **Commodities**
  - `GET /api/v1/commodities` — List commodities
  - `GET /api/v1/commodities/:id` — Get commodity by ID
- **Geography**
  - `GET /api/v1/geography/regions` — List regions
  - `GET /api/v1/geography/regions/:id` — Get region by ID
  - `GET /api/v1/geography/districts` — List districts
  - `GET /api/v1/geography/districts/:id` — Get district by ID
  - `GET /api/v1/geography/villages` — List villages
  - `GET /api/v1/geography/villages/:id` — Get village by ID

### Shared by SYSTEM_ADMIN, COOP_ADMIN, FIELD_OPERATOR
- **Farmers**
  - `GET /api/v1/farmers` — List farmers
  - `GET /api/v1/farmers/:id` — Get farmer by ID
- **Collections**
  - `GET /api/v1/collections` — List collections

### Shared by SYSTEM_ADMIN, COOP_ADMIN
- **Collections**
  - `GET /api/v1/collections/:id` — Get collection by ID
  - `PATCH /api/v1/collections/:id/deactivate` — Deactivate collection
- **Farmers**
  - `PATCH /api/v1/farmers/:id/deactivate` — Deactivate farmer

### Shared by SYSTEM_ADMIN, COOP_ADMIN, BUYER_ADMIN
- **Payments**
  - `GET /api/v1/payments/:id` — Get payment by ID
  - `PATCH /api/v1/payments/:id/deactivate` — Deactivate payment
- **Orders**
  - `GET /api/v1/orders` — List orders
  - `GET /api/v1/orders/:id` — Get order by ID

### Shared by COOP_ADMIN, SYSTEM_ADMIN
- **Collections**
  - `PATCH /api/v1/collections/:id/mark-paid` — Mark collection as paid

---

## Example Endpoint: Produce Collections

### `POST /api/v1/collections`

Record a new produce collection from a farmer.

**Required Role:** FIELD_OPERATOR

#### Request Body

```json
{
  "farmer_id": 123,
  "commodity_id": 5,
  "quantity": 100,
  "unit_price": 50,
  "collected_at": "2025-08-30T10:00:00Z"
}
```

#### Response (Success)

```json
{
  "id": 456,
  "farmer_id": 123,
  "commodity_id": 5,
  "quantity": 100,
  "unit_price": 50,
  "collected_at": "2025-08-30T10:00:00Z",
  "is_paid": false,
  "created_at": "2025-08-30T10:01:00Z"
}
```

#### Response (Error)

```json
{
  "error": "Farmer not found"
}
```

#### Business Logic

- Only users with the FIELD_OPERATOR role can record collections.
- The system checks that the farmer and commodity exist and are active.
- The collection is linked to the farmer and commodity, and stored with quantity, unit price, and timestamp.
- The `is_paid` field is set to `false` by default until payment is processed.
- If any required field is missing or invalid, an error is returned.
- Upon successful creation, the collection is available for payment and delivery workflows.

---

For more endpoint details, see `/api-docs` (Swagger UI) or request documentation for a specific route.