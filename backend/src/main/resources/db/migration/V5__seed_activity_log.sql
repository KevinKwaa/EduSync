-- Seed a few audit-log rows so the People "recent activity" feed is populated on
-- a fresh database. performed_by matches seeded staff emails; the People service
-- resolves those to names/roles. Real activity accrues as staff mutate data.

INSERT INTO audit_log (entity_type, entity_id, action, performed_by, changed_at, details) VALUES
    ('Notice',       1, 'CREATE', 'admin@edusync.my', NOW() - INTERVAL '1 hour',  'title=Fee payment deadline extended'),
    ('Notice',       2, 'CREATE', 'hafiz@edusync.my', NOW() - INTERVAL '5 hours', 'title=SPM trial exam timetable'),
    ('Event',        2, 'CREATE', 'admin@edusync.my', NOW() - INTERVAL '1 day',   'title=PTA Q2 Meeting'),
    ('LeaveRequest', 1, 'UPDATE', 'rina@edusync.my',  NOW() - INTERVAL '2 days',  'status=APPROVED'),
    ('Notice',       3, 'CREATE', 'rina@edusync.my',  NOW() - INTERVAL '3 days',  'title=Co-curriculum records due');
