const delay = ms => new Promise(r => setTimeout(r, ms));

export async function loginStaff({ email, password }) {
  await delay(900);
  if (!email || !password) throw new Error('Required');
  return {
    id: 1,
    name: 'Faridah Nasir',
    email,
    role: 'PRINCIPAL',
    school: 'SMK Bandar Utama',
    initials: 'FN',
  };
}

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
