import { Card } from '../ui/Card';
import './UpcomingEvents.css';

export function UpcomingEvents({ events }) {
  return (
    <Card className="d-events">
      <p className="d-panel-title">Upcoming events</p>
      <div className="d-events__list" role="list">
        {events.map((event, i) => (
          <div
            key={event.id}
            className={`d-events__row${i < events.length - 1 ? ' d-events__row--bordered' : ''}`}
            role="listitem"
          >
            <div className="d-events__date" aria-label={`${event.day} ${event.month}`}>
              <span className="d-events__day">{event.day}</span>
              <span className="d-events__month">{event.month}</span>
            </div>
            <div className="d-events__detail">
              <p className="d-events__title">{event.title}</p>
              <p className="d-events__meta">{event.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
