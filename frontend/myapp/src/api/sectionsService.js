const delay = (ms = 380) => new Promise(r => setTimeout(r, ms));

export async function getStudentRoster() {
  await delay();
  return {
    total: 3406,
    stats: { atRisk: 14, absentToday: 31, honourRoll: 287, newThisTerm: 18 },
    students: [
      { id: 1, initials: 'AH', name: 'Aiman Hakim', form: 'Form 5', cls: '5 Cendekia', attendance: 72, score: 61, status: 'at-risk' },
      { id: 2, initials: 'ML', name: 'Mei Ling Tan', form: 'Form 4', cls: '4 Amanah', attendance: 88, score: 58, status: 'at-risk' },
      { id: 3, initials: 'AR', name: 'Arjun Raj', form: 'Form 5', cls: '5 Bestari', attendance: 91, score: 67, status: 'support' },
      { id: 4, initials: 'NR', name: 'Nurul Ain', form: 'Form 3', cls: '3 Harapan', attendance: 98, score: 88, status: 'honour' },
      { id: 5, initials: 'SR', name: 'Siti Rohani', form: 'Form 2', cls: '2 Maju', attendance: 97, score: 91, status: 'honour' },
      { id: 6, initials: 'FZ', name: 'Farhan Zulkifli', form: 'Form 5', cls: '5 Wira', attendance: 85, score: 74, status: 'normal' },
      { id: 7, initials: 'LY', name: 'Lee Yan Ting', form: 'Form 4', cls: '4 Bestari', attendance: 93, score: 82, status: 'normal' },
      { id: 8, initials: 'RM', name: 'Rafi Mukhriz', form: 'Form 1', cls: '1 Aman', attendance: 79, score: 55, status: 'support' },
    ],
  };
}

export async function getTeacherDirectory() {
  await delay();
  return [
    { id: 1, initials: 'DR', name: 'Datin Rina', role: 'HOD Mathematics', subjects: ['Mathematics', 'Add Maths'], classes: 6, hours: 22, load: 88, status: 'active' },
    { id: 2, initials: 'HM', name: 'Hafizuddin Mazlan', role: 'Senior Teacher', subjects: ['Bahasa Melayu'], classes: 8, hours: 26, load: 95, status: 'active' },
    { id: 3, initials: 'SK', name: 'Siti Khadijah', role: 'Teacher', subjects: ['Science', 'Biology'], classes: 5, hours: 18, load: 72, status: 'on-leave' },
    { id: 4, initials: 'RK', name: 'Rohani Kamarudin', role: 'Teacher', subjects: ['English'], classes: 7, hours: 24, load: 80, status: 'on-leave' },
    { id: 5, initials: 'TW', name: 'Tan Wei Liang', role: 'Teacher', subjects: ['Chemistry', 'Physics'], classes: 6, hours: 20, load: 80, status: 'active' },
    { id: 6, initials: 'AN', name: 'Ahmad Nizam', role: 'Teacher', subjects: ['History', 'Sejarah'], classes: 5, hours: 16, load: 64, status: 'active' },
    { id: 7, initials: 'PR', name: 'Priya Raju', role: 'Teacher', subjects: ['Accounting', 'Commerce'], classes: 4, hours: 14, load: 56, status: 'active' },
    { id: 8, initials: 'ZA', name: 'Zulaikha Ahmad', role: 'Teacher', subjects: ['Pendidikan Islam'], classes: 7, hours: 22, load: 88, status: 'active' },
  ];
}

export async function getClassList() {
  await delay();
  return [
    {
      form: 'Form 5', count: 3,
      classes: [
        { id: 1, name: '5 Cendekia', teacher: 'Datin Rina', size: 32, attendance: 89, avgScore: 76, status: 'on-track' },
        { id: 2, name: '5 Bestari', teacher: 'Hafizuddin Mazlan', size: 30, attendance: 91, avgScore: 74, status: 'on-track' },
        { id: 3, name: '5 Wira', teacher: 'Tan Wei Liang', size: 31, attendance: 85, avgScore: 68, status: 'needs-support' },
      ],
    },
    {
      form: 'Form 4', count: 2,
      classes: [
        { id: 4, name: '4 Amanah', teacher: 'Siti Khadijah', size: 33, attendance: 93, avgScore: 79, status: 'on-track' },
        { id: 5, name: '4 Bestari', teacher: 'Ahmad Nizam', size: 29, attendance: 88, avgScore: 72, status: 'on-track' },
      ],
    },
    {
      form: 'Form 3', count: 2,
      classes: [
        { id: 6, name: '3 Harapan', teacher: 'Priya Raju', size: 35, attendance: 96, avgScore: 82, status: 'high-perform' },
        { id: 7, name: '3 Maju', teacher: 'Zulaikha Ahmad', size: 34, attendance: 94, avgScore: 80, status: 'on-track' },
      ],
    },
    {
      form: 'Form 2', count: 1,
      classes: [
        { id: 8, name: '2 Maju', teacher: 'Priya Raju', size: 36, attendance: 97, avgScore: 83, status: 'high-perform' },
      ],
    },
    {
      form: 'Form 1', count: 2,
      classes: [
        { id: 9, name: '1 Aman', teacher: 'Ahmad Nizam', size: 38, attendance: 92, avgScore: 71, status: 'on-track' },
        { id: 10, name: '1 Bina', teacher: 'Zulaikha Ahmad', size: 37, attendance: 90, avgScore: 69, status: 'on-track' },
      ],
    },
  ];
}

export async function getExaminationData() {
  await delay();
  return {
    upcoming: [
      { id: 1, name: 'SPM Trial Exams', date: '1 Jul 2026', form: 'Form 5', subjects: 8, daysLeft: 9 },
      { id: 2, name: 'Mid-Year Assessment', date: '8 Jul 2026', form: 'All Forms', subjects: 5, daysLeft: 16 },
      { id: 3, name: 'Mock PT3', date: '15 Jul 2026', form: 'Form 3', subjects: 6, daysLeft: 23 },
      { id: 4, name: 'Unit Test 3', date: '4 Aug 2026', form: 'Form 1–2', subjects: 4, daysLeft: 43 },
    ],
    marking: [
      { id: 5, name: 'Term 1 Exam', form: 'Form 4', subjects: 6, submitted: 28, total: 30, deadline: '25 Jun 2026', teacher: 'Datin Rina' },
      { id: 6, name: 'Unit Test 2', form: 'Form 1', subjects: 4, submitted: 12, total: 20, deadline: '27 Jun 2026', teacher: 'Multiple' },
    ],
    results: [
      { id: 7, name: 'Q1 Assessment', form: 'Form 5', avg: 72, date: 'Jun 10', trend: 'up', delta: '+4' },
      { id: 8, name: 'Internal Test', form: 'Form 3', avg: 80, date: 'Jun 5', trend: 'up', delta: '+2' },
      { id: 9, name: 'Unit Test 2', form: 'Form 1', avg: 65, date: 'May 28', trend: 'down', delta: '−3' },
      { id: 10, name: 'Term 1 Exam', form: 'Form 2', avg: 77, date: 'May 20', trend: 'flat', delta: '0' },
    ],
  };
}

export async function getAttendancePage() {
  await delay();
  return {
    today: { date: 'Sun, 22 Jun 2026', rate: 94.6, present: 3221, absent: 185, late: 43 },
    weekTrend: [
      { day: 'Mon', date: '16', rate: 95.2 },
      { day: 'Tue', date: '17', rate: 94.6 },
      { day: 'Wed', date: '18', rate: 96.1 },
      { day: 'Thu', date: '19', rate: 92.4 },
      { day: 'Fri', date: '20', rate: 86.1 },
    ],
    byForm: [
      { form: 'Form 5', present: 612, total: 650, rate: 94.2 },
      { form: 'Form 4', present: 598, total: 620, rate: 96.5 },
      { form: 'Form 3', present: 687, total: 720, rate: 95.4 },
      { form: 'Form 2', present: 716, total: 756, rate: 94.7 },
      { form: 'Form 1', present: 608, total: 660, rate: 92.1 },
    ],
    absentToday: [
      { initials: 'AH', name: 'Aiman Hakim', cls: '5 Cendekia', streak: 6 },
      { initials: 'RM', name: 'Rafi Mukhriz', cls: '1 Aman', streak: 3 },
      { initials: 'KN', name: 'Kiran Nair', cls: '4 Amanah', streak: 2 },
      { initials: 'ZA', name: 'Zahir Aziz', cls: '3 Harapan', streak: 1 },
    ],
    monthly: [
      { month: 'Jan', rate: 94.1 }, { month: 'Feb', rate: 93.8 }, { month: 'Mar', rate: 95.2 },
      { month: 'Apr', rate: 92.6 }, { month: 'May', rate: 94.0 }, { month: 'Jun', rate: 94.6 },
    ],
  };
}

export async function getFeePageData() {
  await delay();
  return {
    summary: { collected: 1420000, outstanding: 402000, target: 1822000, pct: 78 },
    byForm: [
      { form: 'Form 5', collected: 312000, outstanding: 68000, pct: 82 },
      { form: 'Form 4', collected: 298000, outstanding: 82000, pct: 78 },
      { form: 'Form 3', collected: 342000, outstanding: 98000, pct: 78 },
      { form: 'Form 2', collected: 268000, outstanding: 92000, pct: 74 },
      { form: 'Form 1', collected: 200000, outstanding: 62000, pct: 76 },
    ],
    overdue: [
      { initials: 'F4', name: 'Form 4 — 18 families', amount: 64000, urgency: 'high' },
      { initials: 'F3', name: 'Form 3 — 26 families', amount: 98000, urgency: 'high' },
      { initials: 'BS', name: 'Bursary applicants — 9 accounts', amount: 34000, urgency: 'medium' },
      { initials: 'TR', name: 'Transport fee arrears — 12 accounts', amount: 18000, urgency: 'low' },
    ],
    bursaries: [
      { id: 1, name: 'Aiman Hakim', form: '5 Cendekia', type: 'Yayasan Pelajaran Johor', status: 'approved', amount: 1800 },
      { id: 2, name: 'Rafi Mukhriz', form: '1 Aman', type: 'JKM Bantuan', status: 'pending', amount: 1200 },
      { id: 3, name: 'Nurul Ain', form: '3 Harapan', type: 'PTA Hardship', status: 'approved', amount: 600 },
      { id: 4, name: 'Mei Ling Tan', form: '4 Amanah', type: 'JKM Bantuan', status: 'reviewing', amount: 1200 },
    ],
  };
}

export async function getLeaveData() {
  await delay();
  return {
    pending: [
      { id: 1, initials: 'RK', name: 'Rohani Kamarudin', type: 'Medical', dates: '20–22 Jun', days: 3, classes: 4, cls: 'English (Forms 4–5)' },
      { id: 2, initials: 'TW', name: 'Tan Wei Liang', type: 'Annual', dates: '25–26 Jun', days: 2, classes: 2, cls: 'Chemistry, Physics' },
    ],
    approved: [
      { id: 3, initials: 'SK', name: 'Siti Khadijah', type: 'Compassionate', dates: '22 Jun', days: 1, cls: 'Science / Biology' },
    ],
    onLeaveToday: [
      { initials: 'SK', name: 'Siti Khadijah', subjects: 'Science / Biology', returnDate: '23 Jun 2026' },
    ],
    coverNeeded: [
      { id: 1, cls: '4 Amanah', subject: 'Science', time: '9:00–10:30', period: 'P3', teacher: null },
      { id: 2, cls: '3 Harapan', subject: 'Biology', time: '11:00–12:30', period: 'P5', teacher: 'Ahmad Nizam' },
    ],
  };
}

export async function getNoticesPageData() {
  await delay();
  return {
    published: [
      { id: 1, initials: 'FN', author: 'Faridah Nasir', title: 'Fee payment deadline extended to 30 Jun 2026', audience: 'Parents', time: '2 hours ago', priority: true },
      { id: 2, initials: 'HM', author: 'Hafizuddin Mazlan', title: 'SPM trial exam timetable uploaded to student portal', audience: 'Students', time: '5 hours ago', priority: false },
      { id: 3, initials: 'RK', author: 'Rohani Kamarudin', title: 'Co-curriculum records to be submitted by Friday', audience: 'Teachers', time: 'Yesterday', priority: false },
      { id: 4, initials: 'AN', author: 'Admin', title: 'School bus route 3 resumes normal service from Mon 23 Jun', audience: 'All', time: '2 days ago', priority: false },
    ],
    drafts: [
      { id: 5, initials: 'FN', author: 'Faridah Nasir', title: 'Sports Day briefing for all class teachers', audience: 'Teachers', savedAt: 'Today, 10:42' },
      { id: 6, initials: 'DR', author: 'Datin Rina', title: 'Mathematics catch-up class schedule for Form 5', audience: 'Students', savedAt: 'Yesterday, 14:08' },
    ],
    archive: [
      { id: 7, initials: 'FN', author: 'Faridah Nasir', title: 'Term 1 results collection schedule', audience: 'Parents', publishedAt: 'May 15, 2026' },
      { id: 8, initials: 'HM', author: 'Hafizuddin Mazlan', title: 'Ramadan timetable adjustments', audience: 'All', publishedAt: 'Mar 1, 2026' },
    ],
  };
}

export async function getCampusData() {
  await delay();
  return [
    {
      id: 1, name: 'SMK BU Main Campus', short: 'Main', students: 2840, classrooms: 24, labs: 4,
      uptime: 98, status: 'operational', transport: true,
      facilities: ['Library', 'Computer Lab', 'Science Labs ×4', 'Hall', 'Canteen'],
    },
    {
      id: 2, name: 'Annex Block A', short: 'Annex', students: 520, classrooms: 8, labs: 2,
      uptime: 81, status: 'partial', transport: false,
      facilities: ['Computer Lab', 'Art Room', 'Music Room'],
    },
    {
      id: 3, name: 'Sports Complex', short: 'Sports', students: null, classrooms: 0, labs: 0,
      uptime: 100, status: 'operational', transport: false,
      facilities: ['Indoor Court', 'Field', 'Changing Rooms', 'Equipment Store'],
    },
  ];
}

export async function getPeopleData() {
  await delay();
  return {
    total: 4820,
    segments: [
      { role: 'Students', count: 3406, pct: 71 },
      { role: 'Teaching Staff', count: 312, pct: 6 },
      { role: 'Support Staff', count: 96, pct: 2 },
      { role: 'Leadership', count: 12, pct: 0.25 },
      { role: 'Others', count: 994, pct: 21 },
    ],
    recentActivity: [
      { initials: 'FN', name: 'Faridah Nasir', role: 'Principal', action: 'Approved leave for Siti Khadijah', time: '1h ago' },
      { initials: 'HM', name: 'Hafizuddin Mazlan', role: 'Sr. Teacher', action: 'Published SPM trial timetable', time: '5h ago' },
      { initials: 'DR', name: 'Datin Rina', role: 'HOD Maths', action: 'Flagged 3 students for intervention', time: 'Yesterday' },
    ],
    watchlist: [
      { initials: 'AH', name: 'Aiman Hakim', type: 'Student', reason: 'Attendance 72% — 6-day streak', urgency: 'high' },
      { initials: 'ML', name: 'Mei Ling Tan', type: 'Student', reason: 'Score dropped 12 pts this term', urgency: 'medium' },
      { initials: 'RK', name: 'Rohani Kamarudin', type: 'Teacher', reason: 'On leave — 4 classes need cover', urgency: 'medium' },
    ],
  };
}

export async function getAcademicsPageData() {
  await delay();
  return {
    overallAttainment: 79,
    subjects: [
      { name: 'Mathematics', f1: 78, f2: 74, f3: 76, f4: 72, f5: 71, trend: 'down' },
      { name: 'Science', f1: 82, f2: 80, f3: 77, f4: 81, f5: 75, trend: 'up' },
      { name: 'Bahasa Melayu', f1: 85, f2: 83, f3: 81, f4: 79, f5: 76, trend: 'flat' },
      { name: 'English', f1: 72, f2: 70, f3: 74, f4: 73, f5: 78, trend: 'up' },
      { name: 'Sejarah', f1: 68, f2: 66, f3: 69, f4: 67, f5: 64, trend: 'down' },
      { name: 'Biology', f1: null, f2: null, f3: 79, f4: 82, f5: 80, trend: 'up' },
    ],
    interventions: [
      { initials: 'AH', name: 'Aiman Hakim', cls: '5 Cendekia', subject: 'Mathematics', score: 41, teacher: 'Datin Rina', status: 'active' },
      { initials: 'ML', name: 'Mei Ling Tan', cls: '4 Amanah', subject: 'Science', score: 48, teacher: 'Siti Khadijah', status: 'pending' },
      { initials: 'RM', name: 'Rafi Mukhriz', cls: '1 Aman', subject: 'Mathematics', score: 38, teacher: 'Datin Rina', status: 'active' },
    ],
  };
}

export async function getFinancePageData() {
  await delay();
  return {
    summary: { collected: 1420000, target: 1822000, outstanding: 402000, pct: 78 },
    monthly: [
      { month: 'Jan', amount: 246000, pct: 81 },
      { month: 'Feb', amount: 228000, pct: 75 },
      { month: 'Mar', amount: 272000, pct: 90 },
      { month: 'Apr', amount: 218000, pct: 72 },
      { month: 'May', amount: 241000, pct: 79 },
      { month: 'Jun', amount: 215000, pct: 71 },
    ],
    categories: [
      { name: 'Yuran Tahunan', collected: 860000, target: 1100000, pct: 78 },
      { name: 'Yuran PIBG', collected: 312000, target: 400000, pct: 78 },
      { name: 'Yuran Bas', collected: 148000, target: 202000, pct: 73 },
      { name: 'Yuran Ko-Kurikulum', collected: 100000, target: 120000, pct: 83 },
    ],
  };
}

export async function getCalendarData() {
  await delay();
  const events = [
    { date: 5, month: 6, title: 'PTA Q2 Meeting', type: 'meeting', time: '8:00' },
    { date: 10, month: 6, title: 'Form 5 Q1 Assessment', type: 'exam', time: 'All day' },
    { date: 15, month: 6, title: 'Sports Day (postponed)', type: 'event', time: '7:30' },
    { date: 22, month: 6, title: 'Teacher CPD Session', type: 'admin', time: '14:00' },
    { date: 30, month: 6, title: 'Fee Payment Deadline', type: 'admin', time: 'End of day' },
    { date: 1, month: 7, title: 'SPM Trial Exams begin', type: 'exam', time: 'All day' },
    { date: 8, month: 7, title: 'Mid-Year Assessment', type: 'exam', time: 'All day' },
    { date: 12, month: 7, title: 'Sports Day (rescheduled)', type: 'event', time: '7:30' },
  ];
  return { year: 2026, month: 6, events };
}

export async function getAnalyticsData() {
  await delay();
  return {
    signals: [
      { id: 1, title: 'Attendance drift', value: '+1.1%', trend: 'up', note: 'Improving vs last week', severity: 'good' },
      { id: 2, title: 'Fee compliance', value: '78%', trend: 'flat', note: 'Below 85% school target', severity: 'warning' },
      { id: 3, title: 'At-risk cohort', value: '14', trend: 'up', note: 'Needs principal intervention', severity: 'danger' },
      { id: 4, title: 'Teacher coverage', value: '97%', trend: 'flat', note: 'All core classes have a teacher', severity: 'good' },
      { id: 5, title: 'SPM trial window', value: '9 days', trend: 'down', note: 'Form 5 exam prep urgency rising', severity: 'warning' },
      { id: 6, title: 'Sejarah average', value: '68', trend: 'down', note: 'Lowest subject across all forms', severity: 'danger' },
    ],
    monthly: [
      { month: 'Jan', attendance: 94.1, fees: 81 },
      { month: 'Feb', attendance: 93.8, fees: 75 },
      { month: 'Mar', attendance: 95.2, fees: 90 },
      { month: 'Apr', attendance: 92.6, fees: 72 },
      { month: 'May', attendance: 94.0, fees: 79 },
      { month: 'Jun', attendance: 94.6, fees: 71 },
    ],
    movers: [
      { subject: 'Science', form: 'Form 4', change: '+6 pts', direction: 'up' },
      { subject: 'English', form: 'Form 5', change: '+4 pts', direction: 'up' },
      { subject: 'Sejarah', form: 'Form 5', change: '−3 pts', direction: 'down' },
      { subject: 'Mathematics', form: 'Form 1', change: '−2 pts', direction: 'down' },
    ],
  };
}
