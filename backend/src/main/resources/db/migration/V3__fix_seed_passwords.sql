-- The bcrypt hash seeded in V1/V2 did not actually correspond to "Admin@123",
-- so the demo accounts could not sign in. Replace it with a verified hash
-- (BCrypt, strength 12). All seeded staff accounts share the password Admin@123.
--
-- Done as an additive migration (not by editing V1/V2) so already-migrated
-- databases keep matching Flyway checksums.

UPDATE users
SET password_hash = '$2a$12$ZhjPnajqad.QAyCKqZ2qBu/nXxQV1GEeIr2pQ0jodnftsWgeCMCyq',
    updated_at = NOW()
WHERE email IN (
    'admin@edusync.my',
    'rina@edusync.my',
    'hafiz@edusync.my',
    'office@edusync.my'
);
