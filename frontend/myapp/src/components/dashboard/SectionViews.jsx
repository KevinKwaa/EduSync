import { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import './SectionViews.css';

import {
  getStudentRoster, getTeacherDirectory, getClassList, getExaminationData,
  getAttendancePage, getFeePageData, getLeaveData, getNoticesPageData,
  getCampusData, getPeopleData, getAcademicsPageData, getFinancePageData,
  getCalendarData, getAnalyticsData,
} from '../../api/sectionsService';

// ── shared hooks + primitives ─────────────────────────────────────────────

function useSection(fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetcher().then(d => { if (alive) { setData(d); setLoading(false); } });
    return () => { alive = false; };
  }, []);
  return { data, loading };
}

function Skeleton({ rows = 5 }) {
  return (
    <div className="sv-skl" aria-busy="true" aria-label="Loading">
      <div className="ui-skeleton" style={{ width: 200, height: 22, borderRadius: 6, marginBottom: 8 }} />
      <div className="ui-skeleton" style={{ width: 300, height: 14, borderRadius: 4, marginBottom: 24 }} />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="ui-skeleton" style={{ height: 46, borderRadius: 8, marginBottom: 10 }} />
      ))}
    </div>
  );
}

function Av({ initials, size = 32 }) {
  return (
    <span className="sv-av" style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}>
      {initials}
    </span>
  );
}

function Bar({ pct, variant = 'default', h = 6 }) {
  return (
    <div className="sv-bar" style={{ height: h }}>
      <span className={`sv-bar__fill sv-bar__fill--${variant}`} style={{ '--pct': `${Math.min(pct ?? 0, 100) / 100}` }} />
    </div>
  );
}

function Tag({ children, v = 'neutral' }) {
  return <span className={`sv-tag sv-tag--${v}`}>{children}</span>;
}

function Head({ title, meta, action }) {
  return (
    <div className="sv-head">
      <div>
        <h2 className="sv-head__title">{title}</h2>
        {meta && <p className="sv-head__meta">{meta}</p>}
      </div>
      {action && <div className="sv-head__action">{action}</div>}
    </div>
  );
}

function Delta({ trend }) {
  if (trend === 'up') return <span className="sv-delta sv-delta--up"><Icon name="arrow-up" size={11} /></span>;
  if (trend === 'down') return <span className="sv-delta sv-delta--down"><Icon name="arrow-down" size={11} /></span>;
  return <span className="sv-delta sv-delta--flat"><Icon name="minus" size={11} /></span>;
}

const fmt = n => new Intl.NumberFormat('en-MY').format(n);
const fmtK = n => `RM ${Math.round(n / 1000)}K`;

const S_LABEL = { 'at-risk': 'At risk', support: 'Needs support', honour: 'Honour roll', normal: 'Enrolled' };
const S_VAR   = { 'at-risk': 'danger',  support: 'warning',       honour: 'success',      normal: 'neutral' };
const URG_VAR = { high: 'danger', medium: 'warning', low: 'neutral' };
const AUD_VAR = { Parents: 'info', Students: 'success', Teachers: 'warning', All: 'neutral' };
const EV_CLR  = { exam: 'var(--accent)', meeting: 'var(--warning)', event: 'var(--success)', admin: 'var(--text-muted)' };
const MON     = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── STUDENTS ──────────────────────────────────────────────────────────────

function StudentsSection({ view }) {
  const { data, loading } = useSection(getStudentRoster);
  if (loading) return <Skeleton />;
  const { total, stats, students } = data;
  const list =
    view === 'at-risk'      ? students.filter(s => s.status === 'at-risk' || s.status === 'support') :
    view === 'honour-roll'  ? students.filter(s => s.status === 'honour') :
    students;

  return (
    <div className="sv-page">
      <Head
        title="Students"
        meta={`${fmt(total)} enrolled · Term 2 · Form 1–5`}
        action={<button className="sv-btn sv-btn--primary" type="button"><Icon name="plus" size={14} /> New student</button>}
      />

      {view === 'roster' && (
        <div className="sv-filter-strip">
          {[
            { label: `All (${fmt(total)})`, v: 'active' },
            { label: `At risk (${stats.atRisk})`, v: 'danger' },
            { label: `Absent today (${stats.absentToday})`, v: '' },
            { label: `Honour roll (${stats.honourRoll})`, v: 'success' },
          ].map(f => (
            <button key={f.label} type="button" className={`sv-filter-pill ${f.v === 'active' ? 'sv-filter-pill--active' : f.v === 'danger' ? 'sv-filter-pill--danger' : f.v === 'success' ? 'sv-filter-pill--success' : ''}`}>{f.label}</button>
          ))}
        </div>
      )}

      {view === 'at-risk' && (
        <div className="sv-alert-bar sv-alert-bar--warning">
          <Icon name="alert-triangle" size={14} />
          {stats.atRisk} students need follow-up — review attendance and academic performance.
        </div>
      )}

      {view === 'honour-roll' && (
        <div className="sv-card sv-honour-banner">
          <span className="sv-honour-banner__n">{stats.honourRoll}</span>
          <div>
            <p className="sv-honour-banner__label">students on the honour roll this term</p>
            <p className="sv-honour-banner__note">Criteria: attendance ≥ 95% and academic score ≥ 85.</p>
          </div>
        </div>
      )}

      <div className="sv-card sv-table-wrap">
        <table className="sv-table">
          <thead>
            <tr><th>Student</th><th>Class</th><th>Attendance</th><th>Score</th><th>Status</th></tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id} className="sv-table__row">
                <td>
                  <div className="sv-person">
                    <Av initials={s.initials} size={30} />
                    <div><span className="sv-person__name">{s.name}</span><span className="sv-person__sub">{s.form}</span></div>
                  </div>
                </td>
                <td className="sv-table__muted">{s.cls}</td>
                <td>
                  <div className="sv-inline-bar">
                    <span className={s.attendance < 80 ? 'sv-num sv-num--low' : 'sv-num'}>{s.attendance}%</span>
                    <Bar pct={s.attendance} variant={s.attendance < 80 ? 'danger' : 'success'} h={4} />
                  </div>
                </td>
                <td className="sv-table__num">{s.score}</td>
                <td><Tag v={S_VAR[s.status]}>{S_LABEL[s.status]}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── TEACHERS ──────────────────────────────────────────────────────────────

function TeachersSection({ view }) {
  const { data: teachers, loading } = useSection(getTeacherDirectory);
  if (loading) return <Skeleton />;
  const onLeave = teachers.filter(t => t.status === 'on-leave');
  const active  = teachers.filter(t => t.status === 'active');
  const rate    = Math.round((active.length / teachers.length) * 100);

  if (view === 'coverage') return (
    <div className="sv-page">
      <Head title="Coverage status" meta={`${rate}% active · ${onLeave.length} on leave today`} />
      <div className="sv-two-col">
        <div className="sv-card sv-coverage-stat">
          <p className="sv-coverage-stat__label">Active now</p>
          <p className="sv-coverage-stat__val">{active.length}<span>/{teachers.length}</span></p>
          <Bar pct={rate} variant="success" h={8} />
          <p className="sv-coverage-stat__note">{rate}% teaching coverage</p>
        </div>
        <div className="sv-card sv-card--flush">
          <p className="sv-card-lbl" style={{padding:'14px 16px 2px'}}>On leave</p>
          {onLeave.map(t => (
            <div key={t.id} className="sv-teacher-row">
              <Av initials={t.initials} size={34} />
              <div className="sv-teacher-row__body"><strong>{t.name}</strong><span>{t.subjects.join(', ')}</span></div>
              <Tag v="warning">On leave</Tag>
            </div>
          ))}
        </div>
      </div>
      <div className="sv-card sv-card--flush">
        <p className="sv-card-lbl" style={{padding:'14px 16px 2px'}}>Classes needing cover</p>
        {[{period:'P3',cls:'4 Amanah',sub:'Science',time:'9:00–10:30',ok:false},{period:'P5',cls:'3 Harapan',sub:'Biology',time:'11:00–12:30',ok:true}].map(c => (
          <div key={c.period} className="sv-cover-row">
            <span className="sv-cover-row__period">{c.period}</span>
            <div className="sv-cover-row__body"><strong>{c.cls}</strong><span>{c.sub} · {c.time}</span></div>
            <Tag v={c.ok ? 'success' : 'danger'}>{c.ok ? 'Ahmad Nizam' : 'Unassigned'}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'schedule') return (
    <div className="sv-page">
      <Head title="Teaching schedule" meta="Weekly hours by teacher" />
      <div className="sv-card sv-table-wrap">
        <table className="sv-table">
          <thead><tr><th>Teacher</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Total</th></tr></thead>
          <tbody>
            {teachers.slice(0, 6).map(t => (
              <tr key={t.id} className="sv-table__row">
                <td><div className="sv-person"><Av initials={t.initials} size={28} /><span className="sv-person__name">{t.name}</span></div></td>
                {[5,4,5,4,4].map((h, i) => <td key={i} className="sv-table__num">{t.status === 'on-leave' ? '—' : `${h}h`}</td>)}
                <td className="sv-table__num">{t.status === 'on-leave' ? '0h' : `${t.hours}h`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="sv-page">
      <Head title="Teaching staff" meta={`${teachers.length} on payroll · ${active.length} active · ${onLeave.length} on leave`}
        action={<button className="sv-btn sv-btn--ghost" type="button">Download roster</button>} />
      <div className="sv-teacher-grid">
        {teachers.map(t => (
          <div key={t.id} className="sv-card sv-teacher-card">
            <div className="sv-teacher-card__head">
              <Av initials={t.initials} size={40} />
              <div className="sv-teacher-card__info"><p className="sv-teacher-card__name">{t.name}</p><p className="sv-teacher-card__role">{t.role}</p></div>
              <Tag v={t.status === 'on-leave' ? 'warning' : 'success'}>{t.status === 'on-leave' ? 'On leave' : 'Active'}</Tag>
            </div>
            <div className="sv-chip-row">{t.subjects.map(s => <span key={s} className="sv-chip">{s}</span>)}</div>
            <div className="sv-teacher-card__stats"><span>{t.classes} classes</span><span>{t.hours}h/wk</span></div>
            <div className="sv-teacher-card__load">
              <div className="sv-teacher-card__load-row"><span>Load</span><span className={t.load > 90 ? 'sv-num sv-num--low' : ''}>{t.status === 'on-leave' ? '—' : `${t.load}%`}</span></div>
              <Bar pct={t.load} variant={t.load > 90 ? 'danger' : t.load > 75 ? 'warning' : 'success'} h={5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CLASSES ───────────────────────────────────────────────────────────────

function ClassesSection({ view }) {
  const { data: groups, loading } = useSection(getClassList);
  if (loading) return <Skeleton />;
  const all = groups.flatMap(g => g.classes);

  if (view === 'performance') return (
    <div className="sv-page">
      <Head title="Class performance" meta={`${all.length} classes ranked by average score`} />
      <div className="sv-card sv-card--flush">
        {[...all].sort((a, b) => b.avgScore - a.avgScore).map((cls, i) => (
          <div key={cls.id} className="sv-rank-row">
            <span className="sv-rank-row__pos">{i + 1}</span>
            <div className="sv-rank-row__body"><strong>{cls.name}</strong><span>{cls.teacher}</span></div>
            <div className="sv-rank-row__right">
              <span className="sv-rank-row__score">{cls.avgScore}</span>
              <Bar pct={cls.avgScore} variant={cls.avgScore >= 80 ? 'success' : cls.avgScore < 70 ? 'danger' : 'default'} h={5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'schedule') return (
    <div className="sv-page">
      <Head title="Class assignments" meta="Teacher-to-class mapping this term" />
      <div className="sv-card sv-table-wrap">
        <table className="sv-table">
          <thead><tr><th>Class</th><th>Homeroom teacher</th><th>Size</th><th>Attendance</th><th>Avg</th></tr></thead>
          <tbody>
            {all.map(cls => (
              <tr key={cls.id} className="sv-table__row">
                <td><strong>{cls.name}</strong></td>
                <td className="sv-table__muted">{cls.teacher}</td>
                <td className="sv-table__num">{cls.size}</td>
                <td><span className={cls.attendance < 85 ? 'sv-num sv-num--low' : 'sv-num'}>{cls.attendance}%</span></td>
                <td className="sv-table__num">{cls.avgScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="sv-page">
      <Head title="Classes" meta={`${all.length} classes · ${all.reduce((n, c) => n + c.size, 0)} students across ${groups.length} forms`} />
      <div className="sv-form-groups">
        {groups.map(g => (
          <div key={g.form} className="sv-form-group">
            <div className="sv-form-group__hd"><span className="sv-form-group__label">{g.form}</span><span className="sv-form-group__count">{g.count} class{g.count !== 1 ? 'es' : ''}</span></div>
            {g.classes.map(cls => (
              <div key={cls.id} className="sv-class-row">
                <div className="sv-class-row__name">{cls.name}</div>
                <div className="sv-class-row__teacher">{cls.teacher}</div>
                <div className="sv-class-row__stats">
                  <span>{cls.size}</span><span className="sv-sep">·</span>
                  <span>{cls.attendance}% att.</span><span className="sv-sep">·</span>
                  <span>avg {cls.avgScore}</span>
                </div>
                <Tag v={cls.status === 'high-perform' ? 'success' : cls.status === 'needs-support' ? 'danger' : 'neutral'}>
                  {cls.status === 'high-perform' ? 'High performer' : cls.status === 'needs-support' ? 'Needs support' : 'On track'}
                </Tag>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EXAMINATIONS ──────────────────────────────────────────────────────────

function ExaminationsSection({ view }) {
  const { data, loading } = useSection(getExaminationData);
  if (loading) return <Skeleton />;

  if (view === 'marking') return (
    <div className="sv-page">
      <Head title="Marking in progress" meta={`${data.marking.length} exams currently being marked`} />
      {data.marking.map(m => (
        <div key={m.id} className="sv-card sv-marking-card">
          <div className="sv-marking-card__hd">
            <div><p className="sv-marking-card__name">{m.name}</p><p className="sv-marking-card__meta">{m.form} · {m.subjects} subjects · Deadline {m.deadline}</p></div>
            <Tag v={m.submitted === m.total ? 'success' : 'warning'}>{m.submitted}/{m.total} submitted</Tag>
          </div>
          <Bar pct={(m.submitted / m.total) * 100} variant={m.submitted === m.total ? 'success' : 'warning'} h={7} />
        </div>
      ))}
    </div>
  );

  if (view === 'results') return (
    <div className="sv-page">
      <Head title="Recent results" meta="Past exam and assessment outcomes" />
      <div className="sv-card sv-card--flush">
        {data.results.map(r => (
          <div key={r.id} className="sv-result-row">
            <div className="sv-result-row__body"><strong>{r.name}</strong><span>{r.form} · {r.date}</span></div>
            <div className="sv-result-row__right">
              <span className="sv-result-row__avg">{r.avg}</span>
              <span className={`sv-delta sv-delta--${r.trend}`}>{r.delta} <Delta trend={r.trend} /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sv-page">
      <Head title="Examinations" meta={`${data.upcoming.length} upcoming · ${data.marking.length} in marking`}
        action={<button className="sv-btn sv-btn--primary" type="button"><Icon name="plus" size={14} /> New exam</button>} />
      <div className="sv-exam-timeline">
        {data.upcoming.map(exam => (
          <div key={exam.id} className="sv-exam-block">
            <div className={`sv-exam-block__countdown ${exam.daysLeft <= 14 ? 'sv-exam-block__countdown--urgent' : ''}`}>
              <span className="sv-exam-block__days">{exam.daysLeft}</span>
              <span className="sv-exam-block__unit">days</span>
            </div>
            <div className="sv-card sv-exam-block__card">
              <div className="sv-exam-block__hd">
                <p className="sv-exam-block__name">{exam.name}</p>
                <Tag v={exam.daysLeft <= 14 ? 'danger' : 'neutral'}>{exam.date}</Tag>
              </div>
              <p className="sv-exam-block__meta">{exam.form} · {exam.subjects} subjects</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ATTENDANCE ────────────────────────────────────────────────────────────

function AttendanceSection({ view }) {
  const { data, loading } = useSection(getAttendancePage);
  if (loading) return <Skeleton />;

  if (view === 'weekly') {
    const max = Math.max(...data.weekTrend.map(d => d.rate));
    return (
      <div className="sv-page">
        <Head title="Weekly attendance" meta="Mon–Fri, week of 16 Jun 2026" />
        <div className="sv-card sv-week-chart">
          <div className="sv-week-bars">
            {data.weekTrend.map(d => (
              <div key={d.day} className="sv-week-bars__col">
                <span className="sv-week-bars__pct">{d.rate}%</span>
                <div className="sv-week-bars__track">
                  <div className="sv-week-bars__fill" style={{ height: `${(d.rate / max) * 100}%`, background: d.rate < 90 ? 'var(--accent)' : 'var(--success)' }} />
                </div>
                <span className="sv-week-bars__day">{d.day}</span>
                <span className="sv-week-bars__date">{d.date}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sv-card sv-table-wrap">
          <table className="sv-table">
            <thead><tr><th>Form</th><th>Present</th><th>Absent</th><th>Rate</th></tr></thead>
            <tbody>
              {data.byForm.map(f => (
                <tr key={f.form} className="sv-table__row">
                  <td><strong>{f.form}</strong></td>
                  <td className="sv-table__num">{f.present}</td>
                  <td className="sv-table__num">{f.total - f.present}</td>
                  <td><span className={f.rate < 90 ? 'sv-num sv-num--low' : 'sv-num'}>{f.rate}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === 'reports') return (
    <div className="sv-page">
      <Head title="Monthly attendance" meta="Jan – Jun 2026 · Target 95%" />
      <div className="sv-card sv-table-wrap">
        <table className="sv-table">
          <thead><tr><th>Month</th><th>Rate</th><th>vs target</th></tr></thead>
          <tbody>
            {data.monthly.map(m => (
              <tr key={m.month} className="sv-table__row">
                <td><strong>{m.month}</strong></td>
                <td><div className="sv-inline-bar"><span className={m.rate < 93 ? 'sv-num sv-num--low' : 'sv-num'}>{m.rate}%</span><Bar pct={m.rate} variant={m.rate < 93 ? 'danger' : 'success'} h={4} /></div></td>
                <td><span className={`sv-delta sv-delta--${m.rate >= 95 ? 'up' : 'down'}`}>{m.rate >= 95 ? '↑' : '↓'} {Math.abs(m.rate - 95).toFixed(1)}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const { today, byForm, absentToday } = data;
  return (
    <div className="sv-page">
      <Head title="Attendance" meta={today.date} />
      <div className="sv-att-snapshot">
        <div className="sv-att-snapshot__main"><span className="sv-att-snapshot__rate">{today.rate}%</span><span className="sv-att-snapshot__lbl">present today</span></div>
        <div className="sv-att-snapshot__pills">
          {[{n:fmt(today.present),l:'Present',v:''},{n:today.absent,l:'Absent',v:'danger'},{n:today.late,l:'Late',v:'warning'}].map(p => (
            <div key={p.l} className={`sv-att-pill${p.v ? ` sv-att-pill--${p.v}` : ''}`}><span>{p.n}</span><label>{p.l}</label></div>
          ))}
        </div>
      </div>
      <div className="sv-two-col">
        <div className="sv-card sv-table-wrap">
          <p className="sv-card-lbl" style={{marginBottom:10}}>By form</p>
          <table className="sv-table">
            <thead><tr><th>Form</th><th>Present/Total</th><th>Rate</th></tr></thead>
            <tbody>
              {byForm.map(f => (
                <tr key={f.form} className="sv-table__row">
                  <td><strong>{f.form}</strong></td>
                  <td className="sv-table__num">{f.present}/{f.total}</td>
                  <td><div className="sv-inline-bar"><span className={f.rate < 90 ? 'sv-num sv-num--low' : 'sv-num'}>{f.rate}%</span><Bar pct={f.rate} variant={f.rate < 90 ? 'danger' : 'success'} h={4} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sv-card sv-card--flush">
          <p className="sv-card-lbl" style={{padding:'14px 16px 4px'}}>Absent — follow up</p>
          {absentToday.map(s => (
            <div key={s.name} className="sv-absent-row">
              <Av initials={s.initials} size={32} />
              <div className="sv-absent-row__body"><strong>{s.name}</strong><span>{s.cls}</span></div>
              <Tag v={s.streak >= 3 ? 'danger' : 'warning'}>{s.streak} day{s.streak !== 1 ? 's' : ''}</Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FEES ──────────────────────────────────────────────────────────────────

function FeesSection({ view }) {
  const { data, loading } = useSection(getFeePageData);
  if (loading) return <Skeleton />;

  if (view === 'overdue') return (
    <div className="sv-page">
      <Head title="Overdue accounts" meta={`Total outstanding: ${fmtK(data.summary.outstanding)}`} />
      <div className="sv-card sv-card--flush">
        {data.overdue.map((o, i) => (
          <div key={i} className="sv-overdue-row">
            <span className="sv-overdue-badge">{o.initials}</span>
            <div className="sv-overdue-row__body"><strong>{o.name}</strong></div>
            <div className="sv-overdue-row__right"><span className="sv-overdue-row__amt">{fmtK(o.amount)}</span><Tag v={URG_VAR[o.urgency]}>{o.urgency}</Tag></div>
          </div>
        ))}
      </div>
      <div className="sv-card">
        <p className="sv-card-lbl" style={{marginBottom:12}}>Recommended actions</p>
        {[
          { icon:'send', text:'Send reminder SMS to Form 4 families (18 accounts)' },
          { icon:'user-check', text:'Schedule PTA call for Form 3 outstanding accounts' },
          { icon:'file-text', text:'Process 9 pending bursary applications' },
        ].map(a => (
          <div key={a.icon} className="sv-action-item"><Icon name={a.icon} size={14} /><span>{a.text}</span></div>
        ))}
      </div>
    </div>
  );

  if (view === 'bursaries') return (
    <div className="sv-page">
      <Head title="Bursaries & support" meta={`${data.bursaries.length} applications this term`} />
      <div className="sv-card sv-table-wrap">
        <table className="sv-table">
          <thead><tr><th>Student</th><th>Class</th><th>Scheme</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {data.bursaries.map(b => (
              <tr key={b.id} className="sv-table__row">
                <td><strong>{b.name}</strong></td>
                <td className="sv-table__muted">{b.form}</td>
                <td className="sv-table__muted">{b.type}</td>
                <td className="sv-table__num">RM {fmt(b.amount)}</td>
                <td><Tag v={b.status === 'approved' ? 'success' : b.status === 'pending' ? 'warning' : 'neutral'}>{b.status}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const { summary, byForm } = data;
  return (
    <div className="sv-page">
      <Head title="School fees" meta={`Term 2 · Target RM ${fmt(summary.target / 1000)}K`}
        action={<button className="sv-btn sv-btn--ghost" type="button">Export</button>} />
      <div className="sv-fee-hd">
        <div className="sv-fee-hd__cols">
          {[{l:'Collected',v:`RM ${Math.round(summary.collected/1000)}K`,lo:false},{l:'Outstanding',v:`RM ${Math.round(summary.outstanding/1000)}K`,lo:true},{l:'Compliance',v:`${summary.pct}%`,lo:false,big:true}].map(s => (
            <div key={s.l} className={`sv-fee-stat${s.lo ? ' sv-fee-stat--muted' : ''}`}>
              <span className="sv-fee-stat__lbl">{s.l}</span>
              <span className={`sv-fee-stat__val${s.big ? ' sv-fee-stat__val--big' : ''}`}>{s.v}</span>
            </div>
          ))}
        </div>
        <div className="sv-fee-total-bar"><div className="sv-fee-total-bar__fill" style={{'--pct':`${summary.pct/100}`}}/></div>
        <div className="sv-fee-total-bar__lbls"><span>RM 0</span><span>Target RM {Math.round(summary.target/1000)}K</span></div>
      </div>
      <div className="sv-card sv-card--flush">
        <p className="sv-card-lbl" style={{padding:'14px 16px 4px'}}>By form</p>
        {byForm.map(f => (
          <div key={f.form} className="sv-fee-row">
            <span className="sv-fee-row__form">{f.form}</span>
            <div className="sv-fee-row__bar"><Bar pct={f.pct} variant={f.pct < 75 ? 'danger' : f.pct < 85 ? 'warning' : 'success'} h={8} /></div>
            <span className="sv-fee-row__pct">{f.pct}%</span>
            <span className="sv-fee-row__amt">{fmtK(f.collected)} / {fmtK(f.collected + f.outstanding)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LEAVE ─────────────────────────────────────────────────────────────────

function LeaveSection({ view }) {
  const { data, loading } = useSection(getLeaveData);
  if (loading) return <Skeleton />;

  if (view === 'on-leave') return (
    <div className="sv-page">
      <Head title="On leave today" meta={`${data.onLeaveToday.length} staff absent · ${data.coverNeeded.length} classes need cover`} />
      {data.onLeaveToday.map(t => (
        <div key={t.name} className="sv-card sv-leave-status">
          <Av initials={t.initials} size={44} />
          <div><p className="sv-leave-status__name">{t.name}</p><p className="sv-leave-status__sub">{t.subjects}</p><p className="sv-leave-status__return">Returns <strong>{t.returnDate}</strong></p></div>
        </div>
      ))}
      <div className="sv-card sv-card--flush">
        <p className="sv-card-lbl" style={{padding:'14px 16px 4px'}}>Cover required</p>
        {data.coverNeeded.map(c => (
          <div key={c.id} className="sv-cover-row">
            <span className="sv-cover-row__period">{c.period}</span>
            <div className="sv-cover-row__body"><strong>{c.cls}</strong><span>{c.subject} · {c.time}</span></div>
            <Tag v={c.teacher ? 'success' : 'danger'}>{c.teacher || 'Unassigned'}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'coverage') return (
    <div className="sv-page">
      <Head title="Coverage schedule" meta="Today's substitute assignments" />
      <div className="sv-card">
        {data.coverNeeded.map(c => (
          <div key={c.id} className="sv-cover-row sv-cover-row--lg">
            <span className="sv-cover-row__period">{c.period}</span>
            <div className="sv-cover-row__body"><strong>{c.cls}</strong><span>{c.subject} · {c.time}</span></div>
            <div className="sv-cover-row__assign">
              {c.teacher ? <><Tag v="success">{c.teacher}</Tag><span className="sv-cover-confirmed">Confirmed</span></> : <button className="sv-btn sv-btn--primary" type="button">Assign</button>}
            </div>
          </div>
        ))}
      </div>
      <div className="sv-card"><p className="sv-card-lbl" style={{marginBottom:8}}>Available teachers</p><p className="sv-card-note">Ahmad Nizam has free periods P3 and P5 today and can cover both classes.</p></div>
    </div>
  );

  return (
    <div className="sv-page">
      <Head title="Leave" meta={`${data.pending.length} pending · ${data.approved.length} approved · ${data.onLeaveToday.length} on leave today`}
        action={<button className="sv-btn sv-btn--primary" type="button"><Icon name="plus" size={14} /> New request</button>} />
      {data.pending.length > 0 && <>
        <p className="sv-section-lbl">Pending approval</p>
        {data.pending.map(r => (
          <div key={r.id} className="sv-card sv-leave-card">
            <div className="sv-leave-card__hd">
              <Av initials={r.initials} size={36} />
              <div className="sv-leave-card__info">
                <strong>{r.name}</strong>
                <span>{r.type} leave · {r.dates} ({r.days} day{r.days !== 1 ? 's' : ''})</span>
                <span className="sv-leave-card__impact">{r.classes} classes affected · {r.cls}</span>
              </div>
            </div>
            <div className="sv-leave-card__actions">
              <button className="sv-btn sv-btn--ghost" type="button">Decline</button>
              <button className="sv-btn sv-btn--primary" type="button"><Icon name="check" size={13} /> Approve</button>
            </div>
          </div>
        ))}
      </>}
      {data.approved.length > 0 && <>
        <p className="sv-section-lbl">Approved</p>
        {data.approved.map(r => (
          <div key={r.id} className="sv-card sv-leave-card sv-leave-card--approved">
            <Av initials={r.initials} size={36} />
            <div className="sv-leave-card__info"><strong>{r.name}</strong><span>{r.type} · {r.dates}</span></div>
            <Tag v="success">Approved</Tag>
          </div>
        ))}
      </>}
    </div>
  );
}

// ── NOTICES ───────────────────────────────────────────────────────────────

function NoticesSection({ view }) {
  const { data, loading } = useSection(getNoticesPageData);
  if (loading) return <Skeleton />;

  if (view === 'drafts') return (
    <div className="sv-page">
      <Head title="Drafts" meta={`${data.drafts.length} unpublished`}
        action={<button className="sv-btn sv-btn--primary" type="button"><Icon name="edit-3" size={14} /> New notice</button>} />
      {data.drafts.map(n => (
        <div key={n.id} className="sv-card sv-notice-card">
          <div className="sv-notice-card__hd">
            <Av initials={n.initials} size={32} />
            <div className="sv-notice-card__meta"><span>{n.author}</span><span>Saved {n.savedAt}</span></div>
            <Tag v="neutral">Draft</Tag>
          </div>
          <p className="sv-notice-card__title">{n.title}</p>
          <div className="sv-notice-card__actions">
            <Tag v={AUD_VAR[n.audience] || 'neutral'}>{n.audience}</Tag>
            <button className="sv-btn sv-btn--ghost" type="button"><Icon name="edit-3" size={13} /> Edit</button>
            <button className="sv-btn sv-btn--primary" type="button"><Icon name="send" size={13} /> Publish</button>
          </div>
        </div>
      ))}
    </div>
  );

  if (view === 'archive') return (
    <div className="sv-page">
      <Head title="Archive" meta="Previously published notices" />
      <div className="sv-card sv-card--flush">
        {data.archive.map(n => (
          <div key={n.id} className="sv-archive-row">
            <Av initials={n.initials} size={30} />
            <div className="sv-archive-row__body"><strong>{n.title}</strong><span>{n.author} · {n.publishedAt}</span></div>
            <Tag v={AUD_VAR[n.audience] || 'neutral'}>{n.audience}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sv-page">
      <Head title="Notice board" meta={`${data.published.length} published · ${data.drafts.length} drafts`}
        action={<button className="sv-btn sv-btn--primary" type="button"><Icon name="edit-3" size={14} /> New notice</button>} />
      {data.published.map(n => (
        <div key={n.id} className={`sv-card sv-notice-card${n.priority ? ' sv-notice-card--priority' : ''}`}>
          {n.priority && <span className="sv-notice-card__pin">Pinned</span>}
          <div className="sv-notice-card__hd">
            <Av initials={n.initials} size={32} />
            <div className="sv-notice-card__meta"><span>{n.author}</span><span>{n.time}</span></div>
            <Tag v={AUD_VAR[n.audience] || 'neutral'}>{n.audience}</Tag>
          </div>
          <p className="sv-notice-card__title">{n.title}</p>
        </div>
      ))}
    </div>
  );
}

// ── CAMPUSES ──────────────────────────────────────────────────────────────

function CampusesSection({ view }) {
  const { data: campuses, loading } = useSection(getCampusData);
  if (loading) return <Skeleton rows={3} />;

  if (view === 'facilities') return (
    <div className="sv-page">
      <Head title="Facilities" meta="Rooms, labs, and amenities by campus" />
      {campuses.map(c => (
        <div key={c.id} className="sv-card">
          <p className="sv-card-lbl" style={{marginBottom:12}}>{c.name}</p>
          <div className="sv-chip-row">{c.facilities.map(f => <span key={f} className="sv-chip"><Icon name="check" size={12} /> {f}</span>)}</div>
        </div>
      ))}
    </div>
  );

  if (view === 'transport') return (
    <div className="sv-page">
      <Head title="Transport" meta="Bus routes serving the school" />
      <div className="sv-card">
        {['Route 1 — Petaling Jaya North','Route 2 — Subang Jaya','Route 3 — Shah Alam (normal service from 23 Jun)'].map((r, i) => (
          <div key={i} className="sv-cover-row" style={{marginBottom: i < 2 ? 12 : 0}}>
            <span className="sv-cover-row__period">{i + 1}</span>
            <span>{r}</span>
            <Tag v={i === 2 ? 'warning' : 'success'}>{i === 2 ? 'Resumed' : 'Operating'}</Tag>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sv-page">
      <Head title="Campuses" meta={`${campuses.length} sites · ${campuses.reduce((n, c) => n + (c.students || 0), 0).toLocaleString()} students`} />
      <div className="sv-campus-grid">
        {campuses.map(c => (
          <div key={c.id} className="sv-card sv-campus-card">
            <div className="sv-campus-card__hd"><p className="sv-campus-card__name">{c.name}</p><Tag v={c.status === 'operational' ? 'success' : 'warning'}>{c.status === 'operational' ? 'Operational' : 'Partial'}</Tag></div>
            <div className="sv-campus-card__uptime"><span className="sv-campus-card__uptime-val">{c.uptime}%</span><span className="sv-campus-card__uptime-lbl">uptime</span></div>
            <Bar pct={c.uptime} variant={c.uptime >= 95 ? 'success' : 'warning'} h={5} />
            <div className="sv-campus-card__stats">
              {c.students != null && <span>{fmt(c.students)} students</span>}
              {c.classrooms > 0 && <span>{c.classrooms} rooms</span>}
              {c.labs > 0 && <span>{c.labs} labs</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PEOPLE ────────────────────────────────────────────────────────────────

function PeopleSection({ view }) {
  const { data, loading } = useSection(getPeopleData);
  if (loading) return <Skeleton />;

  if (view === 'stats') return (
    <div className="sv-page">
      <Head title="People stats" meta={`${fmt(data.total)} total on register`} />
      <div className="sv-card sv-card--flush">
        {data.segments.map(s => (
          <div key={s.role} className="sv-stat-row">
            <span className="sv-stat-row__role">{s.role}</span>
            <div className="sv-stat-row__bar"><Bar pct={(s.count / data.total) * 100 * 5} variant="default" h={6} /></div>
            <span className="sv-stat-row__count">{fmt(s.count)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'watchlist') return (
    <div className="sv-page">
      <Head title="Watchlist" meta="Flagged for follow-up" />
      {data.watchlist.map((w, i) => (
        <div key={i} className="sv-card sv-watchlist-card">
          <div className="sv-watchlist-card__hd">
            <Av initials={w.initials} size={38} />
            <div><p className="sv-watchlist-card__name">{w.name}</p><p className="sv-watchlist-card__type">{w.type}</p></div>
            <Tag v={URG_VAR[w.urgency]}>{w.urgency}</Tag>
          </div>
          <p className="sv-watchlist-card__reason">{w.reason}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="sv-page">
      <Head title="People" meta={`${fmt(data.total)} on register across all roles`} />
      <div className="sv-people-segs">
        {data.segments.map(s => (
          <div key={s.role} className="sv-card sv-people-seg">
            <span className="sv-people-seg__n">{fmt(s.count)}</span>
            <span className="sv-people-seg__role">{s.role}</span>
          </div>
        ))}
      </div>
      <div className="sv-card sv-card--flush">
        <p className="sv-card-lbl" style={{padding:'14px 16px 4px'}}>Recent activity</p>
        {data.recentActivity.map((a, i) => (
          <div key={i} className="sv-activity-row">
            <Av initials={a.initials} size={32} />
            <div className="sv-activity-row__body"><strong>{a.name}</strong><span>{a.role} · {a.action}</span></div>
            <span className="sv-activity-row__time">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ACADEMICS ─────────────────────────────────────────────────────────────

function AcademicsSection({ view }) {
  const { data, loading } = useSection(getAcademicsPageData);
  if (loading) return <Skeleton />;

  if (view === 'interventions') return (
    <div className="sv-page">
      <Head title="Interventions" meta={`${data.interventions.length} students on active plans`} />
      <div className="sv-card sv-card--flush">
        {data.interventions.map((s, i) => (
          <div key={i} className="sv-absent-row">
            <Av initials={s.initials} size={34} />
            <div className="sv-absent-row__body"><strong>{s.name}</strong><span>{s.cls} · {s.subject} · Teacher: {s.teacher}</span></div>
            <div style={{textAlign:'right'}}><span className="sv-num sv-num--low" style={{display:'block'}}>{s.score}</span><Tag v={s.status === 'active' ? 'warning' : 'neutral'}>{s.status}</Tag></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'by-subject') return (
    <div className="sv-page">
      <Head title="By subject" meta="Average scores across all forms" />
      <div className="sv-card sv-card--flush">
        {data.subjects.map(s => {
          const scores = [s.f1,s.f2,s.f3,s.f4,s.f5].filter(Boolean);
          const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
          return (
            <div key={s.name} className="sv-subject-row">
              <div className="sv-subject-row__name"><strong>{s.name}</strong><Delta trend={s.trend} /></div>
              <div className="sv-subject-row__bar"><Bar pct={avg} variant={avg < 70 ? 'danger' : avg >= 80 ? 'success' : 'default'} h={6} /></div>
              <span className="sv-subject-row__avg">{avg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="sv-page">
      <Head title="Academic overview" meta={`Overall attainment: ${data.overallAttainment}% · Term 2`} />
      <div className="sv-card sv-table-wrap">
        <table className="sv-table sv-matrix">
          <thead><tr><th>Subject</th><th>F1</th><th>F2</th><th>F3</th><th>F4</th><th>F5</th><th></th></tr></thead>
          <tbody>
            {data.subjects.map(s => (
              <tr key={s.name} className="sv-table__row">
                <td className="sv-matrix__subject">{s.name}</td>
                {[s.f1,s.f2,s.f3,s.f4,s.f5].map((v,i)=>(
                  <td key={i} className={`sv-matrix__score ${v==null?'':v<70?'sv-matrix__score--low':v>=80?'sv-matrix__score--high':''}`}>{v??'—'}</td>
                ))}
                <td><Delta trend={s.trend} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── FINANCE ───────────────────────────────────────────────────────────────

function FinanceSection({ view }) {
  const { data, loading } = useSection(getFinancePageData);
  if (loading) return <Skeleton />;

  if (view === 'collections') {
    const max = Math.max(...data.monthly.map(m => m.amount));
    return (
      <div className="sv-page">
        <Head title="Monthly collections" meta="Jan – Jun 2026" />
        <div className="sv-card sv-month-chart">
          <div className="sv-month-bars">
            {data.monthly.map(m => (
              <div key={m.month} className="sv-month-bars__col">
                <span className="sv-month-bars__pct">{m.pct}%</span>
                <div className="sv-month-bars__track">
                  <div className="sv-month-bars__fill" style={{ height:`${(m.amount/max)*100}%`, background: m.pct < 75 ? 'var(--accent)' : m.pct < 85 ? 'var(--warning)' : 'var(--success)' }} />
                </div>
                <span className="sv-month-bars__lbl">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sv-card sv-table-wrap">
          <table className="sv-table">
            <thead><tr><th>Month</th><th>Collected</th><th>% of target</th></tr></thead>
            <tbody>
              {data.monthly.map(m => (
                <tr key={m.month} className="sv-table__row">
                  <td><strong>{m.month}</strong></td>
                  <td className="sv-table__num">RM {fmt(m.amount)}</td>
                  <td><div className="sv-inline-bar"><span className={m.pct<75?'sv-num sv-num--low':'sv-num'}>{m.pct}%</span><Bar pct={m.pct} variant={m.pct<75?'danger':m.pct<85?'warning':'success'} h={4}/></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === 'reports') return (
    <div className="sv-page">
      <Head title="Financial reports" meta="Leadership and board summary" />
      <div className="sv-card sv-table-wrap">
        <table className="sv-table">
          <thead><tr><th>Category</th><th>Collected</th><th>Target</th><th>Rate</th></tr></thead>
          <tbody>
            {data.categories.map(c => (
              <tr key={c.name} className="sv-table__row">
                <td><strong>{c.name}</strong></td>
                <td className="sv-table__num">RM {fmt(c.collected)}</td>
                <td className="sv-table__num">RM {fmt(c.target)}</td>
                <td><div className="sv-inline-bar"><span className={c.pct<75?'sv-num sv-num--low':'sv-num'}>{c.pct}%</span><Bar pct={c.pct} variant={c.pct<75?'danger':c.pct<85?'warning':'success'} h={4}/></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const { summary, categories } = data;
  return (
    <div className="sv-page">
      <Head title="Finance" meta={`Term 2 · ${summary.pct}% of target collected`}
        action={<button className="sv-btn sv-btn--ghost" type="button">Export</button>} />
      <div className="sv-fee-hd">
        <div className="sv-fee-hd__cols">
          {[{l:'Collected',v:`RM ${Math.round(summary.collected/1000)}K`},{l:'Outstanding',v:`RM ${Math.round(summary.outstanding/1000)}K`,lo:true},{l:'Compliance',v:`${summary.pct}%`,big:true}].map(s=>(
            <div key={s.l} className={`sv-fee-stat${s.lo?' sv-fee-stat--muted':''}`}><span className="sv-fee-stat__lbl">{s.l}</span><span className={`sv-fee-stat__val${s.big?' sv-fee-stat__val--big':''}`}>{s.v}</span></div>
          ))}
        </div>
        <div className="sv-fee-total-bar"><div className="sv-fee-total-bar__fill" style={{'--pct':`${summary.pct/100}`}}/></div>
      </div>
      <div className="sv-card sv-card--flush">
        <p className="sv-card-lbl" style={{padding:'14px 16px 4px'}}>By category</p>
        {categories.map(c=>(
          <div key={c.name} className="sv-fee-row">
            <span className="sv-fee-row__form">{c.name}</span>
            <div className="sv-fee-row__bar"><Bar pct={c.pct} variant={c.pct<75?'danger':c.pct<85?'warning':'success'} h={8}/></div>
            <span className="sv-fee-row__pct">{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CALENDAR ──────────────────────────────────────────────────────────────

const WDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function CalendarSection({ view }) {
  const { data, loading } = useSection(getCalendarData);
  if (loading) return <Skeleton rows={6} />;
  const { year, month, events } = data;
  const thisMonth = events.filter(e => e.month === month);

  if (view === 'events') return (
    <div className="sv-page">
      <Head title="Upcoming events" meta={`${events.length} events across Jun–Jul 2026`} />
      {events.map((e, i) => (
        <div key={i} className="sv-card sv-event-row">
          <div className="sv-event-row__badge" style={{background:EV_CLR[e.type]+'22',color:EV_CLR[e.type]}}>
            <span className="sv-event-row__day">{e.date}</span>
            <span className="sv-event-row__mon">{MON[e.month]}</span>
          </div>
          <div className="sv-event-row__body"><strong>{e.title}</strong><span>{e.time}</span></div>
          <Tag v={e.type==='exam'?'danger':e.type==='meeting'?'warning':e.type==='event'?'success':'neutral'}>{e.type}</Tag>
        </div>
      ))}
    </div>
  );

  if (view === 'week') {
    const weekEvs = events.filter(e=>e.month===6&&e.date>=22&&e.date<=28);
    return (
      <div className="sv-page">
        <Head title="Week of 22–28 Jun 2026" meta={`${weekEvs.length} event${weekEvs.length!==1?'s':''} this week`} />
        <div className="sv-card sv-week-grid">
          {WDAYS.map((d,i)=>{
            const date=22+i;
            const evs=events.filter(e=>e.month===6&&e.date===date);
            return (
              <div key={d} className={`sv-week-grid__cell${date===22?' sv-week-grid__cell--today':''}`}>
                <div className="sv-week-grid__hd"><span className="sv-week-grid__day">{d}</span><span className="sv-week-grid__date">{date}</span></div>
                {evs.map((e,j)=><div key={j} className="sv-week-grid__ev" style={{background:EV_CLR[e.type]+'22',color:EV_CLR[e.type]}}>{e.title}</div>)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Month view — June 2026 starts Monday
  const cells = Array.from({length:30},(_,i)=>i+1);
  while(cells.length%7!==0) cells.push(null);

  return (
    <div className="sv-page">
      <Head title={`${MON[month]} ${year}`} meta={`${thisMonth.length} events this month`} />
      <div className="sv-card sv-cal-wrap">
        <div className="sv-cal-grid">
          {WDAYS.map(d=><div key={d} className="sv-cal-grid__hd">{d}</div>)}
          {cells.map((day,i)=>{
            const evs=day?events.filter(e=>e.month===month&&e.date===day):[];
            const today=day===22;
            return (
              <div key={i} className={`sv-cal-grid__cell${!day?' sv-cal-grid__cell--empty':''}${today?' sv-cal-grid__cell--today':''}`}>
                {day&&<><span className="sv-cal-grid__num">{day}</span><div className="sv-cal-grid__dots">{evs.map((e,j)=><span key={j} className="sv-cal-grid__dot" style={{background:EV_CLR[e.type]}} title={e.title}/>)}</div></>}
              </div>
            );
          })}
        </div>
        <div className="sv-cal-legend">
          {Object.entries(EV_CLR).map(([t,c])=><span key={t} className="sv-cal-legend__item"><span className="sv-cal-legend__dot" style={{background:c}}/>{t}</span>)}
        </div>
        <div className="sv-cal-mobile" aria-label="Events this month">
          {thisMonth.length===0
            ? <span style={{fontSize:13,color:'var(--text-muted)'}}>No events this month.</span>
            : thisMonth.map((e,i)=>(
              <div key={i} className="sv-cal-mobile__item">
                <span className="sv-cal-mobile__dot" style={{background:EV_CLR[e.type]}}/>
                <div className="sv-cal-mobile__body">
                  <strong>{e.date} {MON[e.month]} — {e.title}</strong>
                  <span>{e.time}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────

function AnalyticsSection({ view }) {
  const { data, loading } = useSection(getAnalyticsData);
  if (loading) return <Skeleton rows={6} />;

  if (view === 'trends') {
    const maxAtt=100;
    return (
      <div className="sv-page">
        <Head title="Trends" meta="Jan – Jun 2026 · Attendance vs fee compliance" />
        <div className="sv-card sv-trend-chart">
          <div className="sv-trend-legend">
            <span><span className="sv-trend-legend__dot" style={{background:'var(--success)'}}/>Attendance (%)</span>
            <span><span className="sv-trend-legend__dot" style={{background:'var(--accent)'}}/>Fee compliance (%)</span>
          </div>
          {data.monthly.map(m=>(
            <div key={m.month} className="sv-trend-row">
              <span className="sv-trend-row__month">{m.month}</span>
              <div className="sv-trend-row__bars">
                <div className="sv-trend-bar"><div className="sv-trend-bar__fill" style={{width:`${(m.attendance/maxAtt)*100}%`,background:'var(--success)'}}/></div>
                <div className="sv-trend-bar"><div className="sv-trend-bar__fill" style={{width:`${m.fees}%`,background:'var(--accent)'}}/></div>
              </div>
              <span className="sv-trend-row__vals">{m.attendance}% / {m.fees}%</span>
            </div>
          ))}
        </div>
        <div className="sv-card sv-card--flush">
          <p className="sv-card-lbl" style={{padding:'14px 16px 4px'}}>Subject movers</p>
          {data.movers.map((m,i)=>(
            <div key={i} className="sv-absent-row">
              <div className="sv-absent-row__body"><strong>{m.subject}</strong><span>{m.form}</span></div>
              <span className={`sv-delta sv-delta--${m.direction}`}>{m.change} {m.direction==='up'?<Icon name="arrow-up" size={12}/>:<Icon name="arrow-down" size={12}/>}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'reports') return (
    <div className="sv-page">
      <Head title="Leadership pack" meta="Key indicators for board review" />
      <div className="sv-card sv-table-wrap">
        <table className="sv-table">
          <thead><tr><th>Indicator</th><th>Current</th><th>Target</th><th>Status</th></tr></thead>
          <tbody>
            {[
              {l:'Overall attendance',c:'94.6%',t:'95%',ok:false},
              {l:'Fee compliance',c:'78%',t:'85%',ok:false},
              {l:'Teacher coverage',c:'97%',t:'95%',ok:true},
              {l:'At-risk students',c:'14',t:'< 10',ok:false},
              {l:'Academic attainment',c:'79%',t:'80%',ok:false},
              {l:'SPM trial window',c:'9 days',t:'On track',ok:true},
            ].map((r,i)=>(
              <tr key={i} className="sv-table__row">
                <td><strong>{r.l}</strong></td>
                <td className="sv-table__num">{r.c}</td>
                <td className="sv-table__muted">{r.t}</td>
                <td><Tag v={r.ok?'success':'danger'}>{r.ok?'Met':'Below'}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const SEV_VAR = {good:'success',warning:'warning',danger:'danger'};
  return (
    <div className="sv-page">
      <Head title="Analytics" meta={`${data.signals.filter(s=>s.severity==='danger').length} critical · ${data.signals.filter(s=>s.severity==='warning').length} warnings`} />
      <div className="sv-signal-grid">
        {data.signals.map(s=>(
          <div key={s.id} className={`sv-card sv-signal-card sv-signal-card--${s.severity}`}>
            <div className="sv-signal-card__hd">
              <span className="sv-signal-card__title">{s.title}</span>
              <Delta trend={s.trend} />
            </div>
            <p className="sv-signal-card__val">{s.value}</p>
            <p className="sv-signal-card__note">{s.note}</p>
            <Tag v={SEV_VAR[s.severity]}>{s.severity==='good'?'Good':s.severity==='warning'?'Watch':'Action needed'}</Tag>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ROUTER ────────────────────────────────────────────────────────────────

export function SectionView({ section, view }) {
  switch (section) {
    case 'students':     return <StudentsSection view={view} />;
    case 'teachers':     return <TeachersSection view={view} />;
    case 'classes':      return <ClassesSection view={view} />;
    case 'examinations': return <ExaminationsSection view={view} />;
    case 'attendance':   return <AttendanceSection view={view} />;
    case 'fees':         return <FeesSection view={view} />;
    case 'leave':        return <LeaveSection view={view} />;
    case 'notices':      return <NoticesSection view={view} />;
    case 'campuses':     return <CampusesSection view={view} />;
    case 'people':       return <PeopleSection view={view} />;
    case 'academics':    return <AcademicsSection view={view} />;
    case 'finance':      return <FinanceSection view={view} />;
    case 'calendar':     return <CalendarSection view={view} />;
    case 'analytics':    return <AnalyticsSection view={view} />;
    default:             return null;
  }
}
