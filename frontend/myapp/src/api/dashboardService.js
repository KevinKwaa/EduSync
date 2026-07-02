import { api } from './client';

// Greeting + term context (backend personalises the greeting to the signed-in user).
export async function getDashboardSummary() {
  const { data } = await api.get('/dashboard/summary');
  return {
    greeting: data.greeting,
    term: data.termContext,
    dateRangeLabel: 'This term',
  };
}

// Four KPI cards. Live numbers come from the API; the presentation scaffolding
// (icons, labels, count-up format functions) stays here on the client.
export async function getKPIs() {
  const [kpiRes, feeRes] = await Promise.all([
    api.get('/dashboard/kpis'),
    api.get('/fees/summary'),
  ]);
  const k = kpiRes.data;
  const fees = feeRes.data;
  const collected = Number(fees.collected) || 0;

  const formatRM = (v) =>
    v >= 1_000_000 ? `RM ${(v / 1_000_000).toFixed(2)}M`
      : v >= 1_000 ? `RM ${(v / 1_000).toFixed(0)}K`
        : `RM ${Math.round(v)}`;

  return [
    {
      id: 'students',
      label: 'Total students',
      icon: 'users',
      rawValue: k.totalStudents,
      format: (v) => Math.round(v).toLocaleString('en-MY'),
      delta: `${k.atRiskStudents} flagged at-risk`,
      deltaType: k.atRiskStudents > 0 ? 'muted' : 'success',
    },
    {
      id: 'attendance',
      label: 'Attendance today',
      icon: 'calendar-check',
      rawValue: k.todayAttendancePct,
      format: (v) => `${v.toFixed(1)}%`,
      delta: 'present today',
      deltaType: 'muted',
    },
    {
      id: 'fees',
      label: 'Fees collected',
      icon: 'wallet',
      rawValue: collected,
      format: formatRM,
      delta: `${fees.pct}% of term target`,
      deltaType: 'muted',
    },
    {
      id: 'staff',
      label: 'Teaching staff',
      icon: 'graduation-cap',
      rawValue: k.teachingStaff,
      format: (v) => String(Math.round(v)),
      delta: 'active',
      deltaType: 'success',
    },
  ];
}

// Mon–Fri attendance rates; highlight the weakest day for the bar chart.
export async function getAttendanceData() {
  const { data } = await api.get('/attendance/weekly'); // [{ day, date, rate }]
  const rates = data.map((d) => d.rate);
  const min = rates.length ? Math.min(...rates) : 0;
  return data.map((d) => ({
    day: d.day,
    rate: Math.round(d.rate),
    heightPct: Math.round(d.rate),
    highlight: d.rate === min,
  }));
}

// Fee donut: collected % + pre-formatted RM labels.
export async function getFeeCollection() {
  const { data } = await api.get('/dashboard/fees/collection');
  return {
    collectedPct: data.collectedPct,
    collectedLabel: data.collectedLabel,
    outstandingLabel: data.outstandingLabel,
  };
}

// Average score per subject; backend already flags the weakest subject.
export async function getSubjectPerformance() {
  const { data } = await api.get('/dashboard/subjects/performance');
  return data; // [{ subject, score, highlight }]
}
