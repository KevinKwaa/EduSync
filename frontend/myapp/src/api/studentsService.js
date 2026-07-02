import { api } from './client';

// At-risk widget. Backend returns { totalFlagged, students:[{id,initials,name,cls,reason,level}] }
// which already matches the shape the dashboard widget consumes.
export async function getAtRiskStudents() {
  const { data } = await api.get('/students/at-risk');
  return {
    totalFlagged: data.totalFlagged,
    students: data.students,
  };
}
