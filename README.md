# Request Workflow Backend

A TypeScript/Node.js backend application for managing request workflows with multiple status states.

## Overview

Request-Workflow is a RESTful API built with Express.js and MongoDB that enables tracking and management of requests through various workflow states: DRAFT, SUBMITTED, IN_PROGRESS, APPROVED, and REJECTED.

## Features

- **Request Management**: Create and retrieve workflow requests
- **Status Tracking**: Track requests through multiple workflow states
- **MongoDB Integration**: Persistent storage with Mongoose ODM
- **TypeScript**: Full type safety and modern JavaScript features
- **RESTful API**: Clean, resource-based API design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB with Mongoose 9.x
- **Authentication**: JWT (jsonwebtoken) and bcryptjs (ready for implementation)
- **Development**: ts-node, nodemon

## Project Structure

```
backend/
├── src/
│   ├── models/          # Mongoose schemas and data models
│   ├── controllers/     # Request handlers and response logic
│   ├── services/        # Business logic layer
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions (DB connection, etc.)
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript output
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gauravrohilla789/request-workflow-backend.git
cd request-workflow-backend
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Configure environment variables:

Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/request-workflow
```

4. Ensure MongoDB is running:
```bash
# For local MongoDB
mongod
```

### Running the Application

#### Development Mode
```bash
cd backend
npx ts-node src/server.ts
```

Or with nodemon for auto-reload:
```bash
cd backend
npx nodemon src/server.ts
```

#### Build for Production
```bash
cd backend
npx tsc
node dist/server.js
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Health Check
```http
GET /
```
Returns API status message.

#### Create Request
```http
POST /requests
Content-Type: application/json

{
  "title": "Request title",
  "description": "Optional description",
  "createdBy": "user@example.com"
}
```

**Response**: 201 Created
```json
{
  "_id": "...",
  "title": "Request title",
  "description": "Optional description",
  "status": "DRAFT",
  "createdBy": "user@example.com",
  "createdAt": "2026-02-04T12:00:00.000Z",
  "updatedAt": "2026-02-04T12:00:00.000Z"
}
```

#### Get All Requests
```http
GET /requests
```

**Response**: 200 OK
```json
[
  {
    "_id": "...",
    "title": "Request title",
    "status": "DRAFT",
    "createdBy": "user@example.com",
    "createdAt": "2026-02-04T12:00:00.000Z",
    "updatedAt": "2026-02-04T12:00:00.000Z"
  }
]
```

## Request Status Flow

Requests can have the following statuses:

- **DRAFT**: Initial state, request is being prepared
- **SUBMITTED**: Request has been submitted for review
- **IN_PROGRESS**: Request is being processed
- **APPROVED**: Request has been approved
- **REJECTED**: Request has been rejected

## Data Model

### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Request title |
| description | String | No | Request description |
| status | Enum | Yes | Current status (default: DRAFT) |
| createdBy | String | Yes | Creator identifier |
| approvalComment | String | No | Comment when approved |
| rejectionReason | String | No | Reason for rejection |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

## Development

### TypeScript Configuration

The project uses strict TypeScript settings:
- Strict mode enabled
- `noUncheckedIndexedAccess`: true
- `exactOptionalPropertyTypes`: true
- Source: `src/`
- Output: `dist/`

### Architecture Pattern

The application follows the **MVC (Model-View-Controller)** pattern with a service layer:

1. **Routes** define API endpoints
2. **Controllers** handle HTTP requests/responses
3. **Services** contain business logic
4. **Models** define data structure and database interaction

### Adding New Features

1. Define the model in `src/models/`
2. Create service functions in `src/services/`
3. Implement controllers in `src/controllers/`
4. Register routes in `src/routes/`
5. Import and use routes in `src/app.ts`

## Testing

Testing infrastructure is set up with Jest and supertest, but test scripts need to be configured.

```bash
# Once configured
npm test
```

## Future Enhancements

- [ ] Implement authentication with JWT
- [ ] Add user management
- [ ] Implement request status transitions
- [ ] Add approval/rejection endpoints
- [ ] Set up Jest test suite
- [ ] Add request filtering and pagination
- [ ] Implement frontend application
- [ ] Add request assignment to users
- [ ] Email notifications for status changes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGO_URI | MongoDB connection string | mongodb://127.0.0.1:27017/request-workflow |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Author

Gaurav Rohilla
