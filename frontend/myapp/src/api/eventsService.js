import { api } from './client';

// Dashboard "upcoming events" widget.
export async function getUpcomingEvents() {
  const { data } = await api.get('/events/upcoming');
  return data.map((e) => ({
    id: e.id,
    day: String(e.day),
    month: e.month,
    title: e.title,
    meta: e.meta || e.location || '',
  }));
}
