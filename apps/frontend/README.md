# Kiro Workflow Editor

A visual node-based workflow documentation tool built with React and React Flow. This application allows engineers to create, document, and export complex workflows using an intuitive drag-and-drop interface.

## Features

### Core Functionality
- **Visual Node Editor**: Drag-and-drop interface for creating workflow diagrams
- **Multiple Node Types**: Support for BigQuery, PostgreSQL, AWS SDK, Slack, and custom nodes
- **Code Integration**: Monaco Editor for syntax-highlighted code editing within nodes
- **Connection System**: Visual connections between workflow nodes with cycle detection
- **Export Options**: Export workflows to Markdown (GitHub wiki compatible) and JSON formats

### Node Types
- **BigQuery**: SQL query nodes with BigQuery-specific highlighting
- **PostgreSQL**: PostgreSQL query nodes with SQL syntax highlighting
- **AWS SDK**: JavaScript/Python code for AWS service integration
- **Slack**: Slack API integration nodes
- **Custom**: General-purpose nodes for any type of code or documentation

### Storage & Management
- **Local Storage**: IndexedDB-based persistence using Dexie.js
- **Workflow Management**: Save, load, and manage multiple workflows
- **Auto-save**: Automatic detection of unsaved changes

### User Experience
- **Responsive Design**: Clean, modern interface with Tailwind CSS
- **Real-time Editing**: Live updates as you edit nodes and connections
- **Error Validation**: Built-in validation for node properties and workflow structure
- **Keyboard Shortcuts**: Efficient workflow creation and editing

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Node Editor**: React Flow for the visual workflow editor
- **Code Editor**: Monaco Editor with syntax highlighting
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB (Dexie.js)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kiro-workflow-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage
- `npm run format` - Format code with Prettier
- `npm run typecheck` - TypeScript type checking

## Usage

### Creating a Workflow

1. Click "New Workflow" to create a new workflow
2. Enter a name and description for your workflow
3. Drag node types from the palette to the canvas
4. Connect nodes by dragging from output handles to input handles
5. Double-click nodes or use the edit button to modify their properties

### Node Configuration

Each node can be configured with:
- **Title**: Descriptive name for the node
- **Description**: Detailed explanation of what the node does
- **Code**: Implementation code with syntax highlighting
- **Inputs**: List of input parameters
- **Outputs**: List of output parameters

### Exporting Workflows

- **Markdown Export**: Creates GitHub wiki-compatible documentation
- **JSON Export**: Structured data format for programmatic processing

### Managing Workflows

- **Save**: Persist workflows to local browser storage
- **Load**: Retrieve previously saved workflows
- **Delete**: Remove workflows from storage

## Project Structure

```
src/
├── components/
│   ├── NodeEditor/          # Main React Flow editor
│   ├── NodeTypes/           # Custom node components and editor
│   ├── NodePalette/         # Draggable node type palette
│   ├── ExportPanel/         # Export and workflow management UI
│   └── ErrorNotification/   # Error handling UI
├── context/
│   └── WorkflowContext.tsx  # Global state management
├── db/
│   └── index.ts             # IndexedDB storage layer
├── hooks/
│   └── useErrorHandler.ts   # Error handling hook
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   ├── nodeTemplates.ts     # Node type configurations
│   └── validation.ts        # Validation utilities
└── test/
    └── setup.ts             # Test configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm run test:run`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React Flow](https://reactflow.dev/) for the visual editor
- Uses [Monaco Editor](https://microsoft.github.io/monaco-editor/) for code editing
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons provided by [Lucide React](https://lucide.dev/)