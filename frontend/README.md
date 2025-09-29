# Frontend - Task Manager Angular App

> **Frontend developed with Angular 20 following Clean Architecture principles, using Angular Material and reactive programming with Signals**

![Angular](https://img.shields.io/badge/Angular-20-red?style=flat&logo=angular)
![Angular Material](https://img.shields.io/badge/Material-20-blue?style=flat&logo=material-design)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![RxJS](https://img.shields.io/badge/RxJS-7.0-purple?style=flat&logo=reactivex)
![Testing](https://img.shields.io/badge/Testing-Jasmine%20%26%20Karma-green?style=flat)

## Clean Architecture

### Layer Structure

```
src/app/
├── 📁 domain/                     # Domain Layer (Business Logic)
│   ├── 📁 entities/               # Business entities
│   │   ├── 📄 user.entity.ts      # User: id, email, createdAt
│   │   └── 📄 task.entity.ts      # Task: id, title, description, status
│   ├── 📁 value-objects/          # Value objects
│   │   ├── 📄 email.vo.ts         # Email with validations
│   │   └── 📄 task-status.vo.ts   # TaskStatus: completed/pending
│   ├── 📁 repositories/           # Repository interfaces
│   │   ├── 📄 auth.repository.ts  # Auth operations contract
│   │   └── 📄 task.repository.ts  # Task operations contract
│   ├── 📁 use-cases/              # Business use cases
│   │   ├── 📁 auth/               # Authentication use cases
│   │   │   ├── 📄 login-user.use-case.ts
│   │   │   ├── 📄 create-user.use-case.ts
│   │   │   └── 📄 logout-user.use-case.ts
│   │   └── 📁 tasks/              # Task management use cases
│   │       ├── 📄 get-tasks.use-case.ts
│   │       ├── 📄 create-task.use-case.ts
│   │       ├── 📄 update-task.use-case.ts
│   │       ├── 📄 toggle-task.use-case.ts
│   │       └── 📄 delete-task.use-case.ts
│   └── 📁 exceptions/             # Domain exceptions
│       ├── 📄 user-not-found.exception.ts
│       └── 📄 task-not-found.exception.ts
├── 📁 infrastructure/             # Infrastructure Layer (External)
│   ├── 📁 adapters/               # External adapters
│   │   └── 📄 api.adapter.ts      # HTTP client adapter
│   ├── 📁 repositories/           # Concrete implementations
│   │   ├── 📄 auth.repository.impl.ts    # Auth API implementation
│   │   └── 📄 task.repository.impl.ts    # Task API implementation
│   └── 📁 services/               # Infrastructure services
│       └── 📄 notification.service.ts    # Toast notifications
└── 📁 presentation/               # Presentation Layer (UI)
    ├── 📁 components/             # Reusable UI components
    │   └── 📁 shared/             # Shared UI components
    │       ├── 📄 task-form/      # Task creation/edit form
    │       ├── 📄 task-card/      # Task display card
    │       └── 📄 loading-spinner/ # Loading indicator
    ├── 📁 pages/                  # Main pages
    │   ├── 📁 auth/               # Authentication pages
    │   │   └── 📁 login/          # Login page component
    │   └── 📁 tasks/              # Task management pages  
    │       └── 📁 task-list/      # Task list page component
    └── 📁 presenters/             # Presentation logic (State Management)
        ├── 📄 auth.presenter.ts   # Auth state & operations
        └── 📄 task.presenter.ts   # Task state & operations
```

## 🎯 Frontend Features

### Core Technologies
- **Angular 20** - Main framework with Standalone Components
- **Angular Material 20** - UI Components and theming system
- **Angular Signals** - Modern reactive state management
- **RxJS** - Reactive programming for async operations
- **TypeScript 5.0** - Strong static typing

### Features Implemented
- ✅ **Standalone Components** - Without NgModule modules
- ✅ **Angular Signals** - Reactive state for presenters
- ✅ **Reactive Forms** - Reactive forms with validations
- ✅ **Angular Material** - Consistent and responsive UI
- ✅ **Route Guards** - Route protection with authentication
- ✅ **Dependency Injection** - IoC container for dependencies
- ✅ **Error Handling** - Centralized error handling
- ✅ **Loading States** - Loading states for UX
- ✅ **Toast Notifications** - Visual feedback to users
- ✅ **Responsive Design** - Adaptable to mobile and desktop

## 🚀 Quick Start

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
# Development server
ng serve
```

### Build

```bash
# Build for development
ng build
```

## 🧪 Testing

### Run Tests

```bash
# All tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage

# Tests for CI
npm run test:ci

# Specific tests
ng test --include="**/auth.presenter.spec.ts"
```
