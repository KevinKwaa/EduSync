import './Skeleton.css';

export function Skeleton({ width, height = 16, radius = 6, className = '', style }) {
  return (
    <div
      className={`ui-skeleton ${className}`}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ height = 120, className = '' }) {
  return (
    <div className={`ui-card ui-skeleton-card ${className}`}>
      <div
        className="ui-skeleton"
        style={{ height: Math.max(height - 32, 40), borderRadius: 6 }}
        aria-hidden="true"
      />
    </div>
  );
}
