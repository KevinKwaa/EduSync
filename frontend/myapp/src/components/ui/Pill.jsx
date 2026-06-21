import './Pill.css';

export function Pill({ children, variant = 'default', className = '' }) {
  return (
    <span className={`ui-pill ui-pill--${variant} ${className}`}>
      {children}
    </span>
  );
}
