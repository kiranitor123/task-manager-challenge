# 📋 Task Manager - FullStack Technical Challenge

> **A task management application built with Angular 20 and Firebase Functions following Clean Architecture and Hexagonal Architecture principles**

![Angular](https://img.shields.io/badge/Angular-20-red?style=flat&logo=angular)
![Firebase](https://img.shields.io/badge/Firebase-Functions-orange?style=flat&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Testing](https://img.shields.io/badge/Testing-Jest%20%26%20Jasmine-green?style=flat&logo=jest)

## 🌟 Main Features

- **🔐 Simple authentication** - Login with email without password
- **📝 Task management** - CRUD complete with filters and statuses
- **🎯 Clean architectures** - Clean Architecture (Frontend) + Hexagonal (Backend)
- **🧪 Complete testing** - Unit tests with high coverage
- **🚀 Automated deployment** - Firebase Functions + Hosting
- **📱 Responsive design** - Angular Material with adaptive design
- **⚡ Real-time updates** - Real-time updates with Firestore

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    TASK MANAGER APP                         │
├─────────────────────┬───────────────────────────────────────┤
│     FRONTEND        │            BACKEND                    │
│  Clean Architecture │      Hexagonal Architecture           │
├─────────────────────┼───────────────────────────────────────┤
│                     │                                       │
│  ┌─────────────────┐│  ┌─────────────────────────────────┐  │
│  │  Presentation   ││  │        Infrastructure           │  │
│  │  - Components   ││  │     - Controllers               │  │
│  │  - Presenters   ││  │     - Routes                    │  │
│  └─────────────────┘│  │     - Firestore Adapter         │  │
│           │         │  └─────────────────────────────────┘  │
│  ┌─────────────────┐│           │                           │
│  │   Use Cases     ││  ┌─────────────────────────────────┐  │
│  │  - Auth Logic   ││  │        Application              │  │
│  │  - Task Logic   ││  │     - Use Cases                 │  │
│  └─────────────────┘│  │     - Services                  │  │
│           │         │  │     - Ports                     │  │
│  ┌─────────────────┐│  └─────────────────────────────────┘  │
│  │    Domain       ││           │                           │
│  │  - Entities     ││  ┌─────────────────────────────────┐  │
│  │  - Repositories ││  │         Domain                  │  │
│  │  - Value Objects││  │     - Entities                  │  │
│  └─────────────────┘│  │     - Value Objects             │  │
│           │         │  │     - Domain Services           │  │
│  ┌─────────────────┐│  └─────────────────────────────────┘  │
│  │ Infrastructure  ││                                       │
│  │  - HTTP Client  ││        Firebase Functions             │
│  │  - Local Storage││           Cloud Firestore             │
│  └─────────────────┘│                                       │
└─────────────────────┴───────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or 20+
- **npm** 9+
- **Firebase CLI** (for deployment)
- **Angular CLI** 20+

### Quick Installation

```bash
# Clone repository
git clone https://github.com/kiranitor123/task-manager-challenge.git
cd task-manager-challenge

# Setup Frontend
cd frontend
npm install

npm run start

# Setup Backend  
cd ../functions
npm install

npm run serve
```

### Deploy

```bash
# Deploy a Firebase
npm run deploy
```

## 📁 Project structure

```
task-manager-challenge/
├── 📁 frontend/                    # Angular 20 Application
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📁 domain/          # Entities, Use Cases, Repositories
│   │   │   ├── 📁 infrastructure/  # HTTP, LocalStorage, Adapters  
│   │   │   └── 📁 presentation/    # Components, Presenters
│   │   ├── 📁 environments/        # Config environments
│   │   └── 📁 assets/              # Static files
│   ├── 📄 angular.json
│   ├── 📄 package.json
│   └── 📄 README.md               # Frontend specific docs
├── 📁 functions/                   # Firebase Functions
│   ├── 📁 src/
│   │   ├── 📁 domain/             # Entities, Value Objects, Services
│   │   ├── 📁 application/        # Use Cases, Ports, Services
│   │   ├── 📁 infrastructure/     # Controllers, Adapters, Routes
│   │   └── 📁 config/             # Firebase credentials
│   ├── 📄 package.json
│   └── 📄 README.md              # Backend specific docs
├── 📄 firebase.json               # Firebase configuration
├── 📄 firestore.rules            # Firestore security rules
├── 📄 firestore.indexes.json     # Database indexes
├── 📄 package.json               # Root package.json
└── 📄 README.md                  # This file
```

## 💡 Technologies and Patterns

### Frontend (Clean Architecture)
- **Angular 20** - Main framework with Standalone Components
- **Angular Material** - UI Components and theming
- **RxJS** - Reactive programming and state management
- **Angular Signals** - Modern reactive state
- **Jasmine + Karma** - Testing framework

### Backend (Hexagonal Architecture)
- **Firebase Functions** - Serverless compute platform
- **TypeScript** - Static typing
- **Express.js** - HTTP server framework
- **Cloud Firestore** - NoSQL database
- **Jest** - Testing framework

### Patterns Implemented
- **Clean Architecture** - Clear separation of responsibilities
- **Hexagonal Architecture** - Independence from external frameworks
- **Repository Pattern** - Abstraction of data access
- **Use Cases Pattern** - Encapsulated business logic
- **Presenter Pattern** - Separation of presentation logic
- **Dependency Injection** - Inversion of dependencies
- **CQRS** - Separation of commands and queries

## 🎯 Functionalities

### Authentication
- [x] Login with email (no password)
- [x] Automatic user creation
- [x] Protected navigation by guards
- [x] Logout and session cleanup

### Task Management
- [x] Create tasks with title and description
- [x] List tasks of the authenticated user
- [x] Edit existing tasks
- [x] Mark tasks as completed/pending
- [x] Delete tasks
- [x] Filters by status (All, Pending, Completed)
- [x] Real-time statistics

### Technical Features
- [x] Data validation in frontend and backend
- [x] Robust error handling
- [x] Loading states and visual feedback
- [x] Responsive design
- [x] Unit tests with high coverage

## 🧪 Testing

### Run tests

```bash
# Frontend Tests
cd frontend
npm run test

# Backend Tests  
cd functions
npm run test
```

### Tests Implemented

#### Frontend
- **Domain Layer**: Entities, Value Objects, Use Cases
- **Presentation Layer**: Presenters con Angular Signals
- **Infrastructure Layer**: Repository implementations

#### Backend  
- **Domain Layer**: Entities, Value Objects, Domain Services
- **Application Layer**: Use Cases con mocks
- **Infrastructure Layer**: Controllers, HTTP endpoints

## Deploy

### Development Local

```bash
# Firebase emulators (recommended)
firebase emulators:start
```

### Production

```bash
# Build completo
npm run build

# Deploy a Firebase
firebase deploy

# Deploy solo backend
firebase deploy --only functions

# Deploy solo frontend
firebase deploy --only hosting
```

### Pull Requests

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Additional Documentation
- [Frontend README](./frontend/README.md) - Frontend specific documentation
- [Backend README](./functions/README.md) - Backend specific documentation

### Contact
- **Email**: rolandoalvarezfaye@gmail.com
- **LinkedIn**: [My Profile](https://linkedin.com/in/rolandoalvarezfaye)
- **GitHub**: [My User](https://github.com/kiranitor123)

---

**If this project was useful to you, give it a star on GitHub!**

**Developed for the FullStack Developer Technical Challenge**