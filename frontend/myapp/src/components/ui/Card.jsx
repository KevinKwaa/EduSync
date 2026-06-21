import './Card.css';

export function Card({ children, className = '', style, ...props }) {
  return (
    <div className={`ui-card ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}
