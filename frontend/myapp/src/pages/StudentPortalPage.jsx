import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginStudent } from '../api/authService';
import { Icon } from '../components/ui/Icon';
import './StudentPortalPage.css';

/* ── Mock student data ── */
const STUDENT_DATA = {
  attendance: { pct: 72, present: 130, absent: 50, streak: 6 },
  avgScore: 67.8,
  nextExam: { name: 'SPM Trial Exams', date: '1 Jul 2026', daysLeft: 6 },
  timetable: [
    { period: 'P1', time: '07:30–08:30', subject: 'Bahasa Melayu', teacher: 'Cikgu Hafizuddin', room: 'DK1',       type: 'bm'  },
    { period: 'P2', time: '08:30–09:30', subject: 'Mathematics',   teacher: 'Datin Rina',       room: 'Bilik 12',  type: 'maths' },
    { period: '—',  time: '09:30–10:00', subject: 'Rehat',         teacher: '',                 room: '',          type: 'break' },
    { period: 'P3', time: '10:00–11:00', subject: 'Science',       teacher: 'Cikgu Siti K.',    room: 'Makmal 1',  type: 'sci'  },
    { period: 'P4', time: '11:00–12:00', subject: 'English',       teacher: 'Cikgu Rohani',     room: 'Bilik 12',  type: 'eng'  },
    { period: 'P5', time: '12:00–13:00', subject: 'Sejarah',       teacher: 'Cikgu Ahmad N.',   room: 'DK2',       type: 'sej'  },
    { period: 'P6', time: '14:00–15:00', subject: 'Pend. Islam',   teacher: 'Cikgu Zulaikha',   room: 'DK1',       type: 'pi'   },
  ],
  assignments: [
    { id: 1, subject: 'Science',       title: 'Laporan Makmal Bab 6', dueDate: '24 Jun 2026', status: 'overdue'  },
    { id: 2, subject: 'Mathematics',   title: 'Latihan Bab 5 — Logaritma', dueDate: '26 Jun 2026', status: 'due-soon' },
    { id: 3, subject: 'Bahasa Melayu', title: 'Karangan: Alam Sekitar', dueDate: '28 Jun 2026', status: 'upcoming' },
  ],
  grades: [
    { subject: 'Mathematics',   score: 61, grade: 'C',  date: 'Jun 10' },
    { subject: 'Bahasa Melayu', score: 74, grade: 'B',  date: 'Jun 10' },
    { subject: 'Science',       score: 69, grade: 'C+', date: 'Jun  5' },
    { subject: 'English',       score: 77, grade: 'B+', date: 'Jun  5' },
    { subject: 'Sejarah',       score: 58, grade: 'C-', date: 'May 28' },
  ],
  exams: [
    { name: 'SPM Trial Exams',    date: '1 Jul 2026',  daysLeft: 6,  form: 'Form 5'   },
    { name: 'Mid-Year Assessment',date: '8 Jul 2026',  daysLeft: 13, form: 'All Forms' },
    { name: 'Mock PT3',           date: '15 Jul 2026', daysLeft: 20, form: 'Form 3'   },
  ],
  notices: [
    { id: 1, title: 'SPM trial exam timetable uploaded to student portal', time: '5h ago',    priority: true  },
    { id: 2, title: 'Co-curriculum records to be submitted by Friday',     time: 'Yesterday', priority: false },
    { id: 3, title: 'School bus route 3 resumes Monday, 23 Jun',           time: '2 days ago',priority: false },
  ],
};

function gradeColour(score) {
  if (score >= 80) return 'high';
  if (score >= 65) return 'mid';
  return 'low';
}

function urgencyLabel(status) {
  if (status === 'overdue')  return 'Overdue';
  if (status === 'due-soon') return 'Due soon';
  return 'Upcoming';
}

export function StudentPortalPage() {
  const { user, login, logout } = useAuth();
  if (user?.role === 'STUDENT') return <StudentDashboard user={user} onLogout={logout} />;
  return <StudentLogin onLogin={login} />;
}

/* ─────────────────────────────────────
   Student login
───────────────────────────────────── */
function StudentLogin({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await loginStudent({ studentId: studentId.trim(), password });
      onLogin(userData);
    } catch {
      setError('Incorrect student ID or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sp-login-root" data-theme="light">
      <header className="sp-login-header">
        <div className="sp-login-header__brand">
          <span className="sp-mark" aria-hidden="true" />
          <span className="sp-wordmark">EduSync</span>
        </div>
        <span className="sp-badge">Student Portal</span>
      </header>

      <main className="sp-login-main">
        <div className="sp-login-card">
          <div className="sp-login-card__icon" aria-hidden="true">
            <Icon name="graduation-cap" size={22} />
          </div>
          <h1 className="sp-login-card__title">Student sign in</h1>
          <p className="sp-login-card__sub">
            Sign in with your student ID and password to access your timetable, grades, and notices.
          </p>

          <form className="sp-login-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="sp-login-form__error" role="alert" aria-live="polite">
                <Icon name="alert-circle" size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="lp-field">
              <label className="lp-field__label" htmlFor="sp-id">Student ID</label>
              <div className="lp-field__wrap">
                <Icon name="user" size={15} className="lp-field__icon" />
                <input
                  id="sp-id"
                  type="text"
                  className="lp-field__input"
                  placeholder="S2024001"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="lp-field">
              <label className="lp-field__label" htmlFor="sp-pw">Password</label>
              <div className="lp-field__wrap">
                <Icon name="lock" size={15} className="lp-field__icon" />
                <input
                  id="sp-pw"
                  type={showPw ? 'text' : 'password'}
                  className="lp-field__input lp-field__input--pw"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="lp-field__eye"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPw ? 'eye-off' : 'eye'} size={15} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="lp-submit"
              disabled={loading || !studentId.trim() || !password}
              aria-busy={loading}
            >
              {loading && <span className="lp-submit__spinner" aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="sp-login-card__footer">
            <Link to="/parent" className="sp-login-card__link">Parent portal</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/login" className="sp-login-card__link">Staff login</Link>
          </p>
        </div>
      </main>

      <footer className="sp-login-footer">
        SMK Bandar Utama · smkbu@moe.edu.my · 03-7722 1234
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────
   Student dashboard
───────────────────────────────────── */
function StudentDashboard({ user, onLogout }) {
  const d    = STUDENT_DATA;
  const warn = d.attendance.pct < 80;
  const overdueCount = d.assignments.filter(a => a.status === 'overdue').length;

  return (
    <div className="sp-dash-root" data-theme="light">
      <header className="sp-dash-header">
        <div className="sp-dash-header__left">
          <span className="sp-mark" aria-hidden="true" />
          <span className="sp-wordmark">EduSync</span>
          <span className="sp-badge">Student Portal</span>
        </div>
        <div className="sp-dash-header__right">
          <div className="sp-dash-user">
            <div className="sp-dash-user__avatar" aria-hidden="true">{user.initials}</div>
            <div className="sp-dash-user__info">
              <span className="sp-dash-user__name">{user.name}</span>
              <span className="sp-dash-user__meta">{user.form} · {user.cls}</span>
            </div>
          </div>
          <button className="sp-dash-logout" onClick={onLogout} type="button" aria-label="Sign out">
            <Icon name="log-out" size={15} />
          </button>
        </div>
      </header>

      <main className="sp-dash-main">
        {/* Greeting */}
        <div className="sp-greeting">
          <h2 className="sp-greeting__title">Selamat datang, {user.name.split(' ')[0]}.</h2>
          <p className="sp-greeting__sub">Isnin, 22 Jun 2026 · {user.form} · {user.cls} · {user.school}</p>
        </div>

        {/* Timetable */}
        <section aria-labelledby="sp-tt-title">
          <h3 className="sp-section-title" id="sp-tt-title">Jadual hari ini</h3>
          <div className="sp-timetable" role="list" aria-label="Today's timetable">
            {d.timetable.map((p, i) => (
              <div
                key={i}
                className={`sp-period${p.type === 'break' ? ' sp-period--break' : ''}`}
                role="listitem"
              >
                <span className="sp-period__label">{p.period}</span>
                <span className="sp-period__time">{p.time}</span>
                <span className="sp-period__subject">{p.subject}</span>
                {p.teacher && <span className="sp-period__teacher">{p.teacher}</span>}
                {p.room    && <span className="sp-period__room">{p.room}</span>}
              </div>
            ))}
          </div>
        </section>

        {/* KPI row */}
        <div className="sp-kpi-row">
          <div className={`sp-kpi${warn ? ' sp-kpi--warn' : ' sp-kpi--ok'}`}>
            <span className="sp-kpi__label">Kehadiran</span>
            <span className="sp-kpi__value">{d.attendance.pct}%</span>
            <span className={`sp-kpi__tag${warn ? ' sp-kpi__tag--warn' : ' sp-kpi__tag--ok'}`}>
              {warn ? <><Icon name="alert-triangle" size={10} /> Di bawah 80%</> : 'Baik'}
            </span>
          </div>

          <div className="sp-kpi">
            <span className="sp-kpi__label">Purata markah</span>
            <span className="sp-kpi__value">{d.avgScore.toFixed(1)}</span>
            <span className="sp-kpi__sub">Semua subjek</span>
          </div>

          <div className={`sp-kpi${overdueCount > 0 ? ' sp-kpi--warn' : ''}`}>
            <span className="sp-kpi__label">Tugasan</span>
            <span className="sp-kpi__value">{d.assignments.length}</span>
            {overdueCount > 0
              ? <span className="sp-kpi__tag sp-kpi__tag--warn">
                  <Icon name="alert-triangle" size={10} /> {overdueCount} tertunggak
                </span>
              : <span className="sp-kpi__sub">Tiada tertunggak</span>
            }
          </div>

          <div className="sp-kpi sp-kpi--accent">
            <span className="sp-kpi__label">Peperiksaan akan datang</span>
            <span className="sp-kpi__value">{d.nextExam.daysLeft} hari</span>
            <span className="sp-kpi__sub">{d.nextExam.name}</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="sp-main-grid">
          {/* Left col */}
          <div className="sp-col">
            {/* Grades */}
            <div className="sp-card">
              <h3 className="sp-card__title">Markah terkini</h3>
              <div className="sp-grades">
                {d.grades.map(g => (
                  <div key={g.subject} className="sp-grade-row">
                    <div className="sp-grade-row__left">
                      <span className="sp-grade-row__subject">{g.subject}</span>
                      <span className="sp-grade-row__date">{g.date}</span>
                    </div>
                    <div className="sp-grade-row__right">
                      <span className="sp-grade-row__score">{g.score}</span>
                      <span className={`sp-grade-badge sp-grade-badge--${gradeColour(g.score)}`}>{g.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div className="sp-card">
              <h3 className="sp-card__title">Tugasan</h3>
              <div className="sp-assignments">
                {d.assignments.map(a => (
                  <div key={a.id} className={`sp-task sp-task--${a.status}`}>
                    <div className="sp-task__body">
                      <span className="sp-task__subject">{a.subject}</span>
                      <p className="sp-task__title">{a.title}</p>
                      <span className="sp-task__due">Hantar: {a.dueDate}</span>
                    </div>
                    <span className={`sp-task__tag sp-task__tag--${a.status}`}>
                      {urgencyLabel(a.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="sp-col">
            {/* Upcoming exams */}
            <div className="sp-card">
              <h3 className="sp-card__title">Peperiksaan akan datang</h3>
              <div className="sp-exams">
                {d.exams.map(ex => (
                  <div key={ex.name} className="sp-exam-row">
                    <div className="sp-exam-row__days">
                      <span className="sp-exam-row__num">{ex.daysLeft}</span>
                      <span className="sp-exam-row__unit">hari</span>
                    </div>
                    <div className="sp-exam-row__info">
                      <span className="sp-exam-row__name">{ex.name}</span>
                      <span className="sp-exam-row__date">{ex.date} · {ex.form}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notices */}
            <div className="sp-card">
              <h3 className="sp-card__title">Notis sekolah</h3>
              <div className="sp-notices">
                {d.notices.map(n => (
                  <div key={n.id} className={`sp-notice${n.priority ? ' sp-notice--priority' : ''}`}>
                    {n.priority && <Icon name="alert-circle" size={12} className="sp-notice__icon" />}
                    <div className="sp-notice__body">
                      <p className="sp-notice__title">{n.title}</p>
                      <span className="sp-notice__time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance warning */}
            {warn && (
              <div className="sp-card sp-card--alert" role="alert">
                <div className="sp-alert-card">
                  <Icon name="alert-triangle" size={16} className="sp-alert-card__icon" />
                  <div>
                    <p className="sp-alert-card__title">Kehadiran rendah</p>
                    <p className="sp-alert-card__body">
                      Kehadiran kamu {d.attendance.pct}% — di bawah paras 80% yang diperlukan.
                      Kamu telah tidak hadir selama {d.attendance.streak} hari berturut-turut.
                      Sila berjumpa Guru Kelas atau HEM.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="sp-dash-footer">
        <p>SMK Bandar Utama &nbsp;·&nbsp;
          <a href="mailto:smkbu@moe.edu.my">smkbu@moe.edu.my</a>
          &nbsp;·&nbsp; 03-7722 1234
        </p>
        <p>EduSync by CodeSync Systems</p>
      </footer>
    </div>
  );
}
