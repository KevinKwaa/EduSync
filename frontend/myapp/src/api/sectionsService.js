import { api } from './client';

// ===========================================================================
// All section data now comes from the backend. Response shapes were designed to
// match what the section components consume, so most of these are passthroughs.
// ===========================================================================

// Students roster → GET /students
export async function getStudentRoster() {
  const { data } = await api.get('/students');
  return data; // { total, stats:{atRisk,absentToday,honourRoll,newThisTerm}, students:[...] }
}

// Teacher/staff directory → GET /staff
export async function getTeacherDirectory() {
  const { data } = await api.get('/staff');
  return data; // [{ id, initials, name, role, subjects[], classes, hours, load, status }]
}

// Classes grouped by form → GET /classes
export async function getClassList() {
  const { data } = await api.get('/classes');
  return data; // [{ form, count, classes:[{ id, name, teacher, size, attendance, avgScore, status }] }]
}

// Attendance page → GET /attendance
export async function getAttendancePage() {
  const { data } = await api.get('/attendance');
  return data; // { today, weekTrend[], byForm[], absentToday[], monthly[] }
}

// Fees page → GET /fees
export async function getFeePageData() {
  const { data } = await api.get('/fees');
  return data; // { summary, byForm[], overdue[], bursaries[] }
}

// Academics page → GET /academics
export async function getAcademicsPageData() {
  const { data } = await api.get('/academics');
  return data; // { overallAttainment, subjects[], interventions[] }
}

// Analytics page → GET /analytics
export async function getAnalyticsData() {
  const { data } = await api.get('/analytics');
  return data; // { signals[], monthly[], movers[] }
}

// People overview → GET /people
export async function getPeopleData() {
  const { data } = await api.get('/people');
  return data; // { total, segments[], recentActivity[], watchlist[] }
}

// Finance page → GET /finance
export async function getFinancePageData() {
  const { data } = await api.get('/finance');
  return data; // { summary, monthly[], categories[] }
}

// Examinations → GET /examinations
export async function getExaminationData() {
  const { data } = await api.get('/examinations');
  return data; // { upcoming[], marking[], results[] }
}

// Leave → GET /staff/leave.  coverNeeded (substitute scheduling) isn't modelled
// yet, so it's returned empty to keep the "On leave" / "Coverage" views working.
export async function getLeaveData() {
  const { data } = await api.get('/staff/leave');
  return { ...data, coverNeeded: [] };
}

// Notices page → GET /notices/page.  Map backend timestamps onto the labels the
// draft/archive views expect; published/drafts/archive shapes are otherwise identical.
export async function getNoticesPageData() {
  const { data } = await api.get('/notices/page');
  return {
    published: data.published.map((n) => ({ ...n, priority: false })),
    drafts: data.drafts.map((n) => ({ ...n, savedAt: n.time })),
    archive: data.archive.map((n) => ({ ...n, publishedAt: n.time })),
  };
}

// Campuses → GET /campus.  The Campus entity is intentionally thin; uptime/labs/
// facilities aren't modelled, so they're placeholders until the entity grows.
export async function getCampusData() {
  const { data } = await api.get('/campus');
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    students: c.studentCount,
    classrooms: c.classroomCount,
    uptime: c.status === 'operational' ? 100 : 80, // placeholder — not tracked yet
    labs: 0,
    facilities: [],
  }));
}

// Calendar → GET /events. Maps ISO events to the {date(day), month(num), time}
// shape the events list expects. NOTE: the month/week GRID views in
// SectionViews are still hardcoded to June 2026 and need a component update for
// a fully dynamic calendar; the Events list view is live.
export async function getCalendarData() {
  const now = new Date();
  const { data } = await api.get('/events');
  const events = data.map((e) => {
    const d = new Date(e.date);
    return {
      date: d.getDate(),
      month: d.getMonth() + 1,
      title: e.title,
      type: e.type,
      time: e.meta || e.location || '',
    };
  });
  return { year: now.getFullYear(), month: now.getMonth() + 1, events };
}
