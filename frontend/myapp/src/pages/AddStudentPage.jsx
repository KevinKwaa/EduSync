import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerStudent } from '../api/authService';
import { Icon } from '../components/ui/Icon';
import './AddStudentPage.css';

const FORMS = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'];
const CLASSES = {
  'Form 1': ['1 Aman', '1 Bina', '1 Cahaya', '1 Dedikasi'],
  'Form 2': ['2 Maju', '2 Bestari', '2 Wira', '2 Harapan'],
  'Form 3': ['3 Harapan', '3 Maju', '3 Bestari', '3 Wira'],
  'Form 4': ['4 Amanah', '4 Bestari', '4 Cendekia', '4 Dedikasi'],
  'Form 5': ['5 Cendekia', '5 Bestari', '5 Wira', '5 Amanah'],
};

const INIT = {
  fullName: '', ic: '', dob: '', gender: '', nationality: 'Malaysian',
  selectedForm: '', selectedClass: '', admissionDate: '', prevSchool: '',
  guardianName: '', guardianRelation: '', guardianIc: '', guardianPhone: '', guardianEmail: '',
};

export function AddStudentPage() {
  const navigate  = useNavigate();
  const { logout } = useAuth();
  const [form, setForm]       = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { id, name, cls }
  const [errors, setErrors]   = useState({});

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim())        e.fullName        = 'Required';
    if (!form.ic.trim())              e.ic              = 'Required';
    if (!form.dob)                    e.dob             = 'Required';
    if (!form.gender)                 e.gender          = 'Required';
    if (!form.selectedForm)           e.selectedForm    = 'Required';
    if (!form.selectedClass)          e.selectedClass   = 'Required';
    if (!form.admissionDate)          e.admissionDate   = 'Required';
    if (!form.guardianName.trim())    e.guardianName    = 'Required';
    if (!form.guardianRelation)       e.guardianRelation = 'Required';
    if (!form.guardianPhone.trim())   e.guardianPhone   = 'Required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const result = await registerStudent(form);
      setSuccess({ id: result.id, name: form.fullName, cls: form.selectedClass });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="asp-root" data-theme="light">
        <div className="asp-success" role="status">
          <div className="asp-success__icon-wrap" aria-hidden="true">
            <Icon name="check-circle" size={28} />
          </div>
          <h2 className="asp-success__title">Student registered</h2>
          <p className="asp-success__sub">
            {success.name} has been enrolled in {success.cls}.
            Student ID: <strong>#{success.id}</strong>
          </p>
          <div className="asp-success__actions">
            <button
              className="asp-btn asp-btn--ghost"
              onClick={() => { setSuccess(null); setForm(INIT); setErrors({}); }}
              type="button"
            >
              Register another
            </button>
            <button
              className="asp-btn asp-btn--primary"
              onClick={() => navigate('/')}
              type="button"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="asp-root" data-theme="light">
      {/* ── Top bar ── */}
      <header className="asp-topbar">
        <button
          className="asp-topbar__back"
          onClick={() => navigate('/')}
          type="button"
          aria-label="Back to dashboard"
        >
          <Icon name="chevron-left" size={16} />
          Dashboard
        </button>
        <nav className="asp-topbar__crumb" aria-label="Breadcrumb">
          <span>Academics</span>
          <Icon name="chevron-right" size={12} className="asp-topbar__sep" aria-hidden="true" />
          <span>Students</span>
          <Icon name="chevron-right" size={12} className="asp-topbar__sep" aria-hidden="true" />
          <span className="asp-topbar__crumb-current" aria-current="page">Register</span>
        </nav>
        <button
          className="asp-topbar__logout"
          onClick={logout}
          type="button"
          aria-label="Sign out"
        >
          <Icon name="log-out" size={15} />
          Sign out
        </button>
      </header>

      {/* ── Page heading ── */}
      <div className="asp-page-head">
        <div className="asp-page-head__inner">
          <h1 className="asp-page-head__title">Register new student</h1>
          <p className="asp-page-head__sub">SMK Bandar Utama · Academic year 2026</p>
        </div>
      </div>

      {/* ── Form ── */}
      <form className="asp-form" onSubmit={handleSubmit} noValidate>
        <div className="asp-form__body">

          {/* Section 1 — Personal */}
          <section className="asp-section" aria-labelledby="asp-s1">
            <header className="asp-section__head">
              <h2 className="asp-section__title" id="asp-s1">Personal information</h2>
              <p className="asp-section__sub">Details as per MyKad or birth certificate.</p>
            </header>
            <div className="asp-grid">
              <Field label="Full name" required error={errors.fullName} hint="As per MyKad" wide>
                <input
                  type="text"
                  className={`asp-input${errors.fullName ? ' asp-input--err' : ''}`}
                  value={form.fullName}
                  onChange={e => update('fullName', e.target.value)}
                  placeholder="Ahmad Aiman bin Abdullah"
                />
              </Field>

              <Field label="IC number" required error={errors.ic} hint="000000-00-0000">
                <input
                  type="text"
                  className={`asp-input${errors.ic ? ' asp-input--err' : ''}`}
                  value={form.ic}
                  onChange={e => update('ic', e.target.value)}
                  placeholder="030412-14-1234"
                />
              </Field>

              <Field label="Date of birth" required error={errors.dob}>
                <input
                  type="date"
                  className={`asp-input${errors.dob ? ' asp-input--err' : ''}`}
                  value={form.dob}
                  onChange={e => update('dob', e.target.value)}
                />
              </Field>

              <Field label="Gender" required error={errors.gender}>
                <div className="asp-radio-group" role="radiogroup" aria-label="Gender">
                  {['Male', 'Female'].map(g => (
                    <label key={g} className={`asp-radio${form.gender === g ? ' asp-radio--on' : ''}`}>
                      <input
                        type="radio"
                        name="asp-gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={() => update('gender', g)}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Nationality" required>
                <select
                  className="asp-input asp-select"
                  value={form.nationality}
                  onChange={e => update('nationality', e.target.value)}
                >
                  <option>Malaysian</option>
                  <option>Non-Malaysian</option>
                  <option>Stateless</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Section 2 — Academic */}
          <section className="asp-section" aria-labelledby="asp-s2">
            <header className="asp-section__head">
              <h2 className="asp-section__title" id="asp-s2">Academic placement</h2>
              <p className="asp-section__sub">Form and class assignment for the current academic year.</p>
            </header>
            <div className="asp-grid">
              <Field label="Form" required error={errors.selectedForm}>
                <select
                  className={`asp-input asp-select${errors.selectedForm ? ' asp-input--err' : ''}`}
                  value={form.selectedForm}
                  onChange={e => { update('selectedForm', e.target.value); update('selectedClass', ''); }}
                >
                  <option value="">Select form…</option>
                  {FORMS.map(f => <option key={f}>{f}</option>)}
                </select>
              </Field>

              <Field label="Class" required error={errors.selectedClass}>
                <select
                  className={`asp-input asp-select${errors.selectedClass ? ' asp-input--err' : ''}`}
                  value={form.selectedClass}
                  onChange={e => update('selectedClass', e.target.value)}
                  disabled={!form.selectedForm}
                >
                  <option value="">Select class…</option>
                  {(CLASSES[form.selectedForm] || []).map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Admission date" required error={errors.admissionDate}>
                <input
                  type="date"
                  className={`asp-input${errors.admissionDate ? ' asp-input--err' : ''}`}
                  value={form.admissionDate}
                  onChange={e => update('admissionDate', e.target.value)}
                />
              </Field>

              <Field label="Previous school" hint="Optional">
                <input
                  type="text"
                  className="asp-input"
                  value={form.prevSchool}
                  onChange={e => update('prevSchool', e.target.value)}
                  placeholder="SK Damansara Utama"
                />
              </Field>
            </div>
          </section>

          {/* Section 3 — Parent */}
          <section className="asp-section" aria-labelledby="asp-s3">
            <header className="asp-section__head">
              <h2 className="asp-section__title" id="asp-s3">Parent / guardian</h2>
              <p className="asp-section__sub">Primary contact for school communications and fee notices.</p>
            </header>
            <div className="asp-grid">
              <Field label="Full name" required error={errors.guardianName} hint="As per MyKad" wide>
                <input
                  type="text"
                  className={`asp-input${errors.guardianName ? ' asp-input--err' : ''}`}
                  value={form.guardianName}
                  onChange={e => update('guardianName', e.target.value)}
                  placeholder="Abdullah bin Hassan"
                />
              </Field>

              <Field label="Relationship" required error={errors.guardianRelation}>
                <select
                  className={`asp-input asp-select${errors.guardianRelation ? ' asp-input--err' : ''}`}
                  value={form.guardianRelation}
                  onChange={e => update('guardianRelation', e.target.value)}
                >
                  <option value="">Select…</option>
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Legal guardian</option>
                  <option>Relative</option>
                </select>
              </Field>

              <Field label="IC number" hint="MyKad">
                <input
                  type="text"
                  className="asp-input"
                  value={form.guardianIc}
                  onChange={e => update('guardianIc', e.target.value)}
                  placeholder="721012-14-5678"
                />
              </Field>

              <Field label="Phone number" required error={errors.guardianPhone} hint="01X-XXXXXXXX">
                <input
                  type="tel"
                  className={`asp-input${errors.guardianPhone ? ' asp-input--err' : ''}`}
                  value={form.guardianPhone}
                  onChange={e => update('guardianPhone', e.target.value)}
                  placeholder="012-345 6789"
                />
              </Field>

              <Field label="Email address" hint="Optional">
                <input
                  type="email"
                  className="asp-input"
                  value={form.guardianEmail}
                  onChange={e => update('guardianEmail', e.target.value)}
                  placeholder="abdullah@email.com"
                />
              </Field>
            </div>
          </section>
        </div>

        {/* ── Sticky action bar ── */}
        <div className="asp-actionbar">
          <button
            type="button"
            className="asp-btn asp-btn--ghost"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="asp-btn asp-btn--primary"
            disabled={loading}
            aria-busy={loading}
          >
            {loading && <span className="asp-btn__spinner" aria-hidden="true" />}
            {loading ? 'Registering…' : 'Register student'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, error, hint, wide, children }) {
  return (
    <div className={`asp-field${wide ? ' asp-field--wide' : ''}${error ? ' asp-field--invalid' : ''}`}>
      <div className="asp-field__top">
        <span className="asp-field__label">
          {label}
          {required && <span className="asp-field__req" aria-hidden="true"> *</span>}
        </span>
        {error
          ? <span className="asp-field__err" role="alert">{error}</span>
          : hint && <span className="asp-field__hint">{hint}</span>
        }
      </div>
      {children}
    </div>
  );
}
