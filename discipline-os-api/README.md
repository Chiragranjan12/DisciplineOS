# DisciplineOS Backend API

Core service for DisciplineOS — handles tasks, habits, scoring, and analytics.

## Technologies

- **Java 17**
- **Spring Boot 3.2**
- **Spring Security (JWT)**
- **Spring Data JPA / Hibernate**
- **PostgreSQL 15+**
- **Lombok**
- **Maven**

---

## PostgreSQL Setup (Required before running)

1. **Install PostgreSQL** from https://www.postgresql.org/download/windows/
   - During install, set username: `postgres` and password: `Chir@gMishr@12`

2. **Create the database** — open pgAdmin or psql and run:
   ```sql
   CREATE DATABASE disciplineos;
   ```

3. **Create local properties file** — create the file:
   `discipline-os-api/src/main/resources/application-local.properties`
   with your local credentials (see application-local.properties.example)

---

## Running the Server

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

The server starts on **http://localhost:8080**.
Hibernate will auto-create all tables on first run (`ddl-auto: update`).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Optional | Base64 JWT secret. A dev default is used if not set. |
| `CORS_ALLOWED_ORIGINS` | Optional | Comma-separated allowed origins. Defaults to `http://localhost:3000` |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |
| GET | `/api/v1/tasks` | List tasks for a date |
| POST | `/api/v1/tasks` | Create a task |
| PATCH | `/api/v1/tasks/{id}/toggle` | Toggle task completion |
| GET | `/api/v1/habits` | List habits |
| POST | `/api/v1/habits` | Create a habit |
| PATCH | `/api/v1/habits/{id}/toggle` | Toggle habit completion |
| GET | `/api/v1/daily-logs/{date}` | Get daily log + score |
| POST | `/api/v1/daily-logs/{date}/reflection` | Save daily reflection |
| GET | `/api/v1/analytics/summary` | 30-day performance summary |
| GET | `/api/v1/analytics/weekly-scores` | Last 7 day scores |
| GET | `/api/v1/analytics/radar-data` | Life area radar chart data |
| GET | `/api/v1/identity` | Get user identity |
| PATCH | `/api/v1/identity` | Update user identity |
