const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getAtRiskStudents() {
  await delay(80);
  return {
    totalFlagged: 14,
    students: [
      {
        id: 'ah',
        initials: 'AH',
        name: 'Aiman Hakim',
        cls: '5 Cendekia',
        reason: 'No logins for 6 days',
        level: 'HIGH',
      },
      {
        id: 'ml',
        initials: 'ML',
        name: 'Mei Ling',
        cls: '4 Amanah',
        reason: 'Maths progress stalled at 40%',
        level: 'MEDIUM',
      },
      {
        id: 'ar',
        initials: 'AR',
        name: 'Arjun Raj',
        cls: '5 Bestari',
        reason: 'Missed 3 assignments',
        level: 'MEDIUM',
      },
    ],
  };
}
