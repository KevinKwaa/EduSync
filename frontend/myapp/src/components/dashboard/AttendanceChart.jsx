import { Card } from '../ui/Card';
import './AttendanceChart.css';

export function AttendanceChart({ data, shouldAnimate }) {
  if (!data) return null;

  return (
    <Card className="d-attendance">
      <p className="d-panel-title">Attendance this week</p>
      <div
        className="d-attendance__chart"
        role="img"
        aria-label={`Weekly attendance chart. Friday dipped to ${data.find(d => d.highlight)?.rate}%.`}
      >
        {data.map((bar, i) => (
          <div key={bar.day} className="d-attendance__col">
            <span
              className={`d-attendance__rate${bar.highlight ? ' d-attendance__rate--accent' : ''}`}
            >
              {bar.rate}%
            </span>
            <div className="d-attendance__bar-track">
              <div
                className={`d-attendance__bar${bar.highlight ? ' d-attendance__bar--accent' : ''}${shouldAnimate ? ' d-attendance__bar--animate' : ''}`}
                style={{
                  height: `${bar.heightPct}%`,
                  animationDelay: shouldAnimate ? `${i * 0.06}s` : '0s',
                }}
              />
            </div>
            <span
              className={`d-attendance__day${bar.highlight ? ' d-attendance__day--accent' : ''}`}
            >
              {bar.day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
