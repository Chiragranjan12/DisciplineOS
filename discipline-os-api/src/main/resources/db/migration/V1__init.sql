-- DisciplineOS Database Migration V1
-- Initial schema for all entities

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id),
    identity_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Identities table
CREATE TABLE identities (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    progress_percent DOUBLE PRECISION DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    health_weight DOUBLE PRECISION DEFAULT 1.0,
    skills_weight DOUBLE PRECISION DEFAULT 1.0,
    career_weight DOUBLE PRECISION DEFAULT 1.0,
    finance_weight DOUBLE PRECISION DEFAULT 1.0,
    relationships_weight DOUBLE PRECISION DEFAULT 1.0,
    mindset_weight DOUBLE PRECISION DEFAULT 1.0,
    user_id UUID REFERENCES users(id) UNIQUE
);

-- Update users table to add foreign key to identities
ALTER TABLE users ADD CONSTRAINT fk_user_identity FOREIGN KEY (identity_id) REFERENCES identities(id);

-- Identity habit IDs (element collection)
CREATE TABLE identity_habit_ids (
    identity_id UUID REFERENCES identities(id) ON DELETE CASCADE,
    habit_id UUID
);

-- Identity task IDs (element collection)
CREATE TABLE identity_task_ids (
    identity_id UUID REFERENCES identities(id) ON DELETE CASCADE,
    task_id UUID
);

-- Habits table
CREATE TABLE habits (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    life_area VARCHAR(50) NOT NULL,
    target_frequency VARCHAR(50) NOT NULL,
    completed_today BOOLEAN DEFAULT FALSE,
    streak INTEGER DEFAULT 0,
    base_weight INTEGER DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    life_area VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    planned_duration_minutes INTEGER,
    base_weight INTEGER DEFAULT 1,
    date DATE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Daily scores table
CREATE TABLE daily_scores (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    score INTEGER NOT NULL,
    task_completion_percent INTEGER,
    habit_completion_percent INTEGER,
    planning_accuracy INTEGER,
    reflection_completed BOOLEAN DEFAULT FALSE,
    health_weight DOUBLE PRECISION,
    skills_weight DOUBLE PRECISION,
    career_weight DOUBLE PRECISION,
    finance_weight DOUBLE PRECISION,
    relationships_weight DOUBLE PRECISION,
    mindset_weight DOUBLE PRECISION,
    penalty_applied DOUBLE PRECISION,
    UNIQUE(user_id, date)
);

-- Reflections table
CREATE TABLE reflections (
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    went_well TEXT,
    distracted TEXT,
    failure_reason VARCHAR(50),
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_tasks_user_date ON tasks(user_id, date);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_daily_scores_user_date ON daily_scores(user_id, date);
CREATE INDEX idx_reflections_user_date ON reflections(user_id, date);
CREATE INDEX idx_users_email ON users(email) UNIQUE;

-- Insert default role
INSERT INTO roles (id, name) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ROLE_USER') ON CONFLICT (name) DO NOTHING;