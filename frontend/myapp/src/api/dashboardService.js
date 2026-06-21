const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getDashboardSummary() {
  await delay(40);
  return {
    greeting: 'Good morning, Faridah',
    term: 'Term 2 · Week 9 · Tuesday, 18 June 2026',
    dateRangeLabel: 'This term',
  };
}

export async function getKPIs() {
  await delay(50);
  return [
    {
      id: 'students',
      label: 'Total students',
      icon: 'users',
      rawValue: 4820,
      format: (v) => Math.round(v).toLocaleString('en-MY'),
      delta: '+3.2% vs last term',
      deltaType: 'success',
      deltaIcon: 'trending-up',
    },
    {
      id: 'attendance',
      label: 'Attendance today',
      icon: 'calendar-check',
      rawValue: 94.6,
      format: (v) => `${v.toFixed(1)}%`,
      delta: '+1.1% vs avg',
      deltaType: 'success',
    },
    {
      id: 'fees',
      label: 'Fees collected',
      icon: 'wallet',
      rawValue: 1.42,
      format: (v) => `RM ${v.toFixed(2)}M`,
      delta: '78% of term target',
      deltaType: 'muted',
    },
    {
      id: 'staff',
      label: 'Teaching staff',
      icon: 'graduation-cap',
      rawValue: 312,
      format: (v) => String(Math.round(v)),
      delta: '+6 this term',
      deltaType: 'success',
      deltaIcon: 'trending-up',
    },
  ];
}

export async function getAttendanceData() {
  await delay(60);
  return [
    { day: 'Mon', rate: 95, heightPct: 90, highlight: false },
    { day: 'Tue', rate: 93, heightPct: 86, highlight: false },
    { day: 'Wed', rate: 96, heightPct: 94, highlight: false },
    { day: 'Thu', rate: 92, heightPct: 84, highlight: false },
    { day: 'Fri', rate: 86, heightPct: 72, highlight: true  },
  ];
}

export async function getFeeCollection() {
  await delay(60);
  return {
    collectedPct:    78,
    collectedLabel:  'RM 1.42M',
    outstandingLabel: 'RM 402K',
  };
}

export async function getSubjectPerformance() {
  await delay(60);
  return [
    { subject: 'Bahasa Melayu', score: 82, highlight: false },
    { subject: 'Mathematics',   score: 76, highlight: false },
    { subject: 'Science',       score: 79, highlight: false },
    { subject: 'Sejarah',       score: 71, highlight: true  },
    { subject: 'English',       score: 80, highlight: false },
  ];
}
