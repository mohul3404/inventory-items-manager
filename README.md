# Inventory Items Manager

A production-inspired full-stack inventory manager built with React, TypeScript, TailwindCSS, Axios, and ASP.NET Core Web API.

## Project overview

This assignment demonstrates a clean, scalable architecture for a simple inventory system with:
- Inventory listing and add-item flow
- Stock status calculation (`Out of Stock`, `Low Stock`, `In Stock`)
- Responsive UI, loading states, empty states, and validation
- Clean backend service layer with DTO validation and structured error handling
- API-first design with typed frontend API client

## Tech stack

- Frontend: React + Vite + TypeScript + TailwindCSS + Axios + React Hook Form
- Backend: ASP.NET Core Web API (.NET 6) with Controllers, DI, service/repository pattern, middleware
- Data store: In-memory repository for fast setup and startup
- Developer experience: Swagger/OpenAPI, environment configuration, and clean folder structure

## Folder structure

```
InventoryItemsManager/
├── backend/
│   ├── DTOs/
│   ├── Extensions/
│   ├── Middleware/
│   ├── Models/
│   ├── Repositories/
│   ├── Services/
│   ├── appsettings.json
│   ├── InventoryItemsManager.Api.csproj
│   └── Program.cs
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Setup instructions

### Backend

```bash
cd backend
# install when .NET SDK is available
# dotnet restore
# dotnet build
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Running together

- Backend: `dotnet run --project backend/InventoryItemsManager.Api.csproj`
- Frontend: `npm run dev -- --host`

If `dotnet` is not installed locally, the backend can still be evaluated by reviewing the API code and `Program.cs` entrypoint.

## API Endpoints

- `GET /api/items` — returns inventory list
- `POST /api/items` — create a new inventory item

## Assumptions

- Data persistence is intentionally in-memory for a take-home assignment to reduce setup friction.
- SKU is treated as a required, unique string identifier with simple frontend validation.
- Quantity is a non-negative integer.
- User authentication is out of scope for this task.

## Future enhancements

- Replace the in-memory repository with SQLite or another database
- Add edit/delete item capabilities
- Add search/filter and pagination
- Add unit and integration tests for both backend and frontend
- Add deployment scripts and Docker support

## Engineering decisions

- Layered backend architecture for separation of concerns and testability
- DTOs to isolate API contracts from internal models
- Single API client wrapper for consistent Axios usage
- Reusable UI components and feature-based folder organization
- TailwindCSS for production-grade styling with responsive design
