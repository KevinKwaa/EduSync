import { Card } from '../ui/Card';
import './SubjectPerformance.css';

export function SubjectPerformance({ subjects, shouldAnimate }) {
  return (
    <Card className="d-subjects">
      <p className="d-panel-title">Average score by subject</p>
      <div className="d-subjects__list" role="list" aria-label="Subject performance">
        {subjects.map((s, i) => (
          <div key={s.subject} className="d-subjects__row" role="listitem">
            <div className="d-subjects__label-row">
              <span className="d-subjects__name">{s.subject}</span>
              <span className={`d-subjects__score${s.highlight ? ' d-subjects__score--accent' : ''}`}>
                {s.score}
              </span>
            </div>
            <div
              className="d-subjects__track"
              role="progressbar"
              aria-valuenow={s.score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${s.subject}: ${s.score}%`}
            >
              <div
                className={`d-subjects__fill${s.highlight ? ' d-subjects__fill--accent' : ''}${shouldAnimate ? ' d-subjects__fill--animate' : ''}`}
                style={{
                  width: `${s.score}%`,
                  animationDelay: shouldAnimate ? `${i * 0.05}s` : '0s',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
