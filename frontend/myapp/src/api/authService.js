import { api, setAccessToken, clearAuth } from './client';

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Staff/admin login against the backend. On success the access token is stored
 * in memory and a returned profile is handed to AuthContext for the UI.
 */
export async function loginStaff({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  setAccessToken(data.accessToken);
  return {
    name: data.name,
    role: data.role,
    email,
    initials: initials(data.name),
  };
}

/** Clears the refresh cookie server-side and wipes local auth state. */
export async function logoutStaff() {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore network errors on logout — we clear locally regardless.
  }
  clearAuth();
}

// ---------------------------------------------------------------------------
// Parent / Student portals: no backend endpoints yet, so these remain mocked.
// Build Parent/Student entities + auth before wiring these to the API.
// ---------------------------------------------------------------------------

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function loginParent({ ic, password }) {
  await delay(900);
  if (!ic || !password) throw new Error('Required');
  return {
    id: 100,
    name: 'Ahmad bin Zulkifli',
    ic,
    role: 'PARENT',
    children: [
      { id: 1, name: 'Aiman Hakim', form: 'Form 5', cls: '5 Cendekia', initials: 'AH' },
    ],
  };
}

export async function loginStudent({ studentId, password }) {
  await delay(900);
  if (!studentId || !password) throw new Error('Required');
  return {
    id: 1,
    name: 'Aiman Hakim',
    studentId,
    role: 'STUDENT',
    form: 'Form 5',
    cls: '5 Cendekia',
    initials: 'AH',
    school: 'SMK Bandar Utama',
  };
}

export async function registerStudent(data) {
  await delay(1200);
  return { id: Math.floor(Math.random() * 9000) + 1000, ...data };
}
