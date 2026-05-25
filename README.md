# HireFlow AI — Interview Question Generator

AI-powered interview question generator for hiring teams. Enter a job title and seniority level to get tailored questions with **Look For** signals and **Red Flags** for each prompt, powered by [Google Gemini](https://ai.google.dev/).

## Features

- **Role-based generation** — Questions calibrated to job title and seniority (Intern through Executive)
- **Structured output** — Each question includes evaluation cues and warning signs
- **Question categories** — Quick starts for Cognitive, Technical, and Behavioral focus areas
- **Export** — Print or save interview kits as PDF from the browser
- **Dashboard** — Recent generations, analytics summary, and dark/light theme

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, Tailwind CSS |
| API | Vercel serverless function (`api/generate.js`) |
| AI | Google Generative AI SDK (`gemini-2.5-flash`) |

During local development, Vite emulates the `/api/*` routes so the frontend and API run on one dev server.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- A [Google AI Studio](https://aistudio.google.com/apikey) API key for Gemini

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Optional — only needed if the API is hosted on a different origin than the frontend:

```env
VITE_BACKEND_URL=https://your-deployed-app.vercel.app
```

For local dev, leave `VITE_BACKEND_URL` unset; requests go to `/api/generate` on the same host.

### 3. Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`). The Vite dev server loads `.env` and proxies `POST /api/generate` to the serverless handler.

### 4. Production build

```bash
npm run build
npm run preview
```

`npm run build` outputs static assets to `dist/`. Preview serves that folder locally.

## Deploying (Vercel)

1. Push the repository to GitHub and import the project in [Vercel](https://vercel.com).
2. Add **`GEMINI_API_KEY`** under Project → Settings → Environment Variables.
3. Deploy. `vercel.json` routes `/api/*` to serverless functions and all other paths to the SPA.

No separate backend service is required.

## API

**`POST /api/generate`**

Request body:

```json
{
  "jobTitle": "Customer Success Manager",
  "seniorityLevel": "Mid-Level"
}
```

Response (200):

```json
{
  "questions": [
    {
      "question": "…",
      "lookFor": ["…", "…"],
      "redFlags": ["…", "…"]
    }
  ]
}
```

## Project structure

```
├── api/
│   └── generate.js      # Gemini API handler (Vercel serverless)
├── public/              # Static assets (logo, hero image, favicon)
├── src/
│   ├── App.jsx          # Main UI and client logic
│   ├── main.jsx         # React entry
│   └── index.css        # Global styles
├── index.html           # HTML shell and Tailwind theme
├── vite.config.js       # Vite + local API emulator
├── vercel.json          # SPA + API routing for production
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with API emulation |
| `npm run build` | Build for production |
| `npm run preview` | Serve the production build locally |

## Security notes

- Never commit `.env` or expose `GEMINI_API_KEY` in client code; it is only read in `api/generate.js` on the server.
- Add `.env` to `.gitignore` if you use version control.

## License

Private project — all rights reserved unless otherwise specified.
