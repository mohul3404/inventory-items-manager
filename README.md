# Inventory Items Manager

Full-stack inventory management app built with **React + TypeScript** and **ASP.NET Core Web API (.NET 8)**.

This project was created for a Software Development Intern assignment and focuses on clean data flow, practical architecture, and a polished user experience.

## At a Glance

| Area | Details |
| --- | --- |
| Frontend | React, TypeScript, Vite, TailwindCSS |
| Backend | ASP.NET Core Web API, .NET 8 |
| Data | In-memory repository for simple local evaluation |
| API Style | REST endpoints with typed DTOs and structured responses |
| UX | Responsive UI, search, filters, loading states, empty states, error handling |

## What the App Does

Inventory managers can:

- View all inventory items
- Add new items
- Edit existing items
- Delete items
- Search by item name or SKU
- Filter by stock status
- See stock health automatically based on quantity

Stock status is calculated by the backend:

| Quantity | Status |
| ---: | --- |
| `0` | Out of Stock |
| `< 10` | Low Stock |
| `>= 10` | In Stock |

## Why This Project Stands Out

This is intentionally more than a basic CRUD screen.

- **Clean backend layering** keeps controllers, business logic, and data access separate.
- **Typed API contracts** make frontend-backend integration predictable.
- **Reusable frontend components** keep the UI maintainable.
- **Centralized API client** handles HTTP errors consistently.
- **Result-based service flow** makes validation, conflict, not-found, and unexpected paths explicit.
- **Responsive UI states** make the app feel complete even during loading, errors, and empty data.

## Project Structure

```text
InventoryItemsManager/
  backend/
    Common/              Result and API response contracts
    Controllers/         HTTP endpoints
    DTOs/                Request and response contracts
    Extensions/          Dependency injection setup
    Middleware/          Global exception handling
    Models/              Domain models and stock status logic
    Repositories/        In-memory data access abstraction
    Services/            Business rules and validation
    Program.cs           API startup, CORS, Swagger, middleware

  frontend/
    src/
      api/               Axios API client
      components/        Shared UI components
      features/          Inventory feature screens
      hooks/             Inventory and search/filter state
      types/             TypeScript contracts
    package.json
    vite.config.ts

  README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- .NET 8 SDK

Verify .NET SDK:

```bash
dotnet --list-sdks
```

Expected:

```text
8.0.x [C:\Program Files\dotnet\sdk]
```

### Run the Backend

```bash
cd backend
dotnet restore
dotnet build
dotnet run --no-launch-profile --urls "http://localhost:5000"
```

Backend URL:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api/v1
```

Swagger:

```text
http://localhost:5000/swagger
```

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

You can place that value in `frontend/.env` if needed.

## API Endpoints

Base route:

```text
/api/v1/items
```

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/v1/items` | List inventory items |
| GET | `/api/v1/items/{id}` | Get one item |
| POST | `/api/v1/items` | Create an item |
| PUT | `/api/v1/items/{id}` | Update an item |
| DELETE | `/api/v1/items/{id}` | Delete an item |

Example request:

```json
{
  "name": "Office Chair",
  "sku": "CHAIR-101",
  "quantity": 5
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Office Chair",
    "sku": "CHAIR-101",
    "quantity": 5,
    "status": "LowStock"
  }
}
```

## Architecture

Backend flow:

```text
Controller -> Service -> Repository -> Model
```

Frontend flow:

```text
Page -> Hook -> API Client -> ASP.NET Core API
```

The backend is designed so the in-memory repository can later be replaced with a real database without changing the controller contract.

## Current Verification

Completed locally:

- .NET 8 SDK detected
- `dotnet restore` passes
- `dotnet build` passes with zero warnings and zero errors
- Backend runs on `http://localhost:5000`
- `GET /api/v1/items` returns seeded inventory data
- Local CORS allows the Vite frontend origin
- API create/delete smoke test passes
- Frontend production build passes with `npm run build`

## Assignment Scope

Implemented:

- Frontend UI
- Backend API
- Frontend-backend integration
- Add, edit, delete inventory flows
- Search and filtering
- Error/loading/empty states
- Clean project structure
- Recruiter-readable documentation

Intentionally out of scope for this assignment:

- Authentication
- Persistent database
- Role-based access
- Advanced reporting

## Deployment

Deployment configuration is prepared, but final deployment steps will be handled later.
