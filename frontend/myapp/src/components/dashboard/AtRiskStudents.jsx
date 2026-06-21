import { useTheme } from "../../hooks/useTheme";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Pill } from "../ui/Pill";
import { InitialsAvatar } from "../ui/InitialsAvatar";
import "./AtRiskStudents.css";

function levelVariant(level) {
  return level === "HIGH" ? "danger" : "warning";
}

export function AtRiskStudents({ data }) {
  const theme = useTheme();
  if (!data) return null;
  const { totalFlagged, students } = data;
  const avatarVariant = theme === "light" ? "onyx" : "neutral";

  return (
    <Card className="d-atrisk">
      <div className="d-atrisk__header">
        <div className="d-atrisk__title-row">
          <Icon name="sparkles" size={15} className="d-atrisk__spark" aria-hidden="true" />
          <p className="d-panel-title" style={{ margin: 0 }}>
            Students at risk
          </p>
        </div>
        <Pill variant="accent">AI · {totalFlagged} flagged</Pill>
      </div>

      <div className="d-atrisk__list" role="list" aria-label="At-risk students">
        {students.map((s) => (
          <div key={s.id} className="d-atrisk__row" role="listitem">
            <InitialsAvatar initials={s.initials} size={34} radius={8} variant={avatarVariant} />
            <div className="d-atrisk__info">
              <p className="d-atrisk__name">{s.name}</p>
              <p className="d-atrisk__class">{s.cls}</p>
              <p className="d-atrisk__reason" title={s.reason}>
                {s.reason}
              </p>
            </div>
            <Pill variant={levelVariant(s.level)} className="d-atrisk__level">
              {s.level}
            </Pill>
          </div>
        ))}
      </div>
    </Card>
  );
}
