# AI System Designer - Run Guide

Follow these steps to get the project running locally:

## 1. Environment Configuration

Ensure you have a `.env` file in the root directory with your n8n webhook URL:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/analyze-architecture
```

## 2. Install Dependencies

If you haven't already, install the required packages:

```bash
npm install
```

## 3. Start the Development Server

This command starts both the Express backend and the Vite frontend:

```bash
npm run dev
```

The server will start on **port 5000** (or 5001 if 5000 is occupied).

## 4. Access the Application

Open your browser and navigate to:
[http://localhost:5000](http://localhost:5000)

## Troubleshooting

- **Port Conflict**: If you see `EADDRINUSE`, the server will automatically try port 5001. Check your browser at [http://localhost:5001](http://localhost:5001).
- **Mermaid Not Rendering**: Ensure you have an active internet connection or that the n8n workflow is returning valid Mermaid syntax.
- **Runtime Errors**: If you see "useState" errors, try restarting the dev server (`Ctrl+C` then `npm run dev`).
