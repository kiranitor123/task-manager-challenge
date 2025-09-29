# ⚙️ Backend - Firebase Functions API

> **Backend developed with Firebase Functions following Hexagonal Architecture, implementing Domain-Driven Design with TypeScript and Firestore**

![Firebase](https://img.shields.io/badge/Firebase-Functions-orange?style=flat&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey?style=flat&logo=express)
![Firestore](https://img.shields.io/badge/Firestore-Database-yellow?style=flat&logo=firebase)
![Jest](https://img.shields.io/badge/Testing-Jest-red?style=flat&logo=jest)

## Hexagonal Architecture (Ports & Adapters)

### Layer Structure

```
src/
├── 📁 domain/                     # Domain Layer
│   ├── 📁 entities/               # Domain entities
│   │   ├── 📄 user.entity.ts      # User aggregate root
│   │   └── 📄 task.entity.ts      # Task aggregate root
│   ├── 📁 value-objects/          # Domain value objects
│   │   ├── 📄 email.vo.ts         # Email with validations
│   │   ├── 📄 user-id.vo.ts       # UserId unique identifier
│   │   ├── 📄 task-id.vo.ts       # TaskId unique identifier
│   │   └── 📄 task-status.vo.ts   # TaskStatus enum
│   ├── 📁 services/               # Domain services
│   │   └── 📄 task-validation.service.ts
│   └── 📁 exceptions/             # Domain exceptions
│       ├── 📄 user-not-found.exception.ts
│       ├── 📄 user-already-exists.exception.ts
│       └── 📄 task-not-found.exception.ts
├── 📁 application/                # Use cases (Application Layer)
│   ├── 📁 ports/                  # Definition of ports
│   │   ├── 📁 in/                 # Input port (Use Cases)
│   │   │   ├── 📄 auth.port.ts    # Authentication operations
│   │   │   └── 📄 task.port.ts    # Task management operations
│   │   └── 📁 out/                # Output ports (Dependencies)
│   │       ├── 📄 user.repository.port.ts
│   │       ├── 📄 task.repository.port.ts
│   │       └── 📄 logger.port.ts
│   ├── 📁 services/               # Application services
│   │   ├── 📄 auth.service.ts     # Auth orchestration
│   │   └── 📄 task.service.ts     # Task orchestration
│   └── 📁 use-cases/              # Specific use cases
│       ├── 📁 auth/               # Authentication use cases
│       │   ├── 📄 find-user.use-case.ts
│       │   └── 📄 create-user.use-case.ts
│       └── 📁 tasks/              # Task management use cases
│           ├── 📄 get-tasks.use-case.ts
│           ├── 📄 create-task.use-case.ts
│           ├── 📄 update-task.use-case.ts
│           └── 📄 delete-task.use-case.ts
└── 📁 infrastructure/             # Infrastructure Layer
    ├── 📁 web/                    # HTTP/REST Adapters
    │   ├── 📁 controllers/        # REST Controllers
    │   │   ├── 📄 auth.controller.ts
    │   │   └── 📄 task.controller.ts
    │   ├── 📁 routes/             # Route definitions
    │   │   ├── 📄 auth.routes.ts
    │   │   └── 📄 task.routes.ts
    │   ├── 📁 dtos/               # Data Transfer Objects
    │   │   ├── 📄 create-user.dto.ts
    │   │   ├── 📄 create-task.dto.ts
    │   │   └── 📄 update-task.dto.ts
    │   └── 📁 middleware/         # HTTP Middleware
    │       ├── 📄 error-handler.middleware.ts
    │       ├── 📄 logger.middleware.ts
    │       └── 📄 validation.middleware.ts
    ├── 📁 adapters/               # External system adapters
    │   └── 📁 persistence/        # Database adapters
    │       ├── 📄 firestore.adapter.ts      # Firestore connection
    │       ├── 📄 user.repository.ts        # User data access
    │       └── 📄 task.repository.ts        # Task data access
    └── 📁 config/                 # Configuration
        └── 📄 firebase-service-account.json
```

## 🎯 Backend Features

### Core Technologies
- **Firebase Functions** - Serverless compute platform
- **Express.js** - HTTP server framework
- **TypeScript** - Static typing and robust development
- **Cloud Firestore** - NoSQL document database
- **Jest** - Testing framework for unit tests

### Patterns Implemented
- ✅ **Hexagonal Architecture** - Ports & Adapters pattern
- ✅ **Domain-Driven Design** - Entities, Value Objects, Services
- ✅ **Repository Pattern** - Persistence abstraction
- ✅ **Use Case Pattern** - Single responsibility use cases
- ✅ **Dependency Injection** - Inversion of control
- ✅ **Command Query Separation** - Separation of readings/writings
- ✅ **Error Handling** - Exception handling patterns

## 🚀 Quick Start

### Installation

```bash
cd functions
npm install
```

### Local Development

```bash
# With Firebase emulators (recommended)
firebase emulators:start --only functions,firestore

# Only backend
npm run serve

# With real database (development)
NODE_ENV=development npm run serve

# Build the project
npm run build
```

### Deploy a Firebase

```bash
# Deploy completo
firebase deploy --only functions

# Deploy con build previo
npm run deploy

# Ver logs de producción
firebase functions:log --only api
```

## 🧪 Testing

### Run Tests

```bash
# All tests
npm test
```

**Developed using Firebase Functions and Hexagonal Architecture**