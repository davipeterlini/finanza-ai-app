# Finanza AI

AI-powered personal finance manager for Brazilian users.

## Features

- Dashboard with balance projection and financial summaries
- Transaction management with auto-categorization
- Budget tracking per category
- Financial goals with progress tracking
- AI-powered financial advisor (Gemini)
- Open Finance integration (Pluggy API) for Brazilian banks
- Google OAuth authentication
- Google Drive backup

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 3
- Vitest + Testing Library
- Google OAuth (@react-oauth/google)
- Gemini AI API for financial advice

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
GEMINI_API_KEY=your_gemini_api_key (optional)
```

## Deployment

The app is configured for Google Cloud Run deployment with Docker.

```bash
# Build Docker image
docker build -t finanza-ai-app .

# Run locally
docker run -p 8080:8080 finanza-ai-app
```

## License

Private - All rights reserved