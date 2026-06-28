-- EduSync initial schema
-- Run automatically by Flyway on first startup

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    subjects VARCHAR(500),
    workload_hours DOUBLE PRECISION,
    leave_status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    form INTEGER,
    class_name VARCHAR(100),
    attendance_pct DOUBLE PRECISION,
    avg_score DOUBLE PRECISION,
    status VARCHAR(50),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE class_rooms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    form INTEGER,
    home_teacher_id BIGINT REFERENCES staff(id),
    size INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    form_applicability VARCHAR(100)
);

CREATE TABLE attendance_records (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE exam_results (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    subject_id BIGINT NOT NULL REFERENCES subjects(id),
    score DOUBLE PRECISION,
    exam_type VARCHAR(50),
    date DATE
);

CREATE TABLE fee_records (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    amount DECIMAL(10,2),
    status VARCHAR(50),
    due_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE bursaries (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id),
    type VARCHAR(100),
    amount DECIMAL(10,2),
    status VARCHAR(50)
);

CREATE TABLE notices (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    body TEXT,
    audience VARCHAR(100),
    status VARCHAR(50),
    published_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE,
    location VARCHAR(255),
    type VARCHAR(100)
);

CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id),
    type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50)
);

CREATE TABLE campuses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    student_count INTEGER,
    classroom_count INTEGER,
    operational_status VARCHAR(100)
);

CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    action VARCHAR(50),
    performed_by VARCHAR(255),
    changed_at TIMESTAMP DEFAULT NOW(),
    details TEXT
);

-- Seed: default admin user (password: Admin@123 — bcrypt hash)
INSERT INTO users (name, email, role, password_hash, created_at, updated_at)
VALUES (
    'System Admin',
    'admin@edusync.my',
    'PRINCIPAL',
    '$2a$12$VjXq5Cg0NUhxbJyRPGF.X.a/oHpXr8Cz6RQ4YPl3OhSI5pniXN6i',
    NOW(), NOW()
);
