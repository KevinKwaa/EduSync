import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginStaff } from '../api/authService';
import { Icon } from '../components/ui/Icon';
import './LoginPage.css';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Already authenticated staff → redirect to dashboard
  useEffect(() => {
    if (user && user.role !== 'PARENT') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError('');
    setLoading(true);
    try {
      const userData = await loginStaff({ email: email.trim(), password });
      login(userData);
      navigate('/', { replace: true });
    } catch {
      setError('Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lp-root">
      {/* ── Brand panel ── */}
      <aside className="lp-brand" aria-hidden="true">
        <div className="lp-brand__grid" />
        <div className="lp-brand__inner">
          <div className="lp-brand__logo">
            <span className="lp-brand__mark" />
            <span className="lp-brand__wordmark">EduSync</span>
          </div>

          <div className="lp-brand__body">
            <h2 className="lp-brand__tagline">
              The administrative command centre for Malaysian schools.
            </h2>
            <p className="lp-brand__sub">
              Manage enrolment, attendance, academic performance, and fees — all from one screen.
            </p>
          </div>

          <ul className="lp-brand__features" role="list">
            {[
              'Enrolment and student records',
              'Daily attendance tracking',
              'Academic performance by form',
              'Fee collection and bursaries',
              'Staff leave and coverage',
            ].map(f => (
              <li key={f} className="lp-brand__feature">
                <Icon name="check" size={12} className="lp-brand__feature-check" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <p className="lp-brand__footer">
            CodeSync Systems · PDPA compliant · Ministry-aligned
          </p>
        </div>
      </aside>

      {/* ── Form panel ── */}
      <div className="lp-form-panel">
        <div className="lp-form-card">
          <header className="lp-form-card__header">
            <div className="lp-form-card__logo-mobile">
              <span className="lp-brand__mark lp-brand__mark--sm" />
              <span className="lp-brand__wordmark lp-brand__wordmark--dark">EduSync</span>
            </div>
            <h1 className="lp-form-card__title">Sign in</h1>
            <p className="lp-form-card__subtitle">Staff and administration access only.</p>
          </header>

          <form className="lp-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="lp-form__error" role="alert" aria-live="polite">
                <Icon name="alert-circle" size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="lp-field">
              <label className="lp-field__label" htmlFor="lp-email">
                Email address
              </label>
              <div className="lp-field__wrap">
                <Icon name="mail" size={15} className="lp-field__icon" />
                <input
                  id="lp-email"
                  type="email"
                  className="lp-field__input"
                  placeholder="faridah@smk.edu.my"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="lp-field">
              <div className="lp-field__label-row">
                <label className="lp-field__label" htmlFor="lp-password">
                  Password
                </label>
                <button type="button" className="lp-field__forgot">
                  Forgot password?
                </button>
              </div>
              <div className="lp-field__wrap">
                <Icon name="lock" size={15} className="lp-field__icon" />
                <input
                  id="lp-password"
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
              disabled={loading || !email.trim() || !password}
              aria-busy={loading}
            >
              {loading && <span className="lp-submit__spinner" aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="lp-divider" aria-hidden="true"><span>or</span></div>

          <div className="lp-portal-links">
            <Link to="/parent" className="lp-portal-link">
              <span className="lp-portal-link__label">Parent portal</span>
              <span className="lp-portal-link__sub">Attendance, grades &amp; fees</span>
              <Icon name="arrow-right" size={13} className="lp-portal-link__arrow" />
            </Link>
            <Link to="/student" className="lp-portal-link">
              <span className="lp-portal-link__label">Student portal</span>
              <span className="lp-portal-link__sub">Timetable, marks &amp; notices</span>
              <Icon name="arrow-right" size={13} className="lp-portal-link__arrow" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
