import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginParent } from '../api/authService';
import { Icon } from '../components/ui/Icon';
import './ParentPortalPage.css';

/* ── mock child data ── */
const CHILD_DATA = {
  attendance: { pct: 72, present: 130, absent: 50, streak: 6 },
  lastScore:  { subject: 'Mathematics', score: 61, date: '10 Jun 2026' },
  fees:       { outstanding: 1200, nextDue: '30 Jun 2026' },
  nextExam:   { name: 'SPM Trial Exams', daysLeft: 6 },
  week: [
    { day: 'Isnin',  present: true  },
    { day: 'Selasa', present: true  },
    { day: 'Rabu',   present: false },
    { day: 'Khamis', present: true  },
    { day: 'Jumaat', present: false },
  ],
  grades: [
    { subject: 'Mathematics',   score: 61, grade: 'C',  date: 'Jun 10' },
    { subject: 'Bahasa Melayu', score: 74, grade: 'B',  date: 'Jun 10' },
    { subject: 'Science',       score: 69, grade: 'C+', date: 'Jun  5' },
    { subject: 'English',       score: 77, grade: 'B+', date: 'Jun  5' },
    { subject: 'Sejarah',       score: 58, grade: 'C-', date: 'May 28' },
  ],
  notices: [
    { id: 1, title: 'Fee payment deadline extended to 30 Jun 2026', time: '2 jam lepas', priority: true  },
    { id: 2, title: 'SPM trial exam timetable uploaded to student portal', time: '5 jam lepas', priority: false },
    { id: 3, title: 'School bus route 3 resumes Monday, 23 Jun', time: '2 hari lepas', priority: false },
  ],
  events: [
    { date: '1 Jul',  title: 'SPM Trial Exams begin', type: 'exam'    },
    { date: '8 Jul',  title: 'Mid-Year Assessment',   type: 'exam'    },
    { date: '12 Jul', title: 'Sports Day',             type: 'event'   },
    { date: '19 Jul', title: 'Term Break',             type: 'holiday' },
  ],
};

function gradeColour(score) {
  if (score >= 80) return 'high';
  if (score >= 65) return 'mid';
  return 'low';
}

export function ParentPortalPage() {
  const { user, login, logout } = useAuth();

  if (user?.role === 'PARENT') {
    return <ParentDashboard user={user} onLogout={logout} />;
  }
  return <ParentLogin onLogin={login} />;
}

/* ─────────────────────────────────────
   Parent login form
───────────────────────────────────── */
function ParentLogin({ onLogin }) {
  const [ic, setIc]           = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await loginParent({ ic: ic.trim(), password });
      onLogin(userData);
    } catch {
      setError('Incorrect IC number or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-login-root" data-theme="light">
      <header className="portal-login-header">
        <div className="portal-login-header__brand">
          <span className="portal-mark" aria-hidden="true" />
          <span className="portal-wordmark">EduSync</span>
        </div>
        <span className="pp-badge">Parent Portal</span>
      </header>

      <main className="portal-login-main">
        <div className="portal-login-card">
          <div className="pp-login-card__icon" aria-hidden="true">
            <Icon name="user" size={22} />
          </div>
          <h1 className="portal-login-card__title">Parent / Guardian sign in</h1>
          <p className="portal-login-card__sub">
            Enter your MyKad IC number and password to view your child's progress at SMK Bandar Utama.
          </p>

          <form className="portal-login-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="portal-login-form__error" role="alert" aria-live="polite">
                <Icon name="alert-circle" size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="lp-field">
              <label className="lp-field__label" htmlFor="pp-ic">
                IC number (MyKad)
              </label>
              <div className="lp-field__wrap">
                <Icon name="credit-card" size={15} className="lp-field__icon" />
                <input
                  id="pp-ic"
                  type="text"
                  className="lp-field__input"
                  placeholder="000000-00-0000"
                  value={ic}
                  onChange={e => setIc(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="lp-field">
              <label className="lp-field__label" htmlFor="pp-pw">
                Password
              </label>
              <div className="lp-field__wrap">
                <Icon name="lock" size={15} className="lp-field__icon" />
                <input
                  id="pp-pw"
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
              disabled={loading || !ic.trim() || !password}
              aria-busy={loading}
            >
              {loading && <span className="lp-submit__spinner" aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="portal-login-card__footer">
            School staff?{' '}
            <Link to="/login" className="portal-login-card__link">Staff login</Link>
          </p>
        </div>
      </main>

      <footer className="portal-login-footer">
        SMK Bandar Utama · smkbu@moe.edu.my · 03-7722 1234
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────
   Parent dashboard
───────────────────────────────────── */
function ParentDashboard({ user, onLogout }) {
  const child = user.children[0];
  const d     = CHILD_DATA;
  const warn  = d.attendance.pct < 80;

  return (
    <div className="portal-dash-root" data-theme="light">
      {/* Header */}
      <header className="portal-dash-header">
        <div className="portal-dash-header__left">
          <span className="portal-mark" aria-hidden="true" />
          <span className="portal-wordmark">EduSync</span>
          <span className="pp-badge">Parent Portal</span>
        </div>
        <div className="portal-dash-header__right">
          <div className="portal-dash-user">
            <div className="pp-dash-user__avatar" aria-hidden="true">
              {user.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>
            <div className="portal-dash-user__info">
              <span className="portal-dash-user__name">{user.name}</span>
              <span className="portal-dash-user__meta">Guardian · {child.name}</span>
            </div>
          </div>
          <button className="portal-dash-logout" onClick={onLogout} type="button" aria-label="Sign out">
            <Icon name="log-out" size={15} />
          </button>
        </div>
      </header>

      <main className="portal-dash-main">
        {/* Child identity bar */}
        <div className="pp-child-bar">
          <div className="pp-child-bar__avatar" aria-hidden="true">{child.initials}</div>
          <div>
            <h2 className="pp-child-bar__name">{child.name}</h2>
            <p className="pp-child-bar__meta">
              {child.form} · {child.cls} · SMK Bandar Utama
            </p>
          </div>
        </div>

        {/* KPI row */}
        <div className="portal-kpi-row">
          <div className={`portal-kpi${warn ? ' portal-kpi--warn' : ' portal-kpi--ok'}`}>
            <span className="portal-kpi__label">Attendance</span>
            <span className="portal-kpi__value">{d.attendance.pct}%</span>
            {warn
              ? <span className="portal-kpi__tag portal-kpi__tag--warn">
                  <Icon name="alert-triangle" size={10} /> Below 80%
                </span>
              : <span className="portal-kpi__tag portal-kpi__tag--ok">On track</span>
            }
          </div>

          <div className="portal-kpi">
            <span className="portal-kpi__label">Last score</span>
            <span className="portal-kpi__value">{d.lastScore.score}</span>
            <span className="portal-kpi__sub">{d.lastScore.subject}</span>
          </div>

          <div className={`portal-kpi${d.fees.outstanding > 0 ? ' portal-kpi--warn' : ' portal-kpi--ok'}`}>
            <span className="portal-kpi__label">Outstanding fees</span>
            <span className="portal-kpi__value">RM {d.fees.outstanding.toLocaleString('en-MY')}</span>
            <span className="portal-kpi__sub">Due {d.fees.nextDue}</span>
          </div>

          <div className="portal-kpi portal-kpi--accent">
            <span className="portal-kpi__label">Next exam</span>
            <span className="portal-kpi__value">{d.nextExam.daysLeft} days</span>
            <span className="portal-kpi__sub">{d.nextExam.name}</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="portal-main-grid">
          {/* Left column */}
          <div className="portal-col">
            {/* Weekly attendance */}
            <div className="portal-card">
              <h3 className="portal-card__title">Attendance this week</h3>
              <div className="pp-week">
                {d.week.map(w => (
                  <div
                    key={w.day}
                    className={`pp-week-day${w.present ? ' pp-week-day--present' : ' pp-week-day--absent'}`}
                  >
                    <div className="pp-week-day__dot" aria-hidden="true" />
                    <span className="pp-week-day__label">{w.day}</span>
                    <span className="pp-week-day__status">{w.present ? 'Hadir' : 'Tidak hadir'}</span>
                  </div>
                ))}
              </div>
              {warn && (
                <div className="pp-week-alert" role="alert">
                  <Icon name="alert-triangle" size={13} />
                  {child.name.split(' ')[0]} has been absent for {d.attendance.streak} consecutive school days.
                  Please contact the school.
                </div>
              )}
            </div>

            {/* Grades */}
            <div className="portal-card">
              <h3 className="portal-card__title">Recent test scores</h3>
              <div className="portal-grades">
                {d.grades.map(g => (
                  <div key={g.subject} className="portal-grade-row">
                    <div className="portal-grade-row__left">
                      <span className="portal-grade-row__subject">{g.subject}</span>
                      <span className="portal-grade-row__date">{g.date}</span>
                    </div>
                    <div className="portal-grade-row__right">
                      <span className="portal-grade-row__score">{g.score}</span>
                      <span className={`portal-grade-badge portal-grade-badge--${gradeColour(g.score)}`}>
                        {g.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="portal-col">
            {/* Fees */}
            <div className="portal-card pp-card--fee">
              <div className="pp-fee-header">
                <div>
                  <h3 className="portal-card__title">School fees</h3>
                  <p className="pp-fee-due">Due by {d.fees.nextDue}</p>
                </div>
                <button className="pp-fee-cta" type="button">Pay now</button>
              </div>
              <div className="pp-fee-row">
                <span className="pp-fee-row__label">Outstanding amount</span>
                <span className="pp-fee-row__value">
                  RM {d.fees.outstanding.toLocaleString('en-MY')}
                </span>
              </div>
            </div>

            {/* Upcoming events */}
            <div className="portal-card">
              <h3 className="portal-card__title">Upcoming events</h3>
              <div className="pp-events">
                {d.events.map(ev => (
                  <div key={ev.title} className="pp-event-row">
                    <div className={`pp-event-pip pp-event-pip--${ev.type}`} aria-hidden="true" />
                    <div className="pp-event-row__info">
                      <span className="pp-event-row__title">{ev.title}</span>
                      <span className="pp-event-row__date">{ev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notices */}
            <div className="portal-card">
              <h3 className="portal-card__title">School notices</h3>
              <div className="portal-notices">
                {d.notices.map(n => (
                  <div key={n.id} className={`portal-notice${n.priority ? ' portal-notice--priority' : ''}`}>
                    {n.priority && (
                      <Icon name="alert-circle" size={12} className="portal-notice__icon" />
                    )}
                    <div className="portal-notice__body">
                      <p className="portal-notice__title">{n.title}</p>
                      <span className="portal-notice__time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="portal-dash-footer">
        <p>SMK Bandar Utama &nbsp;·&nbsp;
          <a href="mailto:smkbu@moe.edu.my">smkbu@moe.edu.my</a>
          &nbsp;·&nbsp; 03-7722 1234
        </p>
        <p>EduSync by CodeSync Systems</p>
      </footer>
    </div>
  );
}
