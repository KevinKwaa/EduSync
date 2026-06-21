import './ContentArea.css';

export function ContentArea({ children }) {
  return (
    <main className="l-content" id="main-content" tabIndex={-1}>
      {children}
    </main>
  );
}
