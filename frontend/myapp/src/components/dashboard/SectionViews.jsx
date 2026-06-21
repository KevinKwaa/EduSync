import { Card } from "../ui/Card";
import { Pill } from "../ui/Pill";
import { Icon } from "../ui/Icon";
import { InitialsAvatar } from "../ui/InitialsAvatar";
import { useTheme } from "../../hooks/useTheme";
import "./SectionViews.css";

const MODE_LABELS = {
  summary: "Overview",
  performance: "Momentum",
  operations: "Operations",
};

const SECTION_COPY = {
  people: {
    eyebrow: "Main rail · People",
    title: "People control room",
    subtitle: "Students, teachers, and support staff with the next follow-up already surfaced.",
    tag: "Active campus wide",
    heroValue: "4,820",
    heroNote: "People on the current register",
    template: "people",
  },
  students: {
    eyebrow: "Academics · Students",
    title: "Student cohort overview",
    subtitle: "Watchlists, attendance, and intervention priority for each form level.",
    tag: "Term 2 cohort",
    heroValue: "3,406",
    heroNote: "Learners currently enrolled",
    template: "people",
  },
  teachers: {
    eyebrow: "Academics · Teachers",
    title: "Teacher load and coverage",
    subtitle: "Timetable balance, mentoring load, and the teachers closest to burnout.",
    tag: "Staffing health",
    heroValue: "312",
    heroNote: "Teaching staff on payroll",
    template: "people",
  },
  campuses: {
    eyebrow: "Operations · Campuses",
    title: "Campus network overview",
    subtitle: "Capacity, transport, and site health for the main school and satellite blocks.",
    tag: "3 live sites",
    heroValue: "98%",
    heroNote: "Average facility uptime",
    template: "campus",
  },
  academics: {
    eyebrow: "Main rail · Academics",
    title: "Academic delivery board",
    subtitle: "Subject progress, assessment pressure, and classes that need an extra push.",
    tag: "Teaching and learning",
    heroValue: "79%",
    heroNote: "Average subject attainment",
    template: "academics",
  },
  classes: {
    eyebrow: "Academics · Classes",
    title: "Class coverage and pace",
    subtitle: "See which classes are on track, which are compressed, and where the timetable is tight.",
    tag: "59 active groups",
    heroValue: "59",
    heroNote: "Classes running this term",
    template: "academics",
  },
  examinations: {
    eyebrow: "Academics · Examinations",
    title: "Assessment calendar",
    subtitle: "Trial papers, moderation windows, and marking deadlines in one timeline.",
    tag: "Assessment cycle",
    heroValue: "12",
    heroNote: "Major exam checkpoints left",
    template: "academics",
  },
  attendance: {
    eyebrow: "Academics · Attendance",
    title: "Attendance watch",
    subtitle: "Keep the term-wide attendance curve high and spot dips early.",
    tag: "Daily check-in",
    heroValue: "94.6%",
    heroNote: "Average attendance today",
    template: "academics",
  },
  finance: {
    eyebrow: "Main rail · Finance",
    title: "Finance and collections",
    subtitle: "Payments, arrears, and bursary support without digging through spreadsheets.",
    tag: "RM 1.42M collected",
    heroValue: "78%",
    heroNote: "Of the term target collected",
    template: "finance",
  },
  fees: {
    eyebrow: "Finance · School fees",
    title: "Fee collection board",
    subtitle: "Collection pace, overdue accounts, and the families already queued for support.",
    tag: "Payment pipeline",
    heroValue: "78%",
    heroNote: "Fee collection rate",
    template: "finance",
  },
  leave: {
    eyebrow: "Operations · Leave",
    title: "Leave approvals and coverage",
    subtitle: "Teacher leave, replacements, and the classes that need a cover first.",
    tag: "2 pending approvals",
    heroValue: "8",
    heroNote: "Requests waiting today",
    template: "operations",
  },
  notices: {
    eyebrow: "Operations · Notice board",
    title: "Communication queue",
    subtitle: "School notices, portal announcements, and the messages that need publishing next.",
    tag: "4 live notices",
    heroValue: "4",
    heroNote: "Active announcements",
    template: "operations",
  },
  calendar: {
    eyebrow: "Main rail · Calendar",
    title: "Campus calendar",
    subtitle: "A clean view of term milestones, meetings, and the pressure points around them.",
    tag: "Term planner",
    heroValue: "9",
    heroNote: "Upcoming fixed dates",
    template: "calendar",
  },
  analytics: {
    eyebrow: "Main rail · Analytics",
    title: "School pulse analytics",
    subtitle: "Signals, outliers, and the trends that need action before they become problems.",
    tag: "Live insight board",
    heroValue: "6",
    heroNote: "Critical signals being tracked",
    template: "analytics",
  },
};

const PEOPLE_COHORTS = [
  { id: 1, initials: "FN", name: "Faridah Nasir", meta: "Principal · SMK BU", pill: "Leadership", role: "crimson" },
  { id: 2, initials: "AH", name: "Aiman Hakim", meta: "5 Cendekia · Student", pill: "At risk", role: "neutral" },
  { id: 3, initials: "ML", name: "Mei Ling", meta: "4 Amanah · Student", pill: "Needs support", role: "onyx" },
  { id: 4, initials: "DR", name: "Datin Rina", meta: "Mathematics · HOD", pill: "Mentoring", role: "subtle" },
];

const PEOPLE_ACTIONS = [
  { title: "Admissions queue", value: "18", note: "4 files need final verification", icon: "users", pill: "Today" },
  {
    title: "Staff coverage",
    value: "97%",
    note: "All core classes have a teacher",
    icon: "graduation-cap",
    pill: "Healthy",
  },
  {
    title: "Attendance follow-up",
    value: "14",
    note: "Students flagged for contact",
    icon: "calendar-check",
    pill: "Urgent",
  },
];

const ACADEMIC_TRACKS = [
  { title: "Mathematics", score: 76, note: "Paper 2 needs a lift", tone: "warning" },
  { title: "Science", score: 79, note: "Practical work is on pace", tone: "success" },
  { title: "Sejarah", score: 71, note: "Revision sprint is pending", tone: "danger" },
  { title: "English", score: 80, note: "Writing workshop booked", tone: "success" },
];

const ACADEMIC_TASKS = [
  { title: "SPM trial papers", meta: "1 July · All Form 5 classes" },
  { title: "Mid-term moderation", meta: "3 July · Department heads" },
  { title: "Marking window", meta: "8 July · 4 days" },
  { title: "Parent briefing", meta: "12 July · Evening session" },
];

const FINANCE_ROWS = [
  { title: "On time", value: "78%", note: "RM 1.42M collected", tone: "success" },
  { title: "Due soon", value: "96", note: "Invoices due in the next 7 days", tone: "warning" },
  { title: "Overdue", value: "31", note: "Accounts need follow-up", tone: "danger" },
];

const FINANCE_QUEUE = [
  { title: "Form 4 families", meta: "18 accounts · RM 64K outstanding" },
  { title: "Bursary review", meta: "9 applications waiting approval" },
  { title: "Transport fees", meta: "12 invoices cleared today" },
];

const CALENDAR_EVENTS = [
  { day: "22", month: "JUN", title: "PTA Meeting", meta: "Dewan Utama · 8:00 AM" },
  { day: "01", month: "JUL", title: "SPM Trial Exams", meta: "Form 5 · All classrooms" },
  { day: "12", month: "JUL", title: "Sports Day", meta: "Padang Sekolah · 7:30 AM" },
  { day: "19", month: "JUL", title: "Term Break", meta: "2 weeks · School closed" },
];

const ANALYTICS_SIGNALS = [
  { title: "Attendance drift", value: "+1.1%", note: "Improving versus last week", tone: "success" },
  { title: "Fee compliance", value: "78%", note: "Still below ideal target", tone: "warning" },
  { title: "Risk cohort", value: "14", note: "Students need intervention", tone: "danger" },
];

const ANALYTICS_RANKINGS = [
  { title: "Top mover", meta: "Science classes improved by 6 points" },
  { title: "Slowest lane", meta: "Sejarah remains the deepest dip" },
  { title: "Action queue", meta: "3 interventions ready to assign" },
];

const OPERATIONS_NOTICES = [
  { title: "Fee deadline extension", meta: "Published 2 hours ago" },
  { title: "SPM timetable uploaded", meta: "Published 5 hours ago" },
  { title: "Bus route update", meta: "Published yesterday" },
];

const OPERATIONS_LEAVE = [
  { title: "Teacher leave requests", meta: "8 open cases" },
  { title: "Cover schedule", meta: "4 classes need backup" },
  { title: "Publishing queue", meta: "2 notices waiting review" },
];

const CAMPUS_STATS = [
  { title: "Main campus", value: "98%", note: "Facility uptime", tone: "success" },
  { title: "Annex block", value: "81%", note: "Lab occupancy this week", tone: "warning" },
  { title: "Transport", value: "100%", note: "Routes active on time", tone: "success" },
];

const CAMPUS_LIST = [
  { title: "SMK BU Main", meta: "2,840 students · 24 classrooms" },
  { title: "Annex Block A", meta: "Science labs · Afternoon sessions" },
  { title: "Sports Complex", meta: "Booked 4 times this week" },
];

function getSectionCopy(section) {
  return SECTION_COPY[section] ?? SECTION_COPY.analytics;
}

function StatStrip({ items }) {
  return (
    <div className="sv-stats" role="list" aria-label="Section highlights">
      {items.map((item) => (
        <article className="sv-stat" key={item.title} role="listitem">
          <div className="sv-stat__top">
            <span className="sv-stat__label">{item.title}</span>
            {item.pill ? (
              <Pill variant={item.tone === "danger" ? "danger" : item.tone === "warning" ? "warning" : "success"}>
                {item.pill}
              </Pill>
            ) : null}
          </div>
          <strong className="sv-stat__value">{item.value}</strong>
          <p className="sv-stat__note">{item.note}</p>
        </article>
      ))}
    </div>
  );
}

function ListCard({ title, eyebrow, items, avatarVariant, compact = false }) {
  return (
    <Card className="sv-card">
      <div className="sv-card__header">
        <div>
          {eyebrow ? <p className="sv-kicker">{eyebrow}</p> : null}
          <h3 className="sv-card__title">{title}</h3>
        </div>
        <Pill variant="default">Live</Pill>
      </div>
      <div className={`sv-list${compact ? " sv-list--compact" : ""}`}>
        {items.map((item) => (
          <div className="sv-list__row" key={item.title}>
            {item.initials ? (
              <InitialsAvatar initials={item.initials} size={compact ? 30 : 34} radius={8} variant={avatarVariant} />
            ) : (
              <div className="sv-list__icon">
                <Icon name={item.icon ?? "sparkles"} size={15} />
              </div>
            )}
            <div className="sv-list__body">
              <p className="sv-list__title">{item.title}</p>
              <p className="sv-list__meta">{item.meta}</p>
            </div>
            {item.pill ? (
              <Pill variant={item.tone === "danger" ? "danger" : item.tone === "warning" ? "warning" : "success"}>
                {item.pill}
              </Pill>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProgressCard({ title, items }) {
  return (
    <Card className="sv-card">
      <div className="sv-card__header">
        <div>
          <p className="sv-kicker">Live track</p>
          <h3 className="sv-card__title">{title}</h3>
        </div>
        <Pill variant="accent">Term 2</Pill>
      </div>
      <div className="sv-progress-list">
        {items.map((item) => (
          <div className="sv-progress-row" key={item.title}>
            <div className="sv-progress-row__top">
              <span>{item.title}</span>
              <strong>{item.score}%</strong>
            </div>
            <div className="sv-progress" aria-hidden="true">
              <span
                className={`sv-progress__fill sv-progress__fill--${item.tone}`}
                style={{ width: `${item.score}%` }}
              />
            </div>
            <p className="sv-progress-row__note">{item.note}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TimelineCard({ title, items }) {
  return (
    <Card className="sv-card">
      <div className="sv-card__header">
        <div>
          <p className="sv-kicker">Schedule</p>
          <h3 className="sv-card__title">{title}</h3>
        </div>
        <Pill variant="default">Next 30 days</Pill>
      </div>
      <div className="sv-timeline">
        {items.map((item) => (
          <div className="sv-timeline__item" key={`${item.title}-${item.meta}`}>
            {item.day ? (
              <div className="sv-timeline__date">
                <span>{item.day}</span>
                <small>{item.month}</small>
              </div>
            ) : (
              <div className="sv-timeline__dot" aria-hidden="true" />
            )}
            <div className="sv-timeline__body">
              <p className="sv-timeline__title">{item.title}</p>
              <p className="sv-timeline__meta">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HeroPanel({ copy, modeLabel }) {
  return (
    <Card className="sv-hero">
      <div className="sv-hero__copy">
        <div className="sv-hero__eyebrow-row">
          <p className="sv-hero__eyebrow">{copy.eyebrow}</p>
          <Pill variant="accent">{modeLabel}</Pill>
        </div>
        <h1 className="sv-hero__title">{copy.title}</h1>
        <p className="sv-hero__subtitle">{copy.subtitle}</p>
        <div className="sv-hero__chips">
          <Pill variant="default">{copy.tag}</Pill>
          <Pill variant="success">Live data</Pill>
          <Pill variant="default">Updated just now</Pill>
        </div>
      </div>
      <div className="sv-hero__panel">
        <span className="sv-hero__panel-label">Current pulse</span>
        <strong className="sv-hero__panel-value">{copy.heroValue}</strong>
        <p className="sv-hero__panel-note">{copy.heroNote}</p>
        <div className="sv-hero__panel-bars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </Card>
  );
}

function PeopleView({ copy, modeLabel }) {
  const theme = useTheme();
  const avatarVariant = theme === "light" ? "onyx" : "neutral";
  const headerItems = [
    { title: "Students", value: copy.heroValue, note: "Cohort currently enrolled", tone: "success" },
    { title: "Teaching staff", value: "312", note: "Coverage is stable", tone: "success" },
    { title: "Follow-ups", value: "14", note: "Flagged for contact", tone: "warning" },
  ];

  return (
    <div className="sv-page">
      <HeroPanel copy={copy} modeLabel={modeLabel} />
      <StatStrip items={headerItems} />
      <div className="sv-grid sv-grid--2">
        <ListCard
          title="Cohort watch"
          eyebrow="Who needs a nudge"
          items={PEOPLE_COHORTS}
          avatarVariant={avatarVariant}
        />
        <Card className="sv-card">
          <div className="sv-card__header">
            <div>
              <p className="sv-kicker">Operations</p>
              <h3 className="sv-card__title">Today\'s people actions</h3>
            </div>
            <Pill variant="accent">Priority</Pill>
          </div>
          <div className="sv-action-stack">
            {PEOPLE_ACTIONS.map((item) => (
              <article className="sv-action" key={item.title}>
                <div className="sv-action__icon">
                  <Icon name={item.icon} size={15} />
                </div>
                <div className="sv-action__body">
                  <p className="sv-action__title">{item.title}</p>
                  <p className="sv-action__meta">{item.note}</p>
                </div>
                <div className="sv-action__value">
                  <strong>{item.value}</strong>
                  <span>{item.pill}</span>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </div>
      <div className="sv-grid sv-grid--3">
        <Card className="sv-mini-card">
          <p className="sv-kicker">Admissions</p>
          <strong className="sv-mini-card__value">18</strong>
          <p className="sv-mini-card__note">Applications waiting final review.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Attendance</p>
          <strong className="sv-mini-card__value">94.6%</strong>
          <p className="sv-mini-card__note">The campus average is holding.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Mentors</p>
          <strong className="sv-mini-card__value">26</strong>
          <p className="sv-mini-card__note">Teacher mentors active this term.</p>
        </Card>
      </div>
    </div>
  );
}

function AcademicView({ copy, modeLabel }) {
  return (
    <div className="sv-page">
      <HeroPanel copy={copy} modeLabel={modeLabel} />
      <StatStrip
        items={[
          { title: "Core subjects", value: "5", note: "Tracked across the school", tone: "success" },
          { title: "Classes under watch", value: "17", note: "Need moderate support", tone: "warning" },
          { title: "Assessment dates", value: "12", note: "Booked for the term", tone: "success" },
        ]}
      />
      <div className="sv-grid sv-grid--2">
        <ProgressCard title="Subject momentum" items={ACADEMIC_TRACKS} />
        <TimelineCard title="Assessment runway" items={ACADEMIC_TASKS} />
      </div>
      <div className="sv-grid sv-grid--3">
        <Card className="sv-mini-card">
          <p className="sv-kicker">Class load</p>
          <strong className="sv-mini-card__value">59</strong>
          <p className="sv-mini-card__note">Active groups this term.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Interventions</p>
          <strong className="sv-mini-card__value">23</strong>
          <p className="sv-mini-card__note">Students already assigned support.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Exam windows</p>
          <strong className="sv-mini-card__value">4</strong>
          <p className="sv-mini-card__note">Drafted and ready to publish.</p>
        </Card>
      </div>
    </div>
  );
}

function FinanceView({ copy, modeLabel }) {
  return (
    <div className="sv-page">
      <HeroPanel copy={copy} modeLabel={modeLabel} />
      <StatStrip
        items={[
          { title: "Collection rate", value: "78%", note: "Term target is within reach", tone: "success" },
          { title: "Accounts due", value: "96", note: "Due within the week", tone: "warning" },
          { title: "Overdue", value: "31", note: "Needs family follow-up", tone: "danger" },
        ]}
      />
      <div className="sv-grid sv-grid--2">
        <Card className="sv-card">
          <div className="sv-card__header">
            <div>
              <p className="sv-kicker">Collections</p>
              <h3 className="sv-card__title">Fee pipeline</h3>
            </div>
            <Pill variant="accent">RM 1.42M</Pill>
          </div>
          <div className="sv-progress-list">
            {FINANCE_ROWS.map((item) => (
              <div className="sv-progress-row" key={item.title}>
                <div className="sv-progress-row__top">
                  <span>{item.title}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="sv-progress" aria-hidden="true">
                  <span
                    className={`sv-progress__fill sv-progress__fill--${item.tone}`}
                    style={{ width: item.title === "On time" ? "78%" : item.title === "Due soon" ? "56%" : "30%" }}
                  />
                </div>
                <p className="sv-progress-row__note">{item.note}</p>
              </div>
            ))}
          </div>
        </Card>
        <ListCard title="Accounts needing follow-up" eyebrow="Support queue" items={FINANCE_QUEUE} compact />
      </div>
      <div className="sv-grid sv-grid--3">
        <Card className="sv-mini-card">
          <p className="sv-kicker">Bursaries</p>
          <strong className="sv-mini-card__value">9</strong>
          <p className="sv-mini-card__note">Applications waiting review.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Transport fees</p>
          <strong className="sv-mini-card__value">12</strong>
          <p className="sv-mini-card__note">Invoices cleared today.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Receipt batch</p>
          <strong className="sv-mini-card__value">RM 146K</strong>
          <p className="sv-mini-card__note">Ready for posting.</p>
        </Card>
      </div>
    </div>
  );
}

function CalendarView({ copy, modeLabel }) {
  return (
    <div className="sv-page">
      <HeroPanel copy={copy} modeLabel={modeLabel} />
      <StatStrip
        items={[
          { title: "Fixed dates", value: "9", note: "Locked into the term plan", tone: "success" },
          { title: "Meetings", value: "6", note: "Scheduled this month", tone: "warning" },
          { title: "Rooms booked", value: "14", note: "Across all venues", tone: "success" },
        ]}
      />
      <div className="sv-grid sv-grid--2">
        <TimelineCard title="Upcoming milestones" items={CALENDAR_EVENTS} />
        <Card className="sv-card">
          <div className="sv-card__header">
            <div>
              <p className="sv-kicker">Planning</p>
              <h3 className="sv-card__title">Where the week is tight</h3>
            </div>
            <Pill variant="default">Dense week</Pill>
          </div>
          <div className="sv-action-stack">
            <article className="sv-action">
              <div className="sv-action__icon">
                <Icon name="calendar" size={15} />
              </div>
              <div className="sv-action__body">
                <p className="sv-action__title">Monday to Wednesday</p>
                <p className="sv-action__meta">Exam rehearsals and hall bookings overlap here.</p>
              </div>
            </article>
            <article className="sv-action">
              <div className="sv-action__icon">
                <Icon name="users" size={15} />
              </div>
              <div className="sv-action__body">
                <p className="sv-action__title">Friday afternoon</p>
                <p className="sv-action__meta">Staff meeting and sports rehearsal need coordination.</p>
              </div>
            </article>
          </div>
        </Card>
      </div>
      <div className="sv-grid sv-grid--3">
        <Card className="sv-mini-card">
          <p className="sv-kicker">Term break</p>
          <strong className="sv-mini-card__value">19 Jul</strong>
          <p className="sv-mini-card__note">Two weeks of downtime planned.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Events</p>
          <strong className="sv-mini-card__value">4</strong>
          <p className="sv-mini-card__note">Already published to families.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Bookings</p>
          <strong className="sv-mini-card__value">14</strong>
          <p className="sv-mini-card__note">Rooms and venues confirmed.</p>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsView({ copy, modeLabel }) {
  return (
    <div className="sv-page">
      <HeroPanel copy={copy} modeLabel={modeLabel} />
      <StatStrip items={ANALYTICS_SIGNALS} />
      <div className="sv-grid sv-grid--2">
        <Card className="sv-card">
          <div className="sv-card__header">
            <div>
              <p className="sv-kicker">Insights</p>
              <h3 className="sv-card__title">What the data is saying</h3>
            </div>
            <Pill variant="accent">AI readout</Pill>
          </div>
          <div className="sv-action-stack">
            {ANALYTICS_RANKINGS.map((item) => (
              <article className="sv-action" key={item.title}>
                <div className="sv-action__icon">
                  <Icon name="bar-chart-3" size={15} />
                </div>
                <div className="sv-action__body">
                  <p className="sv-action__title">{item.title}</p>
                  <p className="sv-action__meta">{item.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </Card>
        <Card className="sv-card">
          <div className="sv-card__header">
            <div>
              <p className="sv-kicker">Risk map</p>
              <h3 className="sv-card__title">Cohort pressure points</h3>
            </div>
            <Pill variant="warning">Needs action</Pill>
          </div>
          <div className="sv-risk-map">
            <span className="sv-risk-map__bubble sv-risk-map__bubble--lg">Attendance</span>
            <span className="sv-risk-map__bubble sv-risk-map__bubble--md">Fees</span>
            <span className="sv-risk-map__bubble sv-risk-map__bubble--sm">Scores</span>
            <span className="sv-risk-map__bubble sv-risk-map__bubble--sm">Behaviour</span>
          </div>
        </Card>
      </div>
      <div className="sv-grid sv-grid--3">
        <Card className="sv-mini-card">
          <p className="sv-kicker">Retention</p>
          <strong className="sv-mini-card__value">98.2%</strong>
          <p className="sv-mini-card__note">Only a tiny dip from last term.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Pass rate</p>
          <strong className="sv-mini-card__value">91%</strong>
          <p className="sv-mini-card__note">Still trending up across core subjects.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Exports</p>
          <strong className="sv-mini-card__value">6</strong>
          <p className="sv-mini-card__note">Ready for the leadership pack.</p>
        </Card>
      </div>
    </div>
  );
}

function OperationsView({ copy, modeLabel }) {
  return (
    <div className="sv-page">
      <HeroPanel copy={copy} modeLabel={modeLabel} />
      <StatStrip
        items={[
          { title: "Notices live", value: "4", note: "Ready for families", tone: "success" },
          { title: "Leave requests", value: "8", note: "Waiting approval", tone: "warning" },
          { title: "Covers needed", value: "4", note: "Classes without backup", tone: "danger" },
        ]}
      />
      <div className="sv-grid sv-grid--2">
        <ListCard title="Publishing queue" eyebrow="Notices and updates" items={OPERATIONS_NOTICES} compact />
        <ListCard title="Leave and coverage" eyebrow="Staff operations" items={OPERATIONS_LEAVE} compact />
      </div>
      <div className="sv-grid sv-grid--3">
        <Card className="sv-mini-card">
          <p className="sv-kicker">Approved today</p>
          <strong className="sv-mini-card__value">12</strong>
          <p className="sv-mini-card__note">Requests processed by admin.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Drafted notices</p>
          <strong className="sv-mini-card__value">7</strong>
          <p className="sv-mini-card__note">Waiting for sign-off.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Coverage rate</p>
          <strong className="sv-mini-card__value">96%</strong>
          <p className="sv-mini-card__note">Classes already have a cover.</p>
        </Card>
      </div>
    </div>
  );
}

function CampusView({ copy, modeLabel }) {
  return (
    <div className="sv-page">
      <HeroPanel copy={copy} modeLabel={modeLabel} />
      <StatStrip items={CAMPUS_STATS} />
      <div className="sv-grid sv-grid--2">
        <ListCard title="Campus sites" eyebrow="Where the school runs" items={CAMPUS_LIST} compact />
        <Card className="sv-card">
          <div className="sv-card__header">
            <div>
              <p className="sv-kicker">Facilities</p>
              <h3 className="sv-card__title">Space and transport pulse</h3>
            </div>
            <Pill variant="success">Stable</Pill>
          </div>
          <div className="sv-action-stack">
            <article className="sv-action">
              <div className="sv-action__icon">
                <Icon name="building-2" size={15} />
              </div>
              <div className="sv-action__body">
                <p className="sv-action__title">Main campus</p>
                <p className="sv-action__meta">Teaching blocks and admin offices are fully active.</p>
              </div>
            </article>
            <article className="sv-action">
              <div className="sv-action__icon">
                <Icon name="plane" size={15} />
              </div>
              <div className="sv-action__body">
                <p className="sv-action__title">Transport</p>
                <p className="sv-action__meta">All routes are running on schedule today.</p>
              </div>
            </article>
          </div>
        </Card>
      </div>
      <div className="sv-grid sv-grid--3">
        <Card className="sv-mini-card">
          <p className="sv-kicker">Labs</p>
          <strong className="sv-mini-card__value">6</strong>
          <p className="sv-mini-card__note">Open and scheduled.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Transport routes</p>
          <strong className="sv-mini-card__value">3</strong>
          <p className="sv-mini-card__note">Every route is running.</p>
        </Card>
        <Card className="sv-mini-card">
          <p className="sv-kicker">Safety checks</p>
          <strong className="sv-mini-card__value">100%</strong>
          <p className="sv-mini-card__note">The latest round is complete.</p>
        </Card>
      </div>
    </div>
  );
}

export function SectionView({ section, view }) {
  const copy = getSectionCopy(section);
  const modeLabel = MODE_LABELS[view] ?? MODE_LABELS.summary;

  switch (copy.template) {
    case "people":
      return <PeopleView copy={copy} modeLabel={modeLabel} />;
    case "academics":
      return <AcademicView copy={copy} modeLabel={modeLabel} />;
    case "finance":
      return <FinanceView copy={copy} modeLabel={modeLabel} />;
    case "calendar":
      return <CalendarView copy={copy} modeLabel={modeLabel} />;
    case "operations":
      return <OperationsView copy={copy} modeLabel={modeLabel} />;
    case "campus":
      return <CampusView copy={copy} modeLabel={modeLabel} />;
    case "analytics":
    default:
      return <AnalyticsView copy={copy} modeLabel={modeLabel} />;
  }
}
