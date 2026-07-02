-- Exam schedule (distinct from exam_results, which stores per-student scores).
-- Powers the Examinations page: upcoming / marking / results.

CREATE TABLE exams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    exam_type VARCHAR(50),
    form VARCHAR(50),
    date DATE,
    subjects_count INTEGER,
    status VARCHAR(50),
    submitted INTEGER,
    total INTEGER,
    marking_deadline DATE,
    marker VARCHAR(255),
    avg_score DOUBLE PRECISION,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Seed (CURRENT_DATE-relative so "days left" / deadlines stay meaningful).
INSERT INTO exams (name, exam_type, form, date, subjects_count, status, submitted, total, marking_deadline, marker, avg_score, created_at, updated_at) VALUES
    ('SPM Trial Exams',      'TRIAL',    'Form 5',   (CURRENT_DATE + INTERVAL '9 days')::date,  8, 'SCHEDULED', NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
    ('Mid-Year Assessment',  'MID_TERM', 'All Forms',(CURRENT_DATE + INTERVAL '16 days')::date, 5, 'SCHEDULED', NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
    ('Mock PT3',             'TRIAL',    'Form 3',   (CURRENT_DATE + INTERVAL '23 days')::date, 6, 'SCHEDULED', NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
    ('Unit Test 3',          'MONTHLY',  'Form 1-2', (CURRENT_DATE + INTERVAL '43 days')::date, 4, 'SCHEDULED', NULL, NULL, NULL, NULL, NULL, NOW(), NOW()),
    ('Term 1 Exam',          'FINAL',    'Form 4',   (CURRENT_DATE - INTERVAL '5 days')::date,  6, 'MARKING',   28, 30, (CURRENT_DATE + INTERVAL '3 days')::date, 'Datin Rina', NULL, NOW(), NOW()),
    ('Unit Test 2',          'MONTHLY',  'Form 1',   (CURRENT_DATE - INTERVAL '6 days')::date,  4, 'MARKING',   12, 20, (CURRENT_DATE + INTERVAL '5 days')::date, 'Multiple',   NULL, NOW(), NOW()),
    ('Q1 Assessment',        'MID_TERM', 'Form 5',   (CURRENT_DATE - INTERVAL '50 days')::date, 6, 'COMPLETED', NULL, NULL, NULL, NULL, 68, NOW(), NOW()),
    ('Q2 Assessment',        'MID_TERM', 'Form 5',   (CURRENT_DATE - INTERVAL '20 days')::date, 6, 'COMPLETED', NULL, NULL, NULL, NULL, 72, NOW(), NOW()),
    ('Internal Test',        'MONTHLY',  'Form 3',   (CURRENT_DATE - INTERVAL '25 days')::date, 5, 'COMPLETED', NULL, NULL, NULL, NULL, 80, NOW(), NOW()),
    ('Unit Test 2',          'MONTHLY',  'Form 1',   (CURRENT_DATE - INTERVAL '30 days')::date, 4, 'COMPLETED', NULL, NULL, NULL, NULL, 65, NOW(), NOW());
