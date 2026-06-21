import './InitialsAvatar.css';

export function InitialsAvatar({ initials, size = 34, radius = 8, variant = 'neutral' }) {
  return (
    <div
      className={`ui-avatar ui-avatar--${variant}`}
      style={{ width: size, height: size, borderRadius: radius, fontSize: Math.round(size * 0.35) }}
      aria-label={initials}
    >
      {initials}
    </div>
  );
}
