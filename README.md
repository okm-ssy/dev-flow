# Dev Flow - Visual Workflow Editor

A modern, visual workflow editor built with Vue.js and Tailwind CSS v4.

## 🚀 Quick Start

```bash
# Install dependencies
cd apps/frontend && npm install
cd apps/api && npm install

# Start development servers
flow run    # Frontend on http://localhost:5151
flow api    # API on http://localhost:9191
flow dev    # Both servers simultaneously
```

## 🧪 Testing

### Frontend Tests

```bash
# Unit tests
flow test-unit
flow test-unit-coverage

# E2E tests (Playwright)
flow test-e2e

# All frontend tests
flow test-frontend
```

### Full Test Suite

```bash
# Run all tests (API + Frontend + Quality checks)
flow test
```

## 📁 Project Structure

```text
dev-flow/
├── apps/
│   ├── frontend/           # Vue.js frontend
│   │   ├── src/
│   │   │   ├── components/ # Vue components
│   │   │   ├── stores/     # Pinia state management
│   │   │   ├── services/   # API services
│   │   │   ├── types/      # TypeScript definitions
│   │   │   └── utils/      # Utility functions
│   │   ├── e2e/            # Playwright E2E tests
│   │   └── package.json
│   ├── api/                # Express.js backend
│   │   ├── src/
│   │   │   ├── routes/     # API routes
│   │   │   ├── services/   # Business logic
│   │   │   └── controllers/ # Route handlers
│   │   └── data/           # SQLite database
│   └── mcp/                # MCP server
├── cli/                    # Development scripts
│   ├── front/
│   │   ├── run.sh          # Start frontend
│   │   ├── test.sh         # Frontend tests
│   │   └── lint.sh         # Code linting
│   ├── mcp/                # MCP scripts
│   └── test-all.sh         # Full test suite
├── bin/                    # Binary utilities
├── data/                   # Workflow data
└── README.md
```

## 🛠️ Technology Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vue Flow** - Interactive node-based editor for Vue.js
- **Pinia** - Modern state management for Vue
- **Tailwind CSS v4** - Latest utility-first CSS framework
- **Vite** - Fast development build tool
- **TypeScript** - Full type safety
- **Monaco Editor** - In-browser code editor
- **Playwright** - End-to-end testing framework
- **Vitest** - Unit testing framework

### Backend

- **Express.js** - Minimalist web framework
- **TypeScript** - Type safety across the stack
- **File-based storage** - Simple JSON-based data persistence
- **CORS enabled** - Cross-origin resource sharing

### Development

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Hot Module Replacement** - Instant development updates

## 🎯 Features

### Core Functionality

- **Visual Node Editor**: Drag-and-drop workflow creation with Vue Flow
- **Multiple Node Types**: Input, Process, Database, API, and custom nodes
- **Smart Positioning**: Automatic non-overlapping node placement in grid layout
- **Real-time Editing**: Live workflow editing with instant visual feedback
- **Node Configuration**: In-line editing with Monaco code editor
- **Connection Management**: Visual edge creation and deletion

### User Experience

- **Keyboard Shortcuts**: Delete nodes/edges with Delete/Backspace keys
- **Animation Controls**: Flow animation with speed control
- **Depth Visualization**: Color-coded edges based on workflow depth
- **Minimap & Controls**: Navigation helpers for complex workflows
- **Error Handling**: User-friendly error notifications
- **Dark Theme**: Modern dark UI design

### Technical Features

- **Type Safety**: Full TypeScript support across frontend and backend
- **State Management**: Centralized workflow state with Pinia
- **Export Options**: JSON export functionality
- **Persistent Storage**: Workflow data persistence
- **Comprehensive Testing**: Unit tests with Vitest and E2E tests with Playwright

## 🧩 Development Commands

```bash
# Development
flow run                          # Start frontend dev server (http://localhost:5151)
flow api                          # Start backend API server (http://localhost:9191)
flow dev                          # Start both servers simultaneously

# Code Quality
flow lint                         # Run ESLint for code quality
flow format                       # Format code with Prettier
flow typecheck                    # TypeScript type checking

# Testing
flow test-unit                    # Unit tests with Vitest
flow test-e2e                     # E2E tests with Playwright
flow test-frontend                # All frontend tests
flow test                         # Full test suite (all apps)

# Building
flow build                        # Build frontend for production
flow preview                      # Preview production build
```

## 🔧 Configuration

### Frontend (Port 5151)

- **Vite**: `apps/frontend/vite.config.ts` - Build tool and dev server configuration
- **Tailwind CSS v4**: `apps/frontend/tailwind.config.js` - Utility-first CSS framework
- **PostCSS**: `apps/frontend/postcss.config.js` - CSS processing pipeline
- **TypeScript**: `apps/frontend/tsconfig.json` - Type checking configuration
- **ESLint**: `apps/frontend/eslint.config.js` - Code linting rules
- **Playwright**: `apps/frontend/playwright.config.ts` - E2E testing configuration
- **Vitest**: `apps/frontend/vite.config.ts` - Unit testing configuration

### Backend (Port 9191)

- **API Routes**: `apps/api/src/routes/` - REST API endpoint definitions
- **Controllers**: `apps/api/src/controllers/` - Request handling logic
- **Services**: `apps/api/src/services/` - Business logic and data access
- **Data Storage**: `apps/api/data/workflows.db` - SQLite database file

### Development Tools

- **CLI Scripts**: `cli/` - Development workflow automation
- **MCP Server**: `apps/mcp/` - Model Context Protocol integration
- **Workspace**: `dev-flow.code-workspace` - VS Code workspace configuration

## 📝 License

MIT License
