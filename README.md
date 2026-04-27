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

2. **Start Backend**:
   ```bash
   cd discipline-os-api
   mvn spring-boot:run
   ```

3. **Start Frontend**:
   ```bash
   cd discipline-os
   npm install
   npm run dev
   ```

## Architecture

DisciplineOS follows a modern client-server architecture:
- **Stateless Authentication**: JWT-based security using Spring Security.
- **Data Model**: PostgreSQL for persistent storage with JPA/Hibernate.
- **State Management**: Zustand on the frontend for reactive data handling.
- **Responsive Design**: Tailored for both deep work desktop sessions and quick mobile check-ins.
