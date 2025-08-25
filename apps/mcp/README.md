# Kiro MCP Server

This directory contains the Model Context Protocol (MCP) server implementation for Kiro Workflow Editor. The MCP server provides AI assistants with direct access to workflow data and operations.

## Overview

The MCP server acts as a bridge between AI assistants and the Kiro Workflow Editor API, allowing:

- Creation and modification of workflows
- Node management and editing
- Export and import operations
- Workflow analysis and optimization

## Architecture

```
AI Assistant <-> MCP Server <-> Kiro API <-> Database
```

The MCP server communicates with the Kiro API backend, which manages the SQLite database containing workflow data.

## Features

### Workflow Operations
- List all workflows
- Create new workflows
- Update existing workflows
- Delete workflows
- Export to Markdown/JSON

### Node Operations
- Add nodes to workflows
- Update node properties
- Delete nodes
- Connect/disconnect nodes

### Analysis Tools
- Workflow validation
- Performance analysis
- Optimization suggestions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your Kiro API endpoint
```

3. Build and start:
```bash
npm run build
npm start
```

## MCP Client Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "kiro-workflow": {
      "command": "node",
      "args": ["path/to/kiro-mcp/dist/index.js"],
      "env": {
        "KIRO_API_URL": "http://localhost:3001/api"
      }
    }
  }
}
```

## Available Tools

- `list_workflows` - List all workflows
- `get_workflow` - Get workflow details by ID
- `create_workflow` - Create a new workflow
- `update_workflow` - Update workflow properties
- `delete_workflow` - Delete a workflow
- `add_node` - Add a node to a workflow
- `update_node` - Update node properties
- `delete_node` - Delete a node from workflow
- `export_markdown` - Export workflow as Markdown
- `export_json` - Export workflow as JSON
- `validate_workflow` - Validate workflow structure

## Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Run linter
```