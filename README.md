# DisciplineOS

DisciplineOS is a high-performance productivity ecosystem designed for software engineers and professionals who follow a disciplined approach to their daily routines. It combines task management, habit tracking, and identity-based goal setting with deep analytics.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS, Java 17, Spring Boot 3.2, PostgreSQL, Flyway, Spring Security/JWT, Zustand, and Recharts.

## Preview

- **Dashboard**: Daily discipline score, active tasks, and habit completion at `http://localhost:3000/`
- **Commitments**: Task planning and habit management at `http://localhost:3000/commitments`
- **Identity**: Identity-based goal setup at `http://localhost:3000/identity`
- **Analytics**: Trends, weak areas, and failure patterns at `http://localhost:3000/analytics`

## Project Structure

- **`discipline-os-api/`**: The backend services built with Java 17, Spring Boot 3.2, and PostgreSQL. It handles authentication, data persistence, and discipline score calculations.
- **`discipline-os/`**: The frontend application built with Next.js 16 (App Router), TypeScript, and Tailwind CSS. It provides a premium, high-performance UI for interacting with the system.

## PostgreSQL Setup

### Prerequisites

- Java 17
- Node.js (v18+)
- PostgreSQL 14+ running locally

### Create the Database

Create a PostgreSQL database named `disciplineos`:

```sql
CREATE DATABASE disciplineos;
```

The backend defaults to:

- URL: `jdbc:postgresql://localhost:5432/disciplineos`
- Username: `postgres`
- Password: set with `DB_PASSWORD`

### Configure Environment Variables

Copy the example environment file and update the database password and JWT secret:

```bash
cp .env.example .env
```

Required values:

```env
DB_URL=jdbc:postgresql://localhost:5432/disciplineos
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_base64_encoded_secret_key_here_at_least_256_bits
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Run the Backend

Flyway applies the schema from `discipline-os-api/src/main/resources/db/migration` when the backend starts.

```bash
cd discipline-os-api
mvn spring-boot:run
```

Once the backend is running, access Swagger UI at:

```text
http://localhost:8080/swagger-ui.html
```

### Run the Frontend

```bash
cd discipline-os
npm install
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## How to Use DisciplineOS

DisciplineOS follows a structured daily workflow to help you build discipline and achieve your goals.

### Step 1: Getting Started (One-Time Setup)

1. **Register & Log In**
   Go to `/register` and create your account with your name, email, and password.
   You will be logged in automatically.

2. **Set Your Identity** at `/identity`
   This is the most important step. Your Identity is the person you are actively becoming.

   Examples:
   - "High-Performance Software Engineer"
   - "Disciplined Athlete & Entrepreneur"

   Set:
   - A clear **Title**: who you're becoming
   - A **Description**: what that looks like in practice
   - A **Target Date**: deadline to achieve it

   This identity becomes your north star. Every task and habit you add should serve it.

3. **Create Your Habits** at `/commitments`
   Add non-negotiable daily or weekly behaviors that define your identity.

   Examples:
   - Deep work session, 90 min (Life Area: Skills), Daily
   - Physical training (Life Area: Health), Daily
   - Financial review (Life Area: Finance), Weekly

   These repeat every day and build streaks over time.

### Step 2: Your Daily Routine (Do This Every Day)

#### Morning: Plan at `/commitments`

Add today's **Tasks**, the specific things you need to get done today.

For each task, set:
- **Life Area**: Health / Skills / Career / Finance / Relationships / Mindset
- **Priority**: High / Medium / Low
- **Duration**: How many minutes you plan to spend

Aim for 3-5 focused tasks. Don't overplan.

#### Throughout the Day: Check Off on Dashboard (`/`)

The Dashboard is your command center. Here you can:
- Tap tasks to mark them complete
- See habit chips at the bottom (done vs. pending)
- Watch your Discipline Score update live

Your Discipline Score is calculated as:
- **Tasks completed**: 40%
- **Habits completed**: 30%
- **Reflection done**: 20%
- **Planning accuracy**: 10%

#### Evening: Reflect at `/reflection`

Before bed, answer 3 quick questions:

1. What went well today?
2. What distracted me?
3. Why did I miss things? Choose from reasons like Distraction, Laziness, Fatigue, Overplanning, and more.

Completing your reflection gives you **+5 bonus points** on your score and unlocks the full analytics picture.

### Step 3: Weekly Review (Once a Week)

Open `/analytics` to see:
- **30-Day Discipline Index**: your structural average score
- **7-Day Trend**: are you going up or down?
- **Weakest Life Area**: where you're consistently failing
- **Top Failure Mode**: most common reason for breaking discipline

Use this to adjust next week's habits and task priorities.

### The Core Daily Loop

```text
Set Identity -> Add Habits -> Plan Tasks -> Execute -> Reflect
       ^                                                  |
       |--------- Review Analytics weekly ----------------|
```

### Score Targets

- **85+**: Elite, exceptional consistency
- **70-84**: Strong, on track, keep going
- **55-69**: Moderate, room to tighten up
- **40-54**: Below Target, review your plan
- **Below 40**: Critical, something needs to change

If your score drops below 55 for three days in a row, open `/reflection` and `/analytics`; something is off.

The whole idea is simple: every day, show up for your identity. The score just makes it measurable.

## Architecture

DisciplineOS follows a modern client-server architecture:

- **Stateless Authentication**: JWT-based security using Spring Security.
- **Data Model**: PostgreSQL for persistent storage with JPA/Hibernate.
- **State Management**: Zustand on the frontend for reactive data handling.
- **Responsive Design**: Tailored for both deep work desktop sessions and quick mobile check-ins.
