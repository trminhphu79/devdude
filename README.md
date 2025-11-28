Author: Phu Tran, Khoi Tran

LinkedIn: https://www.linkedin.com/in/tmp-dev79/

# DevDude Platform

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

**DevDude** is a comprehensive assessment and learning platform designed to facilitate skill evaluation and management. It is built as a modern monorepo using **Nx**, combining a robust **NestJS** backend with a dynamic **Angular** frontend.

## 🏗️ Architecture

The project follows a **Monorepo** architecture managed by [Nx](https://nx.dev), allowing for efficient code sharing and unified tooling.

### Tech Stack

- **Monorepo Tooling**: Nx
- **Backend (`apps/core`)**:
  - Framework: [NestJS](https://nestjs.com/)
  - ORM: [Sequelize](https://sequelize.org/) (TypeScript)
  - Database: PostgreSQL
  - Authentication: Passport (JWT)
  - Documentation: Swagger / OpenAPI
- **Frontend (`apps/platform`)**:
  - Framework: [Angular](https://angular.io/)
  - Styling: [TailwindCSS](https://tailwindcss.com/)
- **Shared (`libs/common`)**: Shared interfaces, types, and utilities used across both frontend and backend.
- **Containerization**: Docker & Docker Compose

## 🌍 Domain & Modules

The application is structured around key domain areas, primarily located in the `core` backend service:

- **Auth**: Handles user authentication, registration, and security (JWT strategy).
- **Question Bank**: Manages the repository of questions, topics, and categories for assessments.
- **Assessment**: Core logic for creating, managing, and taking assessments/tests.
- **Evaluation**: Handles the grading logic, scoring, and ranking of assessment results.
- **Admin**: Administrative interfaces and logic for system management.

## 📂 Project Structure

```text
devdude/
├── apps/
│   ├── core/           # NestJS Backend Application
│   ├── platform/       # Angular Frontend Application
│   └── core-e2e/       # End-to-End Tests for Core
├── libs/
│   └── common/         # Shared libraries (types, utils)
├── tools/              # Workspace scripts and tools
├── docker-compose.yml  # Docker composition for local dev
└── nx.json             # Nx Configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Docker & Docker Compose (for database and full stack execution)

### Installation

```sh
npm install
```

### Running the Application

**1. Start the Backend & Database (Docker)**

You can run the backend and database using Docker Compose:

```sh
npm run start:api
# OR
nx build core && docker-compose --env-file .env up -d --build
```

**2. Start the Frontend**

```sh
npm start
# OR
npx nx serve platform
```

### Running Tests

To run unit tests for the core application:

```sh
npm test
# OR
npx nx test core --coverage
```

## 🛠️ Nx Commands

Here are some useful Nx commands for managing the workspace:

- **Run Dev Server**: `npx nx serve platform`
- **Build Production**: `npx nx build platform`
- **Show Project Details**: `npx nx show project platform`
- **Run Graph**: `npx nx graph` (Visually explore the project structure)

### Generating Code

- **Generate App**: `npx nx g @nx/angular:app demo`
- **Generate Lib**: `npx nx g @nx/angular:lib mylib`
- **Generate Nest Resource**: `npx nx g @nx/nest:resource users --project=core`

[Learn more about Nx](https://nx.dev)
