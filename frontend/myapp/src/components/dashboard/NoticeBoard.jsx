import { useTheme } from "../../hooks/useTheme";
import { Card } from "../ui/Card";
import { InitialsAvatar } from "../ui/InitialsAvatar";
import "./NoticeBoard.css";

export function NoticeBoard({ notices }) {
  const theme = useTheme();
  const avatarVariant = theme === "light" ? "subtle" : "neutral";

  return (
    <Card className="d-notices">
      <div className="d-notices__header">
        <p className="d-panel-title" style={{ margin: 0 }}>
          Notice board
        </p>
        <button className="d-notices__view-all" type="button">
          View all
        </button>
      </div>
      <div className="d-notices__list" role="list" aria-label="Notices">
        {notices.map((n) => (
          <div key={n.id} className="d-notices__row" role="listitem">
            <InitialsAvatar initials={n.initials} size={32} radius={8} variant={avatarVariant} />
            <div className="d-notices__body">
              <p className="d-notices__text">{n.text}</p>
              <p className="d-notices__byline">{n.byline}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
