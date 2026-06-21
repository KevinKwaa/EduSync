export const SECTION_TABS = {
  dashboard:    [{ id: 'summary', label: 'Summary' }, { id: 'performance', label: 'Performance', disabled: true }, { id: 'operations', label: 'Operations', disabled: true }],
  people:       [{ id: 'directory', label: 'Directory' }, { id: 'stats', label: 'Stats' }, { id: 'watchlist', label: 'Watchlist' }],
  academics:    [{ id: 'overview', label: 'Overview' }, { id: 'by-subject', label: 'By subject' }, { id: 'interventions', label: 'Interventions' }],
  finance:      [{ id: 'summary', label: 'Summary' }, { id: 'collections', label: 'Collections' }, { id: 'reports', label: 'Reports' }],
  calendar:     [{ id: 'month', label: 'Month' }, { id: 'week', label: 'Week' }, { id: 'events', label: 'Events' }],
  analytics:    [{ id: 'signals', label: 'Signals' }, { id: 'trends', label: 'Trends' }, { id: 'reports', label: 'Reports' }],
  campuses:     [{ id: 'overview', label: 'Overview' }, { id: 'facilities', label: 'Facilities' }, { id: 'transport', label: 'Transport' }],
  students:     [{ id: 'roster', label: 'Roster' }, { id: 'at-risk', label: 'At risk' }, { id: 'honour-roll', label: 'Honour roll' }],
  teachers:     [{ id: 'directory', label: 'Directory' }, { id: 'coverage', label: 'Coverage' }, { id: 'schedule', label: 'Schedule' }],
  classes:      [{ id: 'overview', label: 'Overview' }, { id: 'performance', label: 'Performance' }, { id: 'schedule', label: 'Schedule' }],
  examinations: [{ id: 'upcoming', label: 'Upcoming' }, { id: 'marking', label: 'Marking' }, { id: 'results', label: 'Results' }],
  attendance:   [{ id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }, { id: 'reports', label: 'Reports' }],
  fees:         [{ id: 'pipeline', label: 'Pipeline' }, { id: 'overdue', label: 'Overdue' }, { id: 'bursaries', label: 'Bursaries' }],
  leave:        [{ id: 'approvals', label: 'Approvals' }, { id: 'on-leave', label: 'On leave' }, { id: 'coverage', label: 'Coverage' }],
  notices:      [{ id: 'published', label: 'Published' }, { id: 'drafts', label: 'Drafts' }, { id: 'archive', label: 'Archive' }],
};

export const RAIL_ITEMS = [
  { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
  { id: 'people',    icon: 'users',            label: 'People' },
  { id: 'academics', icon: 'book-open',        label: 'Academics' },
  { id: 'finance',   icon: 'wallet',           label: 'Finance' },
  { id: 'calendar',  icon: 'calendar-check',   label: 'Calendar' },
  { id: 'analytics', icon: 'bar-chart-3',      label: 'Analytics' },
];

export const SIDEBAR_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
      { id: 'campuses',  icon: 'building-2',       label: 'Campuses' },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    items: [
      { id: 'students',     icon: 'users',          label: 'Students' },
      { id: 'teachers',     icon: 'graduation-cap', label: 'Teachers' },
      { id: 'classes',      icon: 'layers',         label: 'Classes' },
      { id: 'examinations', icon: 'file-text',      label: 'Examinations' },
      { id: 'attendance',   icon: 'calendar-check', label: 'Attendance' },
    ],
  },
  {
    id: 'finance-ops',
    label: 'Finance & ops',
    items: [
      { id: 'fees',    icon: 'wallet',    label: 'School fees' },
      { id: 'leave',   icon: 'plane',     label: 'Leave' },
      { id: 'notices', icon: 'megaphone', label: 'Notice board' },
    ],
  },
];
