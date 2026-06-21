import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { useCountUp } from '../../hooks/useCountUp';
import './KPIRow.css';

function KPICard({ kpi, shouldAnimate }) {
  const display = useCountUp(kpi.rawValue, { format: kpi.format, enabled: shouldAnimate });

  return (
    <Card className="d-kpi">
      <div className="d-kpi__label-row">
        <span className="d-kpi__label">{kpi.label}</span>
        <Icon name={kpi.icon} size={16} className="d-kpi__icon" aria-hidden="true" />
      </div>
      <div className="d-kpi__value" aria-live="polite" aria-atomic="true">
        {display}
      </div>
      <div className={`d-kpi__delta d-kpi__delta--${kpi.deltaType}`}>
        {kpi.deltaIcon && <Icon name={kpi.deltaIcon} size={11} aria-hidden="true" />}
        {kpi.delta}
      </div>
    </Card>
  );
}

export function KPIRow({ kpis, shouldAnimate }) {
  return (
    <div className="d-kpi-row" role="list" aria-label="Key performance indicators">
      {kpis.map((kpi) => (
        <div key={kpi.id} role="listitem">
          <KPICard kpi={kpi} shouldAnimate={shouldAnimate} />
        </div>
      ))}
    </div>
  );
}
