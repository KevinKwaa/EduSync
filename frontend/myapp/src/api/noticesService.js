const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getNotices() {
  await delay(70);
  return [
    {
      id: 1,
      initials: 'FN',
      text: 'Fee payment deadline extended to 30 June 2026 for Form 4 and 5 students.',
      byline: 'Faridah Nasir · 2 hours ago',
    },
    {
      id: 2,
      initials: 'HM',
      text: 'SPM trial exam timetable has been uploaded to the student portal.',
      byline: 'Hafizuddin Mazlan · 5 hours ago',
    },
    {
      id: 3,
      initials: 'RK',
      text: 'Co-curriculum activity records must be submitted by this Friday.',
      byline: 'Rohani Kamarudin · Yesterday',
    },
    {
      id: 4,
      initials: 'AN',
      text: 'School bus route 3 will resume normal service from Monday, 23 June.',
      byline: 'Admin · 2 days ago',
    },
  ];
}
