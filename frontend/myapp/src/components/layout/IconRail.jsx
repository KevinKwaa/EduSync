import { RAIL_ITEMS } from "../../constants/nav";
import { Icon } from "../ui/Icon";
import "./IconRail.css";

export function IconRail({ activeNavItem, onNavChange }) {
  return (
    <nav className="l-rail" aria-label="Main navigation" data-theme="dark">
      <div className="l-rail__logo" aria-label="EduSync">
        E
      </div>

      <ul className="l-rail__items" role="list">
        {RAIL_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              className={`l-rail__btn${activeNavItem === item.id ? " l-rail__btn--active" : ""}`}
              onClick={() => onNavChange(item.id)}
              aria-label={item.label}
              aria-current={activeNavItem === item.id ? "page" : undefined}
              data-label={item.label}
              title={item.label}
              type="button"
            >
              <Icon name={item.icon} size={19} />
            </button>
          </li>
        ))}
      </ul>

      <button
        className="l-rail__btn l-rail__settings"
        aria-label="Settings"
        data-label="Settings"
        title="Settings"
        type="button"
      >
        <Icon name="settings" size={19} />
      </button>
    </nav>
  );
}
