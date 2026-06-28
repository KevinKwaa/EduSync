import { useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";
import "./TopNav.css";

export function TopNav({ sidebarCollapsed, onToggleSidebar, views, activeView, onViewChange, theme, onToggleTheme }) {
  const isLightMode = theme === "light";
  const navigate = useNavigate();

  return (
    <header className="l-topnav">
      <button
        className="l-topnav__toggle"
        onClick={onToggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!sidebarCollapsed}
        type="button"
      >
        <Icon
          name="panel-left"
          size={16}
          style={{
            transform: sidebarCollapsed ? "rotateY(180deg)" : "none",
            transition: "transform 0.22s var(--ease-out)",
          }}
        />
      </button>

      <nav className="l-topnav__tabs" aria-label="Section view">
        {(views || []).map((view) => (
          <button
            key={view.id}
            className={[
              "l-topnav__tab",
              activeView === view.id ? "l-topnav__tab--active" : "",
              view.disabled ? "l-topnav__tab--disabled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => !view.disabled && onViewChange(view.id)}
            aria-current={activeView === view.id ? "true" : undefined}
            aria-disabled={view.disabled ? "true" : undefined}
            title={view.disabled ? "Coming in Term 3" : undefined}
            type="button"
          >
            {view.label}
          </button>
        ))}
      </nav>

      <div className="l-topnav__actions" role="search">
        <div className="l-topnav__search">
          <Icon name="search" size={15} className="l-topnav__search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search students, classes…"
            className="l-topnav__search-input"
            aria-label="Search students and classes"
          />
        </div>

        <button className="l-topnav__bell" aria-label="Notifications (1 new)" type="button">
          <Icon name="bell" size={16} />
          <span className="l-topnav__notif-dot" aria-hidden="true" />
        </button>

        <button
          className="l-topnav__theme"
          onClick={onToggleTheme}
          aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
          title={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
          type="button"
        >
          <Icon name={isLightMode ? "moon" : "sun"} size={16} />
        </button>

        <button className="l-topnav__cta" type="button" onClick={() => navigate('/students/register')}>
          <Icon name="plus" size={15} />
          <span className="l-topnav__cta-text">New admission</span>
        </button>
      </div>
    </header>
  );
}
