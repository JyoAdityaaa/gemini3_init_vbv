# Architect AI

AI-powered architecture review and systems design simulator for evaluating cloud and software architecture decisions before implementation.

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-98.3%25-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express" alt="Express 5" />
  <img src="https://img.shields.io/badge/Gemini-AI-8A2BE2?style=for-the-badge&logo=google" alt="Gemini AI" />
</p>

## Overview

Architect AI is a full-stack TypeScript application that simulates a multi-agent architecture review system. Users describe a system or product idea, and the platform analyzes it across multiple dimensions such as performance, cost, reliability, security, and scalability.

The system uses specialized AI agents to provide architecture reasoning and produce a structured output including:

- risk assessment
- cost estimates
- critical bottlenecks
- recommended improvements
- architecture diagrams and topology views

This project demonstrates practical AI orchestration, system-design thinking, and full-stack product development in a single application.

## Why this project matters

This repo showcases the ability to build an intelligent product that blends:

- AI-driven analysis
- frontend visualization
- backend orchestration
- cloud/system architecture reasoning
- modern web application engineering

It is well suited for a portfolio, resume, or technical product showcase because it demonstrates both technical execution and product thinking.

## Features

### Multi-agent architecture analysis
The app uses domain-specific AI reasoning to assess a system from several perspectives:

- Performance Architect
- Cost Architect
- Reliability Architect
- Security Architect
- Consensus Engine

Each agent produces findings and reasoning that are consolidated into a final system recommendation.

### Interactive architecture simulation
Users can enter a system description and receive:

- risk score
- estimated monthly cost
- architecture diagram
- bottlenecks and failure points
- scalability constraints
- suggested improvements

### Visual reporting
The frontend presents the results in an interactive UI with:

- agent result cards
- architecture diagram rendering
- topology visualization
- markdown/text report generation
- copy-to-clipboard workflows

### Full-stack architecture
The project is built using a modern TypeScript stack:

- React + Vite for the frontend
- Express for the backend API
- Gemini AI integration for reasoning
- n8n workflow support for orchestration
- Drizzle ORM and PostgreSQL-ready data layer

## Tech stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Wouter
- Lucide React
- shadcn-inspired UI components

### Backend
- Node.js
- Express 5
- TypeScript
- Google GenAI SDK
- n8n webhook integration

### Database/Infra
- Drizzle ORM
- PostgreSQL support
- environment-based configuration
- build and deployment automation

## Project structure

```text
client/                 # Frontend application
  ├─ public/
  ├─ src/
  │  ├─ components/
  │  ├─ hooks/
  │  ├─ lib/
  │  ├─ pages/
  │  ├─ App.tsx
  │  └─ main.tsx

server/                 # Backend API and AI orchestration
  ├─ geminiService.ts
  ├─ index.ts
  ├─ routes.ts
  ├─ static.ts
  ├─ storage.ts
  ├─ types.ts
  └─ vite.ts

shared/                 # Shared app logic
script/                 # Build automation
workflow.json           # Workflow definition
package.json            # Scripts and dependencies
vite.config.ts         # Vite config
```

## How it works

1. A user describes an architecture or system concept.
2. The frontend sends the prompt to the backend API.
3. The backend prepares the payload and forwards it to the AI workflow.
4. AI agents analyze the architecture across different concerns.
5. The consensus layer synthesizes the final output.
6. The UI renders the results with diagrams, reasoning, and recommendations.

## Getting started

### Prerequisites

- Node.js 18+
- npm
- Google Gemini API key
- optional: n8n webhook for workflow integration

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root:

```env
API_KEY=your_google_gemini_api_key
N8N_WEBHOOK_URL=http://localhost:5678/webhook/analyze-architecture
```

### Run the app

```bash
npm run dev
```

Then open:

```text
http://localhost:5000
```

## Example use cases

- evaluate a microservices system
- review a cloud migration architecture
- assess performance and reliability trade-offs
- identify scaling bottlenecks early
- estimate cost and risk before deployment
- turn architecture conversations into structured technical recommendations

## Repository

GitHub: https://github.com/JyoAdityaaa/gemini3_init_vbv

## Impact and value

This project reflects a strong combination of:

- AI engineering
- software architecture thinking
- full-stack development
- product design and user experience
- system analysis and troubleshooting

It is especially compelling for recruiters because it shows an ability to build intelligent, modern, and problem-solving software products that go beyond basic CRUD or tutorial apps.

## Future enhancements

- user authentication and saved reports
- improved architecture visualization
- multi-cloud comparison analysis
- stronger persistence and analytics
- deployment telemetry integration
- enhanced cost optimization recommendations

## License

This project is intended for personal/prototype use. Please review the repository for any licensing details before reuse or commercial deployment.

---

Built to help teams reason about architecture before they build it.
