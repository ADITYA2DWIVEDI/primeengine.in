# Prime Engine

An AI-powered no-code platform for building full-stack web applications using natural language prompts.

![Prime Engine](https://img.shields.io/badge/Prime-Engine-6366f1?style=for-the-badge)

## Features

- 🤖 **AI-Powered Generation** - Describe your app in plain English
- 🎨 **Visual Editor** - Drag-and-drop interface for customization
- 🚀 **One-Click Deploy** - Deploy to the cloud instantly
- 📦 **Export to GitHub** - Full code ownership, no lock-in
- 🔐 **Firebase Auth** - Secure authentication out of the box
- 💳 **Stripe Billing** - Subscription management built-in

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Zustand
- **Backend**: Node.js, Express, PostgreSQL
- **Auth**: Firebase Authentication
- **Payments**: Stripe
- **AI**: Google Vertex AI (Gemini)
- **Deployment**: Docker, Google Cloud Run

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Firebase project
- Stripe account
- Google Cloud project (for AI)

### Setup

1. **Clone and install**
   ```bash
   cd prime-engine
   
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Or run locally**
   ```bash
   # Terminal 1 - Database
   docker-compose up postgres
   
   # Terminal 2 - Backend
   cd backend && npm run dev
   
   # Terminal 3 - Frontend
   cd frontend && npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000

## Project Structure

```
prime-engine/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities
│   │   └── store/     # Zustand stores
│   └── Dockerfile
├── backend/            # Express API
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── middleware/# Auth, errors
│   │   ├── services/  # Business logic
│   │   └── config/    # Database, Firebase
│   └── Dockerfile
├── database/
│   └── schema.sql     # PostgreSQL schema
├── docker-compose.yml
└── .env.example
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Authenticate |
| POST | /api/auth/google | Google OAuth |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| POST | /api/generate | AI generation |
| GET | /api/templates | List templates |
| POST | /api/billing/checkout | Stripe checkout |

## Environment Variables

See `.env.example` for all required variables.

## Deployment

### Google Cloud Run

```bash
# Build and push images
gcloud builds submit --tag gcr.io/PROJECT_ID/prime-engine-api ./backend
gcloud builds submit --tag gcr.io/PROJECT_ID/prime-engine-web ./frontend

# Deploy
gcloud run deploy prime-engine-api --image gcr.io/PROJECT_ID/prime-engine-api
gcloud run deploy prime-engine-web --image gcr.io/PROJECT_ID/prime-engine-web
```

## License

MIT License - build something amazing! 🚀
