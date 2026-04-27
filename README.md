# DisciplineOS

DisciplineOS is a high-performance productivity ecosystem designed for software engineers and professionals who follow a disciplined approach to their daily routines. It combines task management, habit tracking, and identity-based goal setting with deep analytics.

## Project Structure

- **`discipline-os-api/`**: The backend services built with Java 17, Spring Boot 3.2, and PostgreSQL. It handles authentication, data persistence, and discipline score calculations.
- **`discipline-os/`**: The frontend application built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. It provides a premium, high-performance UI for interacting with the system.

## Getting Started

### Prerequisites

- Java 17
- Node.js (v18+)
- Docker (for PostgreSQL) or a local PostgreSQL instance

### Quick Start

1. **Database Setup**:
   ```bash
   cd discipline-os-api
   docker-compose up -d
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and configure your database and JWT settings:
   ```bash
   cp .env.example .env
   ```

3. **Start Backend**:
   ```bash
   cd discipline-os-api
   mvn spring-boot:run
   ```

4. **Start Frontend**:
   ```bash
   cd discipline-os
   npm install
   npm run dev
   ```

### API Documentation

Once the backend is running, access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## How to Use

DisciplineOS follows a structured daily workflow to help you build discipline and achieve your goals.

### Step 1 — Getting Started (One-Time Setup)

1. **Register & Log In**
   Go to `/register` → create your account (name, email, password).
   You will be logged in automatically.

2. **Set Your Identity** → `/identity`
   This is the most important step. Your Identity is the person you are actively becoming.

   Examples:
   - "High-Performance Software Engineer"
   - "Disciplined Athlete & Entrepreneur"

   Set:
   - A clear **Title** (who you're becoming)
   - A **Description** (what that looks like in practice)
   - A **Target Date** (deadline to achieve it)

   This identity becomes your north star. Every task and habit you add should serve it.

3. **Create Your Habits** → `/commitments`
   Add non-negotiable daily/weekly behaviors that define your identity.

   Examples:
   - Deep work session — 90 min (Life Area: Skills) — Daily
   - Physical training (Life Area: Health) — Daily
   - Financial review (Life Area: Finance) — Weekly

   These repeat every day and build streaks over time.

### Step 2 — Your Daily Routine (Do This Every Day)

#### Morning: Plan at `/commitments`

Add today's **Tasks** — the specific things you need to get done today.
For each task, set:
- **Life Area**: Health / Skills / Career / Finance / Relationships / Mindset
- **Priority**: High / Medium / Low
- **Duration**: How many minutes you plan to spend

Aim for 3–5 focused tasks. Don't overplan.

#### Throughout the Day: Check off on Dashboard (`/`)

The Dashboard is your command center. Here you can:
- Tap tasks to mark them complete
- See habit chips at the bottom (done vs. pending)
- Watch your Discipline Score update live

Your Discipline Score is calculated as:
- **Tasks completed** → 40%
- **Habits completed** → 30%
- **Reflection done** → 20%
- **Planning accuracy** → 10%

#### Evening: Reflect at `/reflection`

Before bed, answer 3 quick questions:
1. What went well today?
2. What distracted me?
3. Why did I miss things? (choose: Distraction / Laziness / Fatigue / Overplanning / etc.)

Completing your reflection gives you **+5 bonus points** on your score and unlocks the full analytics picture.

### Step 3 — Weekly Review (Once a Week)

Open `/analytics` to see:
- **30-Day Discipline Index** — your structural average score
- **7-Day Trend** — are you going up or down?
- **Weakest Life Area** — where you're consistently failing
- **Top Failure Mode** — most common reason for breaking discipline

Use this to adjust next week's habits and task priorities.

### The Core Daily Loop

```
Set Identity → Add Habits → Plan Tasks → Execute → Reflect
       ↑                                                  |
       └──────────────────────────────────────────────────┘
```

## Architecture

DisciplineOS follows a modern client-server architecture:
- **Stateless Authentication**: JWT-based security using Spring Security.
- **Data Model**: PostgreSQL for persistent storage with JPA/Hibernate.
- **State Management**: Zustand on the frontend for reactive data handling.
- **Responsive Design**: Tailored for both deep work desktop sessions and quick mobile check-ins.
