# NeuraDB

> **AI-Powered Visual Database Schema Architect & Modeling Workspace**

NeuraDB transforms the way software teams, architects, and technical leaders design relational databases. By bridging natural language business specifications with interactive visual modeling, NeuraDB allows you to ideate, visualize, and refine complex database architectures in seconds.

---

## Executive Summary & Business Value

Designing a solid data foundation is one of the most critical stages in any software initiative. Traditional database design typically forces teams to switch between text-heavy specification documents, tedious manual diagramming tools, and low-level SQL scripts. This workflow often leads to misaligned requirements, communication gaps between business stakeholders and engineering teams, and costly architectural rework.

**NeuraDB solves this by providing a unified, prompt-driven visual workspace:**

- **Accelerate Time-to-Market**: Transition from a raw business requirement or user story to an actionable relational entity diagram in moments.
- **Bridge the Technical-Business Gap**: Product managers, domain experts, and engineers can collaborate around an intuitive, live visual canvas that updates in real time.
- **Reduce Architectural Errors**: Eliminate blind spots in entity relationships, missing foreign keys, or structural redundancies before writing production code.
- **Lower Cognitive Overhead**: Iterate freely through conversation without getting bogged down by manual drafting or tool-specific syntax.

---

## Key Functionalities & Features

### 1. Natural Language Schema Synthesis
Describe your business domain in plain English (e.g., *"Design an e-commerce platform with customer tiers, product variants, inventory, and order fulfillments"*). NeuraDB automatically plans and structures:
- Complete entity definitions (tables) with appropriate data types.
- Primary key assignments and constraints.
- Foreign key dependencies and relational mappings.

### 2. Interactive Visual Modeling Canvas
- **Dynamic Node-Based Diagramming**: View your database schema as clear, structured table nodes with explicit column types and relationship connectors.
- **Flexible Canvas Navigation**: Drag and reposition tables, pan across large multi-table architectures, and zoom in/out with full canvas controls.
- **Automated Relationship Routing**: Visually follow connections from foreign key source fields directly to target primary keys across tables.

### 3. Conversational Schema Evolution
Database modeling is an iterative process. With NeuraDB, you don't start from scratch when requirements evolve:
- Request additions, alterations, or removals conversationally (e.g., *"Add a subscription billing table linked to organizations"* or *"Introduce a soft-delete status to the orders table"*).
- Watch your visual workspace intelligently update while preserving your context and table layout.

### 4. Built-in Database Intelligence & Advisory
Beyond structural schema generation, NeuraDB serves as an intelligent architectural advisor:
- Ask conceptual database questions directly inside the chat panel (e.g., *"What is the best way to handle polymorphic associations?"* or *"How should I normalize customer shipping versus billing addresses?"*).
- Receive domain guidance without disrupting your active visual schema.

---

## Who Is NeuraDB For?

- **Software Engineers & Technical Leads**: Quickly bootstrap new services and microservice schemas with validated relational structures.
- **Product Managers & Solution Architects**: Prototype data models directly from business requirements during discovery and sprint planning.
- **Founders & Indie Hackers**: Ideate and validate full-stack data models without spending hours manually drawing ER diagrams.
- **Educators & Students**: Learn and teach database normalization, relational mapping, and schema design principles interactively.

---

## Prerequisites

Before setting up NeuraDB locally, ensure you have the following installed:

1. **Node.js**: Version `18.18.0` or higher (Node 20+ LTS recommended)
2. **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`
3. **Ollama**: An active local or remote [Ollama](https://ollama.com/) instance for local LLM inference

---

## Setup & Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd neuraDB
```

### 2. Install Dependencies
Install the required application packages using your preferred package manager:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up Ollama & Download the Model
NeuraDB utilizes local AI inference powered by Ollama (defaulting to `llama3.1:8b`).

1. Download and start [Ollama](https://ollama.com/).
2. Pull the default model:
   ```bash
   ollama run llama3.1:8b
   ```
   *(Ensure Ollama is running in the background at `http://127.0.0.1:11434`)*

### 4. Configure Environment Variables (Optional)
You can customize the model name or host configuration by creating a `.env.local` file:

```bash
cp .env.example .env.local
```

Adjust the parameters if needed:
```env
# Default model used for schema generation
OLLAMA_MODEL=llama3.1:8b

# Optional: Remote or custom Ollama host (defaults to http://127.0.0.1:11434)
# OLLAMA_HOST=http://127.0.0.1:11434
```

### 5. Start the Development Server
Run the local Next.js development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## How to Use NeuraDB

1. **Open the AI Assistant Panel**: Locate the chat interface on the right side of the screen.
2. **Describe Your Data Model**: Enter a prompt describing your project requirements (e.g., *"Create a blogging platform with users, posts, categories, and tags with many-to-many relationships"*).
3. **Submit Your Prompt**: Press `Ctrl + Enter` (or `Cmd + Enter`) or click the **Send** button.
4. **Explore the Canvas**: Your database tables will appear on the interactive canvas. Reposition tables, examine column structures, and inspect foreign key connections.
5. **Iterate & Refine**: Continue chatting to modify existing tables, add new features, or ask general database design questions.

---

## Production Build

To build and run the optimized application for production:

```bash
npm run build
npm run start
```

---

## License

This project is licensed under the terms defined in the repository.
