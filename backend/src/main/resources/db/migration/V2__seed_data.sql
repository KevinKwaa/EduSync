-- EduSync sample/seed data for development and demos.
-- Dates are CURRENT_DATE-relative so "today" / "this week" / "this month"
-- aggregates light up whenever the app is first run.
--
-- All seeded staff users share the password "Admin@123" (same bcrypt hash as the
-- V1 admin). Change before any non-local deployment.

-- ---------------------------------------------------------------------------
-- Reference data: subjects, staff, classrooms (explicit ids for stable FKs)
-- ---------------------------------------------------------------------------

INSERT INTO subjects (id, name, form_applicability) VALUES
    (1, 'Mathematics', 'Form 1-5'),
    (2, 'Science', 'Form 1-5'),
    (3, 'Bahasa Melayu', 'Form 1-5'),
    (4, 'English', 'Form 1-5'),
    (5, 'Sejarah', 'Form 1-5'),
    (6, 'Biology', 'Form 3-5');

INSERT INTO staff (id, name, role, subjects, workload_hours, leave_status, created_at, updated_at) VALUES
    (1, 'Datin Rina', 'HOD Mathematics', 'Mathematics, Add Maths', 22, 'ACTIVE', NOW(), NOW()),
    (2, 'Hafizuddin Mazlan', 'Senior Teacher', 'Bahasa Melayu', 26, 'ACTIVE', NOW(), NOW()),
    (3, 'Siti Khadijah', 'Teacher', 'Science, Biology', 18, 'ON_LEAVE', NOW(), NOW()),
    (4, 'Rohani Kamarudin', 'Teacher', 'English', 24, 'ON_LEAVE', NOW(), NOW()),
    (5, 'Tan Wei Liang', 'Teacher', 'Chemistry, Physics', 20, 'ACTIVE', NOW(), NOW()),
    (6, 'Ahmad Nizam', 'Teacher', 'History, Sejarah', 16, 'ACTIVE', NOW(), NOW()),
    (7, 'Priya Raju', 'Teacher', 'Accounting, Commerce', 14, 'ACTIVE', NOW(), NOW()),
    (8, 'Zulaikha Ahmad', 'Teacher', 'Pendidikan Islam', 22, 'ACTIVE', NOW(), NOW());

INSERT INTO class_rooms (id, name, form, home_teacher_id, size, created_at, updated_at) VALUES
    (1, '5 Cendekia', 5, 1, 32, NOW(), NOW()),
    (2, '5 Bestari', 5, 2, 30, NOW(), NOW()),
    (3, '5 Wira', 5, 5, 31, NOW(), NOW()),
    (4, '4 Amanah', 4, 3, 33, NOW(), NOW()),
    (5, '4 Bestari', 4, 6, 29, NOW(), NOW()),
    (6, '3 Harapan', 3, 7, 35, NOW(), NOW()),
    (7, '3 Maju', 3, 8, 34, NOW(), NOW()),
    (8, '2 Maju', 2, 7, 36, NOW(), NOW()),
    (9, '1 Aman', 1, 6, 38, NOW(), NOW()),
    (10, '1 Bina', 1, 8, 37, NOW(), NOW());

-- ---------------------------------------------------------------------------
-- Students (explicit ids; created_at controls the "new this term" stat)
-- ---------------------------------------------------------------------------

INSERT INTO students (id, name, form, class_name, attendance_pct, avg_score, status, deleted_at, created_at, updated_at) VALUES
    (1,  'Aiman Hakim',      5, '5 Cendekia', 72, 41, 'AT_RISK', NULL, NOW() - INTERVAL '200 days', NOW()),
    (2,  'Mei Ling Tan',     4, '4 Amanah',   88, 58, 'AT_RISK', NULL, NOW() - INTERVAL '200 days', NOW()),
    (3,  'Arjun Raj',        5, '5 Bestari',  91, 67, 'ACTIVE',  NULL, NOW() - INTERVAL '30 days',  NOW()),
    (4,  'Nurul Ain',        3, '3 Harapan',  98, 88, 'ACTIVE',  NULL, NOW() - INTERVAL '200 days', NOW()),
    (5,  'Siti Rohani',      2, '2 Maju',     97, 91, 'ACTIVE',  NULL, NOW() - INTERVAL '200 days', NOW()),
    (6,  'Farhan Zulkifli',  5, '5 Wira',     85, 74, 'ACTIVE',  NULL, NOW() - INTERVAL '200 days', NOW()),
    (7,  'Lee Yan Ting',     4, '4 Bestari',  93, 82, 'ACTIVE',  NULL, NOW() - INTERVAL '20 days',  NOW()),
    (8,  'Rafi Mukhriz',     1, '1 Aman',     79, 38, 'AT_RISK', NULL, NOW() - INTERVAL '200 days', NOW()),
    (9,  'Kiran Nair',       4, '4 Amanah',   90, 70, 'ACTIVE',  NULL, NOW() - INTERVAL '200 days', NOW()),
    (10, 'Zahir Aziz',       3, '3 Harapan',  95, 77, 'ACTIVE',  NULL, NOW() - INTERVAL '200 days', NOW()),
    (11, 'Tan Wei Han',      2, '2 Maju',     96, 85, 'ACTIVE',  NULL, NOW() - INTERVAL '200 days', NOW()),
    (12, 'Pavithra Devi',    1, '1 Bina',     92, 69, 'ACTIVE',  NULL, NOW() - INTERVAL '25 days',  NOW());

-- ---------------------------------------------------------------------------
-- Extra login accounts for RBAC testing (serial ids; password "Admin@123")
-- ---------------------------------------------------------------------------

INSERT INTO users (name, email, role, password_hash, created_at, updated_at) VALUES
    ('Datin Rina', 'rina@edusync.my', 'HOD',
        '$2a$12$VjXq5Cg0NUhxbJyRPGF.X.a/oHpXr8Cz6RQ4YPl3OhSI5pniXN6i', NOW(), NOW()),
    ('Hafizuddin Mazlan', 'hafiz@edusync.my', 'TEACHER',
        '$2a$12$VjXq5Cg0NUhxbJyRPGF.X.a/oHpXr8Cz6RQ4YPl3OhSI5pniXN6i', NOW(), NOW()),
    ('Office Admin', 'office@edusync.my', 'ADMIN',
        '$2a$12$VjXq5Cg0NUhxbJyRPGF.X.a/oHpXr8Cz6RQ4YPl3OhSI5pniXN6i', NOW(), NOW());

-- ---------------------------------------------------------------------------
-- Attendance: every weekday for the trailing 5 months (powers today / week /
-- monthly views). Status is deterministic so the demo is stable across runs.
-- Student 1 (Aiman) is chronically absent; student 8 absent today.
-- ---------------------------------------------------------------------------

INSERT INTO attendance_records (student_id, date, status)
SELECT s.id,
       gs.d::date,
       CASE
           WHEN s.id = 1 THEN 'ABSENT'
           WHEN s.id = 8 AND gs.d::date = CURRENT_DATE THEN 'ABSENT'
           WHEN (s.id + EXTRACT(DOW FROM gs.d)::int) % 13 = 0 THEN 'LATE'
           WHEN (s.id + EXTRACT(DOW FROM gs.d)::int) % 11 = 0 THEN 'ABSENT'
           ELSE 'PRESENT'
       END
FROM students s
CROSS JOIN generate_series(CURRENT_DATE - INTERVAL '5 months', CURRENT_DATE, INTERVAL '1 day') AS gs(d)
WHERE EXTRACT(DOW FROM gs.d) BETWEEN 1 AND 5;

-- ---------------------------------------------------------------------------
-- Exam results: two sittings (mid-term ~2 months ago, final ~2 weeks ago) per
-- student/subject. Scores are a deterministic function of subject + form, with
-- students 1 and 8 biased low (intervention candidates) and a small shift
-- between sittings so the "movers" analytics has signal. Biology is forms 3-5.
-- ---------------------------------------------------------------------------

INSERT INTO exam_results (student_id, subject_id, score, exam_type, date)
SELECT s.id, sub.id,
       GREATEST(30, LEAST(95,
           72 + sub.id - (s.form * 2) + ((s.id * 5) % 13) - 6
           - CASE WHEN s.id = 1 THEN 30 WHEN s.id = 8 THEN 28 ELSE 0 END)),
       'MID_TERM', CURRENT_DATE - INTERVAL '2 months'
FROM students s
CROSS JOIN subjects sub
WHERE sub.name <> 'Biology' OR s.form >= 3;

INSERT INTO exam_results (student_id, subject_id, score, exam_type, date)
SELECT s.id, sub.id,
       GREATEST(30, LEAST(98,
           72 + sub.id - (s.form * 2) + ((s.id * 5) % 13) - 6
           - CASE WHEN s.id = 1 THEN 30 WHEN s.id = 8 THEN 28 ELSE 0 END
           + (((s.id + sub.id) % 5) - 2))),
       'FINAL', CURRENT_DATE - INTERVAL '2 weeks'
FROM students s
CROSS JOIN subjects sub
WHERE sub.name <> 'Biology' OR s.form >= 3;

-- ---------------------------------------------------------------------------
-- Fees: one record per student per month for the trailing 6 months. Past
-- months are PAID; the current month is mixed (some OUTSTANDING / OVERDUE).
-- ---------------------------------------------------------------------------

INSERT INTO fee_records (student_id, amount, status, due_date, created_at, updated_at)
SELECT s.id,
       350.00,
       CASE
           WHEN gm.m < date_trunc('month', CURRENT_DATE) THEN 'PAID'
           WHEN s.id % 4 = 0 THEN 'OVERDUE'
           WHEN s.id % 3 = 0 THEN 'OUTSTANDING'
           ELSE 'PAID'
       END,
       (gm.m + INTERVAL '14 days')::date,
       NOW(), NOW()
FROM students s
CROSS JOIN generate_series(date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
                           date_trunc('month', CURRENT_DATE), INTERVAL '1 month') AS gm(m);

-- A few clearly-overdue records from last month to populate the overdue list.
INSERT INTO fee_records (student_id, amount, status, due_date, created_at, updated_at) VALUES
    (1, 350.00, 'OVERDUE', (CURRENT_DATE - INTERVAL '40 days')::date, NOW(), NOW()),
    (8, 350.00, 'OVERDUE', (CURRENT_DATE - INTERVAL '50 days')::date, NOW(), NOW()),
    (2, 180.00, 'OVERDUE', (CURRENT_DATE - INTERVAL '20 days')::date, NOW(), NOW());

-- ---------------------------------------------------------------------------
-- Bursaries
-- ---------------------------------------------------------------------------

INSERT INTO bursaries (student_id, type, amount, status) VALUES
    (1, 'Yayasan Pelajaran Johor', 1800.00, 'ACTIVE'),
    (8, 'JKM Bantuan', 1200.00, 'PENDING'),
    (4, 'PTA Hardship', 600.00, 'ACTIVE'),
    (2, 'JKM Bantuan', 1200.00, 'PENDING');

-- ---------------------------------------------------------------------------
-- Notices (author resolved by email)
-- ---------------------------------------------------------------------------

INSERT INTO notices (author_id, title, body, audience, status, published_at, created_at, updated_at)
SELECT u.id, v.title, v.body, v.audience, v.status, v.published_at, v.created_at, v.created_at
FROM (VALUES
    ('admin@edusync.my', 'Fee payment deadline extended to 30 Jun 2026',
        'Form 4 and Form 5 fee payments may be settled until 30 June 2026.', 'Parents',
        'PUBLISHED', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
    ('hafiz@edusync.my', 'SPM trial exam timetable uploaded to the student portal',
        'The full SPM trial timetable is now available on the student portal.', 'Students',
        'PUBLISHED', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
    ('rina@edusync.my', 'Co-curriculum records to be submitted by Friday',
        'All class teachers must submit co-curriculum activity records by Friday.', 'Teachers',
        'PUBLISHED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    ('admin@edusync.my', 'Sports Day briefing for all class teachers',
        'Draft briefing notes for the upcoming Sports Day.', 'Teachers',
        'DRAFT', NULL, NOW() - INTERVAL '3 hours'),
    ('rina@edusync.my', 'Mathematics catch-up class schedule for Form 5',
        'Draft schedule for Form 5 mathematics catch-up classes.', 'Students',
        'DRAFT', NULL, NOW() - INTERVAL '1 day'),
    ('admin@edusync.my', 'Term 1 results collection schedule',
        'Term 1 results were collected per the published schedule.', 'Parents',
        'ARCHIVED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days')
) AS v(email, title, body, audience, status, published_at, created_at)
JOIN users u ON u.email = v.email;

-- ---------------------------------------------------------------------------
-- Events (CURRENT_DATE-relative so the calendar/upcoming widgets have data)
-- ---------------------------------------------------------------------------

INSERT INTO events (title, date, location, type) VALUES
    ('Fee Payment Deadline',   (CURRENT_DATE + INTERVAL '1 day')::date,  'Online',          'admin'),
    ('PTA Q2 Meeting',         (CURRENT_DATE + INTERVAL '3 days')::date, 'Dewan Utama',     'meeting'),
    ('Teacher CPD Session',    (CURRENT_DATE + INTERVAL '5 days')::date, 'Bilik Mesyuarat', 'admin'),
    ('SPM Trial Exams begin',  (CURRENT_DATE + INTERVAL '9 days')::date, 'All classrooms',  'exam'),
    ('Sports Day',             (CURRENT_DATE + INTERVAL '14 days')::date,'Padang Sekolah',  'event'),
    ('Mid-Year Assessment',    (CURRENT_DATE + INTERVAL '16 days')::date,'All classrooms',  'exam'),
    ('PTA Q1 Meeting',         (CURRENT_DATE - INTERVAL '20 days')::date,'Dewan Utama',     'meeting');

-- ---------------------------------------------------------------------------
-- Leave requests (one approved spanning today -> "on leave today")
-- ---------------------------------------------------------------------------

INSERT INTO leave_requests (staff_id, type, start_date, end_date, status) VALUES
    (3, 'Compassionate', CURRENT_DATE,                          CURRENT_DATE,                          'APPROVED'),
    (4, 'Medical',       (CURRENT_DATE + INTERVAL '2 days')::date, (CURRENT_DATE + INTERVAL '4 days')::date, 'PENDING'),
    (5, 'Annual',        (CURRENT_DATE + INTERVAL '5 days')::date, (CURRENT_DATE + INTERVAL '6 days')::date, 'PENDING'),
    (6, 'Annual',        (CURRENT_DATE - INTERVAL '15 days')::date,(CURRENT_DATE - INTERVAL '14 days')::date,'APPROVED');

-- ---------------------------------------------------------------------------
-- Campuses
-- ---------------------------------------------------------------------------

INSERT INTO campuses (name, student_count, classroom_count, operational_status) VALUES
    ('SMK BU Main Campus', 2840, 24, 'Operational'),
    ('Annex Block A', 520, 8, 'Partial'),
    ('Sports Complex', 0, 0, 'Operational');

-- ---------------------------------------------------------------------------
-- Advance sequences past the explicitly-inserted ids
-- ---------------------------------------------------------------------------

SELECT setval(pg_get_serial_sequence('subjects', 'id'),    (SELECT MAX(id) FROM subjects));
SELECT setval(pg_get_serial_sequence('staff', 'id'),       (SELECT MAX(id) FROM staff));
SELECT setval(pg_get_serial_sequence('class_rooms', 'id'), (SELECT MAX(id) FROM class_rooms));
SELECT setval(pg_get_serial_sequence('students', 'id'),    (SELECT MAX(id) FROM students));
