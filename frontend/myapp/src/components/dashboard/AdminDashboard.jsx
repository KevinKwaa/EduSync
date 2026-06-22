import { useState, useEffect, useCallback } from "react";
import { ThemeContext } from "../../hooks/useTheme";
import { useAnimateData } from "../../hooks/useAnimateData";
import { SECTION_TABS } from "../../constants/nav";

import {
  getDashboardSummary,
  getKPIs,
  getAttendanceData,
  getFeeCollection,
  getSubjectPerformance,
} from "../../api/dashboardService";
import { getAtRiskStudents } from "../../api/studentsService";
import { getUpcomingEvents } from "../../api/eventsService";
import { getNotices } from "../../api/noticesService";

import { IconRail } from "../layout/IconRail";
import { Sidebar } from "../layout/Sidebar";
import { TopNav } from "../layout/TopNav";
import { ContentArea } from "../layout/ContentArea";

import { GreetingRow } from "./GreetingRow";
import { KPIRow } from "./KPIRow";
import { AttendanceChart } from "./AttendanceChart";
import { FeeDonut } from "./FeeDonut";
import { SubjectPerformance } from "./SubjectPerformance";
import { AtRiskStudents } from "./AtRiskStudents";
import { UpcomingEvents } from "./UpcomingEvents";
import { NoticeBoard } from "./NoticeBoard";
import { SectionView } from "./SectionViews";
import { SkeletonCard } from "../ui/Skeleton";
import { Icon } from "../ui/Icon";

import "./AdminDashboard.css";

function DashboardSkeleton() {
  return (
    <div className="ds-skeleton-layout" aria-label="Loading dashboard" aria-busy="true">
      <div className="ds-skeleton-greeting">
        <div className="ui-skeleton" style={{ width: 220, height: 22, borderRadius: 6 }} />
        <div className="ui-skeleton" style={{ width: 300, height: 14, borderRadius: 4, marginTop: 8 }} />
      </div>
      <div className="ds-grid-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} height={108} />
        ))}
      </div>
      <div className="ds-grid-chart">
        <SkeletonCard height={210} />
        <SkeletonCard height={210} />
      </div>
      <div className="ds-grid-2">
        <SkeletonCard height={230} />
        <SkeletonCard height={230} />
      </div>
      <div className="ds-grid-2">
        <SkeletonCard height={220} />
        <SkeletonCard height={220} />
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [theme, setTheme] = useState("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [activeView, setActiveView] = useState("summary");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const { shouldAnimate } = useAnimateData(true);

  const currentTabs = SECTION_TABS[activeNavItem] ?? SECTION_TABS.dashboard;

  useEffect(() => {
    if (window.innerWidth < 640) setSidebarCollapsed(true);
  }, []);

  function handleNavChange(item) {
    setActiveNavItem(item);
    const tabs = SECTION_TABS[item] ?? SECTION_TABS.dashboard;
    setActiveView(tabs[0].id);
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dashData, setDashData] = useState({
    summary: null,
    kpis: [],
    attendance: null,
    fees: null,
    subjects: [],
    atRisk: null,
    events: [],
    notices: [],
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      getDashboardSummary(),
      getKPIs(),
      getAttendanceData(),
      getFeeCollection(),
      getSubjectPerformance(),
      getAtRiskStudents(),
      getUpcomingEvents(),
      getNotices(),
    ])
      .then(([summary, kpis, attendance, fees, subjects, atRisk, events, notices]) => {
        setDashData({ summary, kpis, attendance, fees, subjects, atRisk, events, notices });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ThemeContext.Provider value={theme}>
      <div className="ds-dashboard" data-theme={theme}>
        <IconRail activeNavItem={activeNavItem} onNavChange={handleNavChange} />

        <Sidebar collapsed={sidebarCollapsed} activeNavItem={activeNavItem} onNavChange={handleNavChange} />

        <div className="ds-main">
          <TopNav
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
            views={currentTabs}
            activeView={activeView}
            onViewChange={setActiveView}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          />

          <ContentArea>
            {activeNavItem === "dashboard" ? (
              loading ? (
                <DashboardSkeleton />
              ) : error ? (
                <div className="ds-error" role="alert">
                  <p className="ds-error__msg">Could not load dashboard data.</p>
                  <button className="ds-error__retry" onClick={fetchData} type="button">
                    <Icon name="refresh-cw" size={14} />
                    Retry
                  </button>
                </div>
              ) : (
                <div className="ds-content-inner" key={activeView}>
                  <GreetingRow summary={dashData.summary} />

                  {activeView === "summary" && (
                    <>
                      <KPIRow kpis={dashData.kpis} shouldAnimate={shouldAnimate} />

                      <div className="ds-grid-chart">
                        <AttendanceChart data={dashData.attendance} shouldAnimate={shouldAnimate} />
                        <FeeDonut data={dashData.fees} />
                      </div>

                      <div className="ds-grid-2">
                        <SubjectPerformance subjects={dashData.subjects} shouldAnimate={shouldAnimate} />
                        {showAdvanced && <AtRiskStudents data={dashData.atRisk} />}
                      </div>

                      <div className="ds-grid-2">
                        <UpcomingEvents events={dashData.events} />
                        <NoticeBoard notices={dashData.notices} />
                      </div>
                    </>
                  )}

                  {activeView === "performance" && (
                    <>
                      <KPIRow kpis={dashData.kpis} shouldAnimate={shouldAnimate} />

                      <div className="ds-grid-chart">
                        <AttendanceChart data={dashData.attendance} shouldAnimate={shouldAnimate} />
                        <FeeDonut data={dashData.fees} />
                      </div>

                      <div className="ds-grid-2">
                        <SubjectPerformance subjects={dashData.subjects} shouldAnimate={shouldAnimate} />
                        <AtRiskStudents data={dashData.atRisk} />
                      </div>
                    </>
                  )}

                  {activeView === "operations" && (
                    <>
                      <div className="ds-grid-2">
                        <UpcomingEvents events={dashData.events} />
                        <NoticeBoard notices={dashData.notices} />
                      </div>

                      <div className="ds-grid-chart">
                        <AttendanceChart data={dashData.attendance} shouldAnimate={shouldAnimate} />
                        <FeeDonut data={dashData.fees} />
                      </div>
                    </>
                  )}
                </div>
              )
            ) : (
              <SectionView section={activeNavItem} view={activeView} />
            )}
          </ContentArea>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
