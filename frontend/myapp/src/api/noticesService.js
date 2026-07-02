import { api } from './client';

// Dashboard notice board: the four most recent published notices.
export async function getNotices() {
  const { data } = await api.get('/notices', { params: { status: 'published' } });
  return data.slice(0, 4).map((n) => ({
    id: n.id,
    initials: n.initials,
    text: n.title,
    byline: `${n.author} · ${n.time}`,
  }));
}
