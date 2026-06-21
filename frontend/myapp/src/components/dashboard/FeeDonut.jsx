import { Card } from '../ui/Card';
import './FeeDonut.css';

export function FeeDonut({ data }) {
  if (!data) return null;
  const { collectedPct, collectedLabel, outstandingLabel } = data;

  return (
    <Card className="d-donut">
      <p className="d-panel-title">Fee collection</p>
      <div className="d-donut__body">
        <div
          className="d-donut__ring"
          role="img"
          aria-label={`${collectedPct}% of fees collected. ${outstandingLabel} outstanding.`}
          style={{
            background: `conic-gradient(var(--accent) 0 ${collectedPct}%, var(--donut-track) ${collectedPct}% 100%)`,
          }}
        >
          <div className="d-donut__hole">
            <span className="d-donut__pct">{collectedPct}%</span>
            <span className="d-donut__sub">collected</span>
          </div>
        </div>

        <div className="d-donut__legend">
          <div className="d-donut__legend-item">
            <span className="d-donut__swatch d-donut__swatch--accent" aria-hidden="true" />
            <div>
              <p className="d-donut__legend-label">Collected</p>
              <p className="d-donut__legend-value">{collectedLabel}</p>
            </div>
          </div>
          <div className="d-donut__legend-item">
            <span className="d-donut__swatch d-donut__swatch--track" aria-hidden="true" />
            <div>
              <p className="d-donut__legend-label">Outstanding</p>
              <p className="d-donut__legend-value">{outstandingLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
