import { useTheme } from "../../hooks/useTheme";
import { SIDEBAR_GROUPS } from "../../constants/nav";
import { Icon } from "../ui/Icon";
import { InitialsAvatar } from "../ui/InitialsAvatar";
import "./Sidebar.css";

export function Sidebar({ collapsed, activeNavItem, onNavChange }) {
  const theme = useTheme();
  const avatarVariant = theme === "light" ? "onyx" : "crimson";

  return (
    <nav className="l-sidebar" data-collapsed={collapsed} aria-label="Section navigation" aria-hidden={collapsed}>
      <div className="l-sidebar__inner">
        {SIDEBAR_GROUPS.map((group, gi) => (
          <div key={group.id} className="l-sidebar__group">
            <p className={`l-sidebar__group-label${gi === 0 ? " l-sidebar__group-label--first" : ""}`}>{group.label}</p>
            <ul role="list">
              {group.items.map((item) => {
                const isActive = activeNavItem === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`l-sidebar__item${isActive ? " l-sidebar__item--active" : ""}`}
                      onClick={() => onNavChange(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      tabIndex={collapsed ? -1 : 0}
                      type="button"
                    >
                      <Icon name={item.icon} size={17} className="l-sidebar__item-icon" />
                      <span className="l-sidebar__item-label">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="l-sidebar__user" aria-label="Signed in as Faridah Nasir">
          <InitialsAvatar initials="FN" size={34} radius={8} variant={avatarVariant} />
          <div className="l-sidebar__user-info">
            <p className="l-sidebar__user-name">Faridah Nasir</p>
            <p className="l-sidebar__user-sub">Principal · SMK BU</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
