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
