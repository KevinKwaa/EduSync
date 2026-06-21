const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getUpcomingEvents() {
  await delay(70);
  return [
    { id: 1, day: '22', month: 'JUN', title: 'PTA Meeting',     meta: 'Dewan Utama · 8:00 AM' },
    { id: 2, day: '1',  month: 'JUL', title: 'SPM Trial Exams', meta: 'Form 5 · All classrooms' },
    { id: 3, day: '12', month: 'JUL', title: 'Sports Day',       meta: 'Padang Sekolah · 7:30 AM' },
    { id: 4, day: '19', month: 'JUL', title: 'Term Break',       meta: '2 weeks · School closed' },
  ];
}
