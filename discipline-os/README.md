# DisciplineOS Frontend

This is the high-performance user interface for DisciplineOS, built with Next.js and React. It features a premium design system tailored for productivity and deep work.

## Technologies

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (State Management)
- **Axios** (API Client)
- **Lucide React** (Icons)
- **Framer Motion** (Animations)

## Features

- **Dashboard**: High-level overview of daily discipline scores and trends.
- **Task Management**: Simple, distraction-free interface for managing daily tasks.
- **Habit Tracking**: Streak-based tracking for long-term consistency.
- **Identity System**: Goal-setting focused on "who you want to become."
- **Deep Analytics**: Radar charts and trend analysis to visualize performance.

## Getting Started

### Environment Variables

Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_PLANNING_ACCURACY=85
```

### Run Locally

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Architecture

- **`app/`**: Contains the page routes and layout structures.
- **`components/`**: Reusable UI components organized by feature or utility.
- **`store/`**: Zustand stores for global state (tasks, habits, identity).
- **`lib/`**: API client, utility functions, and mock data.
- **`types/`**: Global TypeScript definitions.
