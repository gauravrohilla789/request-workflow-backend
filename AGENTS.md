# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Request-Workflow is a TypeScript/Node.js backend application for managing request workflows with statuses (DRAFT, SUBMITTED, IN_PROGRESS, APPROVED, REJECTED). The frontend directory exists but is currently empty.

## Architecture

### Backend Structure (MVC Pattern)
- **Models** (`src/models/`): Mongoose schemas defining data structure
- **Controllers** (`src/controllers/`): Handle HTTP request/response logic
- **Services** (`src/services/`): Business logic layer for database operations
- **Routes** (`src/routes/`): Express route definitions
- **Utils** (`src/utils/`): Shared utilities (e.g., database connection)

### Data Flow
Routes → Controllers → Services → Models (Mongoose) → MongoDB

### Entry Points
- `src/server.ts`: Main server entry point (connects DB, starts Express server)
- `src/app.ts`: Express app configuration and middleware setup

## Development Commands

### Running the Application
```bash
# From backend directory
cd backend
npx ts-node src/server.ts
```

### Building TypeScript
```bash
# From backend directory
npx tsc
```
Output: `backend/dist/` directory with compiled JavaScript, source maps, and declaration files.

### Testing
No test scripts are currently configured. Jest and supertest are installed as dev dependencies but not yet set up.

## Environment Configuration

The backend requires a `.env` file in the `backend/` directory with:
- `PORT`: Server port (default: 3000)
- `MONGO_URI`: MongoDB connection string

Current local setup uses MongoDB at `mongodb://127.0.0.1:27017/request-workflow`.

## TypeScript Configuration

- **Strict mode enabled**: All TypeScript strict checks are active
- **Root directory**: `src/`
- **Output directory**: `dist/`
- **Target**: ESNext with CommonJS modules
- **Notable strict options**: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

## Database

Uses Mongoose with MongoDB. The `RequestModel` schema includes:
- `title` (required)
- `description` (optional)
- `status` (enum: DRAFT, SUBMITTED, IN_PROGRESS, APPROVED, REJECTED)
- `createdBy` (required)
- `approvalComment` (optional)
- `rejectionReason` (optional)
- Automatic timestamps (`createdAt`, `updatedAt`)

## API Endpoints

Base URL: `http://localhost:3000`

- `GET /` - Health check
- `POST /requests` - Create new request
- `GET /requests` - Get all requests

## Key Dependencies

- **Runtime**: Express 5.x, Mongoose 9.x, bcryptjs, jsonwebtoken, cors, dotenv
- **Development**: TypeScript 5.x, ts-node, nodemon, Jest, supertest

## Notes for Development

- The frontend directory is currently empty and awaiting implementation
- Authentication dependencies (bcryptjs, jsonwebtoken) are installed but not yet implemented in the codebase
- When adding new routes, follow the existing pattern: define in `routes/`, implement controller in `controllers/`, business logic in `services/`
