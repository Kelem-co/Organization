<div align="center">
  <img src="./public/logo.svg" alt="Organization Dashboard logo" width="140" height="140">
  <br><br>
  <h1>Organization Dashboard</h1>
  <p><em>Organization and school operations dashboard built with Next.js</em></p>
  <br>
  <p>
    <strong>Course:</strong> Software Engineering Final Year Project<br>
    <strong>Institution:</strong> Addis Ababa Science and Technology University
  </p>
  <br>
  <p>
    <strong>Collaborators:</strong><br>
    <a href="https://github.com/fitiha">fitiha</a> ·
    <a href="https://github.com/NahomTesM">NahomTesM</a> ·
    <a href="https://github.com/oddegen">oddegen</a> ·
    <a href="https://github.com/RobelD420">RobelD420</a> ·
    <a href="https://github.com/Tonetor777">Tonetor777</a>
  </p>
</div>

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)
8. [Development Notes](#development-notes)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

Kelem is a Next.js application that helps schools and educational organizations manage onboarding and daily operations from a single interface. It includes public-facing flows such as landing, login, activation, password reset, and organization onboarding, as well as authenticated portal pages for dashboard insights, schools, branches, analytics, billing, and settings.

The codebase uses the App Router, TypeScript, a centralized API layer, reusable form and media utilities, and modular feature folders to keep product flows maintainable as the platform grows.

---

## Key Features

| Area | Description |
|---|---|
| **Authentication Flows** | Login, account activation, password reset, email confirmation, and manual verification screens. |
| **Organization Onboarding** | Guided onboarding flow for setting up organizations, capturing details, and moving users toward approval and activation. |
| **Portal Dashboard** | Authenticated dashboard experience with organization-aware navigation and summary views. |
| **School & Branch Management** | API-backed hooks and pages for schools, branch details, and related operational data. |
| **Analytics & Billing** | Dedicated portal routes and types for analytics reporting and billing workflows. |
| **Settings & Profile Data** | Centralized settings models and services for maintaining organization configuration. |
| **Media Upload Support** | Shared `MediaUploader` and media client utilities for forms that attach or remove media. |
| **Reusable UI Foundation** | Shared inputs, modals, phone number fields, legal modal, and `shadcn/ui` primitives. |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Component Primitives | `shadcn/ui`, Radix UI |
| Charts | Recharts |
| Maps | `@vis.gl/react-google-maps` |
| Testing | Vitest, Testing Library, JSDOM, MSW |
| Tooling | ESLint, Prettier, Turbopack |

---

## Project Structure

```text
.
├── app/                     # Next.js routes, layouts, and page entry points
│   ├── (portal)/            # Authenticated portal pages
│   ├── activate/            # Account activation flow
│   ├── landing/             # Marketing landing page
│   ├── login/               # Authentication entry
│   ├── onboarding/          # Organization onboarding
│   └── ...                  # Status, reset, selection, and verification pages
├── components/              # Shared UI components and shadcn/ui primitives
├── docs/                    # Project-specific implementation notes
├── hooks/                   # Shared React hooks
├── public/                  # Static assets such as logo.svg
├── src/
│   ├── components/          # Shared form and utility components
│   ├── context/             # Auth and organization providers
│   ├── features/            # Feature modules such as dashboard and onboarding
│   ├── lib/
│   │   ├── api/             # API client, config, token handling, cache, errors
│   │   ├── media/           # Media upload, URL resolution, delete helpers
│   │   ├── services/        # Domain service layer for backend integration
│   │   ├── types/           # Shared domain types
│   │   └── utils/           # Validation and UI helpers
│   ├── types/               # Extra project type declarations
│   └── __tests__/           # Test setup and integration coverage
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A running backend API for full integration flows

### Installation

```bash
git clone <your-repository-url>
cd Organization
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Environment Variables

Copy the example file and update it for your environment:

```bash
cp .env.example .env.local
```

Core variables used by the app include:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_API_TIMEOUT=30000
```

Notes:

- Use `.env.local` for local development values.
- Restart the dev server after changing environment variables.
- `NEXT_PUBLIC_` variables are exposed to the client and should only contain safe public configuration.
- Keep `.env.example` updated when adding new required configuration.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local dev server with Turbopack |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks without emitting files |
| `npm run test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage output |
| `npm run format` | Format TypeScript and TSX files with Prettier |

---

## Development Notes

### API Integration

All backend communication is funneled through the shared API layer in [`src/lib/api`](./src/lib/api) and domain services in [`src/lib/services`](./src/lib/services). This keeps request configuration, token handling, caching, and error normalization consistent across features.

### Media Forms

Forms that use `MediaUploader` should treat upload and removal actions as blocking operations. The submit action must wait until media work is finished and a final media ID is ready.

---

## Testing

This project uses Vitest with Testing Library and JSDOM for component and utility testing, plus MSW for request mocking when needed.

Common commands:

```bash
npm run test
npm run test:watch
npm run test:coverage
```

---

## Troubleshooting

### Environment values are not updating

- Confirm the variable is defined in `.env.local`.
- Restart the development server after editing environment files.
- Make sure public client-side variables begin with `NEXT_PUBLIC_`.

### API requests are failing

- Verify `NEXT_PUBLIC_API_BASE_URL` points to the correct backend.
- Check whether the backend server is reachable.
- Confirm the relevant feature flag is enabled when testing live integration.
- Inspect browser and terminal logs for request or authentication errors.

### UI changes are not appearing as expected

- Restart `npm run dev` if route or environment behavior seems stale.
- Run `npm run lint` and `npm run typecheck` to catch structural issues early.


---

<div align="center">
  <p>
    <strong>Addis Ababa Science and Technology University</strong><br>
    Faculty of Electrical and Computer Engineering<br>
    Department of Software Engineering
  </p>
  <p>
    <em>© 2026 Kelem Organization Dashboard. All rights reserved.</em>
  </p>
</div>