import { Icon } from '../ui/Icon';
import './GreetingRow.css';

export function GreetingRow({ summary }) {
  if (!summary) return null;
  return (
    <div className="d-greeting">
      <div>
        <h1 className="d-greeting__title">{summary.greeting}</h1>
        <p className="d-greeting__sub">{summary.term}</p>
      </div>
      <button className="d-greeting__chip" type="button" aria-label="Select date range">
        <Icon name="calendar" size={13} />
        <span>{summary.dateRangeLabel}</span>
        <Icon name="chevron-down" size={13} />
      </button>
    </div>
  );
}
