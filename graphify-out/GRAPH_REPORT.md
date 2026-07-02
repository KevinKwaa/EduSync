# Graph Report - .  (2026-06-29)

## Corpus Check
- Corpus is ~36,028 words - fits in a single context window. You may not need a graph.

## Summary
- 652 nodes · 1079 edges · 34 communities (28 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Dashboard Service Layer|Dashboard Service Layer]]
- [[_COMMUNITY_Finance & Fees REST API|Finance & Fees REST API]]
- [[_COMMUNITY_Academic & Student REST API|Academic & Student REST API]]
- [[_COMMUNITY_Academics & Calendar Services|Academics & Calendar Services]]
- [[_COMMUNITY_Attendance & Scheduling Entities|Attendance & Scheduling Entities]]
- [[_COMMUNITY_Fee & Financial Entities|Fee & Financial Entities]]
- [[_COMMUNITY_Frontend Auth Services|Frontend Auth Services]]
- [[_COMMUNITY_Analytics & Performance Entities|Analytics & Performance Entities]]
- [[_COMMUNITY_Brand & Design System|Brand & Design System]]
- [[_COMMUNITY_Frontend Dependencies|Frontend Dependencies]]
- [[_COMMUNITY_Staff & Campus Entities|Staff & Campus Entities]]
- [[_COMMUNITY_Full-Stack Architecture Docs|Full-Stack Architecture Docs]]
- [[_COMMUNITY_Student & User Entities|Student & User Entities]]
- [[_COMMUNITY_Notification & Event Entities|Notification & Event Entities]]
- [[_COMMUNITY_Error Handling & Responses|Error Handling & Responses]]
- [[_COMMUNITY_Payment Record Entities|Payment Record Entities]]
- [[_COMMUNITY_ClassRoom & Enrollment Entities|ClassRoom & Enrollment Entities]]
- [[_COMMUNITY_Spring Security Config|Spring Security Config]]
- [[_COMMUNITY_Grade & Assessment Entities|Grade & Assessment Entities]]
- [[_COMMUNITY_Performance Metrics Entities|Performance Metrics Entities]]
- [[_COMMUNITY_Configuration & Settings Entities|Configuration & Settings Entities]]
- [[_COMMUNITY_Brand Visual Assets|Brand Visual Assets]]
- [[_COMMUNITY_Spring Boot Entry Point|Spring Boot Entry Point]]
- [[_COMMUNITY_JPA Repository Layer|JPA Repository Layer]]
- [[_COMMUNITY_ClassRoom Repository|ClassRoom Repository]]
- [[_COMMUNITY_Unit Tests|Unit Tests]]
- [[_COMMUNITY_Frontend Framework Logos|Frontend Framework Logos]]
- [[_COMMUNITY_Landing Page Hero|Landing Page Hero]]
- [[_COMMUNITY_Maven Project Root|Maven Project Root]]
- [[_COMMUNITY_Spring Profile Config|Spring Profile Config]]
- [[_COMMUNITY_Java Records Pattern|Java Records Pattern]]
- [[_COMMUNITY_Lombok Code Generation|Lombok Code Generation]]

## God Nodes (most connected - your core abstractions)
1. `Student` - 24 edges
2. `FeeRecord` - 19 edges
3. `ClassRoom` - 17 edges
4. `ExamResult` - 17 edges
5. `LeaveRequest` - 17 edges
6. `Notice` - 17 edges
7. `Staff` - 17 edges
8. `User` - 17 edges
9. `AttendanceRecord` - 16 edges
10. `Bursary` - 16 edges

## Surprising Connections (you probably didn't know these)
- `KPI Cards (Total Students, Attendance Today, Fees Collected, Teaching Staff)` --semantically_similar_to--> `API Endpoint Map (/api/v1/auth, /dashboard, /students, /staff, /fees, /academics, /events, /analytics)`  [INFERRED] [semantically similar]
  design-reference/README.md → backend/PASSDOWN.md
- `EduSync Design Principles (Scan before drill, Signal not decoration, Malaysian by default)` --semantically_similar_to--> `CodeSync Systems Design System`  [INFERRED] [semantically similar]
  PRODUCT.md → .claude/skills/codesync-design/SKILL.md
- `P2 Issue: Icon Rail is Recall-Only (No Tooltips)` --semantically_similar_to--> `Admin Dashboard Design Reference (Three-Layer Navigation: Rail + Sidebar + Top Nav)`  [INFERRED] [semantically similar]
  .impeccable/critique/2026-06-21T13-29-34Z__admindashboard-http-localhost-5174.md → design-reference/README.md
- `Brand Personality (Precise, Local, Reliable — Institutional Weight)` --semantically_similar_to--> `Brand Voice Principle (Precise, Local, Reliable)`  [INFERRED] [semantically similar]
  PRODUCT.md → .claude/skills/codesync-design/SKILL.md
- `P1 Issue: KPI Label Contrast Fails AA in Light Theme` --semantically_similar_to--> `Accessibility AA Compliance Principle`  [INFERRED] [semantically similar]
  .impeccable/critique/2026-06-21T13-29-34Z__admindashboard-http-localhost-5174.md → .claude/skills/codesync-design/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **EduSync Full-Stack Architecture (React Frontend + Spring Boot Backend + PostgreSQL)** — readme_react_frontend, readme_spring_boot_backend, readme_postgresql_db, passdown_api_endpoint_map, myapp_index_html_entry [INFERRED 0.95]
- **EduSync Security Stack (JWT + RBAC + Rate Limiting + PDPA + Security Headers)** — passdown_jwt_security, passdown_rbac, passdown_rate_limiting, passdown_pdpa_compliance, passdown_security_headers, passdown_audit_logging [EXTRACTED 1.00]
- **EduSync Brand and Design Alignment (Product Principles + Design System + Dashboard Implementation)** — product_brand_personality, codesync_design_design_system, design_ref_readme_design_tokens, design_ref_readme_admin_dashboard, product_design_principles [INFERRED 0.85]

## Communities (34 total, 6 thin omitted)

### Community 0 - "Dashboard Service Layer"
Cohesion: 0.06
Nodes (40): delay(), getAttendanceData(), getDashboardSummary(), getFeeCollection(), getKPIs(), getSubjectPerformance(), delay(), getUpcomingEvents() (+32 more)

### Community 1 - "Finance & Fees REST API"
Cohesion: 0.07
Nodes (31): RequestMapping, ResponseEntity, RestController, AllArgsConstructor, BigDecimal, Builder, Entity, EntityListeners (+23 more)

### Community 2 - "Academic & Student REST API"
Cohesion: 0.08
Nodes (23): Component, String, HttpServletResponse, RequestMapping, ResponseEntity, RestController, String, Component (+15 more)

### Community 3 - "Academics & Calendar Services"
Cohesion: 0.09
Nodes (39): delay(), getAcademicsPageData(), getAnalyticsData(), getAttendancePage(), getCalendarData(), getCampusData(), getClassList(), getExaminationData() (+31 more)

### Community 4 - "Attendance & Scheduling Entities"
Cohesion: 0.07
Nodes (30): AllArgsConstructor, Builder, Entity, EntityListeners, Getter, LocalDateTime, Long, NoArgsConstructor (+22 more)

### Community 5 - "Fee & Financial Entities"
Cohesion: 0.07
Nodes (29): AllArgsConstructor, Builder, Double, Entity, Getter, LocalDate, Long, NoArgsConstructor (+21 more)

### Community 6 - "Frontend Auth Services"
Cohesion: 0.11
Nodes (21): delay(), loginParent(), loginStaff(), loginStudent(), registerStudent(), AuthContext, AuthProvider(), useAuth() (+13 more)

### Community 7 - "Analytics & Performance Entities"
Cohesion: 0.11
Nodes (19): AllArgsConstructor, Builder, Double, Entity, EntityListeners, Getter, Integer, LocalDateTime (+11 more)

### Community 8 - "Brand & Design System"
Cohesion: 0.09
Nodes (26): Accessibility AA Compliance Principle, Brand Colour Palette (Onyx, Crimson, Off-White, Steel), CodeSync Systems Design System, EduSync / CodeSync Brand Identity, Motion Design Principle (Fast & Decisive, 150-300ms), Brand Voice Principle (Precise, Local, Reliable), Admin Dashboard Design Health Critique (2026-06-21), Design Health Score 23/40 (+18 more)

### Community 9 - "Frontend Dependencies"
Cohesion: 0.08
Nodes (25): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, eslint (+17 more)

### Community 10 - "Staff & Campus Entities"
Cohesion: 0.13
Nodes (17): AllArgsConstructor, Builder, Entity, Getter, LocalDate, Long, NoArgsConstructor, Setter (+9 more)

### Community 11 - "Full-Stack Architecture Docs"
Cohesion: 0.10
Nodes (22): Frontend Entry Point (index.html → /src/main.jsx), React + Vite Frontend Project (HMR + ESLint), API Endpoint Map (/api/v1/auth, /dashboard, /students, /staff, /fees, /academics, /events, /analytics), Audit Logging (@CreatedBy/@LastModifiedBy + audit_log table), Backend Build Order (Config → Flyway → Entities → Security → Auth → Dashboard → Controllers), Backend Domain Entities (User, Student, Staff, ClassRoom, AttendanceRecord, FeeRecord, etc.), JWT Stateless Auth (15-min Access Token + 7-day HttpOnly Refresh Cookie), PDPA Compliance (Malaysia Personal Data Protection Act 2010) (+14 more)

### Community 12 - "Student & User Entities"
Cohesion: 0.15
Nodes (15): AllArgsConstructor, Builder, Entity, Getter, LocalDate, Long, NoArgsConstructor, Setter (+7 more)

### Community 13 - "Notification & Event Entities"
Cohesion: 0.13
Nodes (16): AllArgsConstructor, Builder, Entity, EntityListeners, Getter, LocalDateTime, Long, NoArgsConstructor (+8 more)

### Community 14 - "Error Handling & Responses"
Cohesion: 0.22
Nodes (11): AuthorizationDeniedException, String, ResponseEntity, BadCredentialsException, ErrorResponse, EntityNotFoundException, Exception, GlobalExceptionHandler (+3 more)

### Community 15 - "Payment Record Entities"
Cohesion: 0.13
Nodes (15): AllArgsConstructor, BigDecimal, Builder, Entity, Getter, Long, NoArgsConstructor, Setter (+7 more)

### Community 16 - "ClassRoom & Enrollment Entities"
Cohesion: 0.14
Nodes (15): AllArgsConstructor, Builder, Entity, Getter, LocalDate, Long, NoArgsConstructor, Setter (+7 more)

### Community 17 - "Spring Security Config"
Cohesion: 0.24
Nodes (11): AuthenticationConfiguration, AuthenticationManager, PasswordEncoder, Bean, SecurityConfig, Configuration, CorsConfigurationSource, EnableMethodSecurity (+3 more)

### Community 18 - "Grade & Assessment Entities"
Cohesion: 0.15
Nodes (13): AllArgsConstructor, Builder, Entity, EntityListeners, Getter, Integer, LocalDateTime, Long (+5 more)

### Community 19 - "Performance Metrics Entities"
Cohesion: 0.15
Nodes (13): AllArgsConstructor, Builder, Double, Entity, EntityListeners, Getter, LocalDateTime, Long (+5 more)

### Community 20 - "Configuration & Settings Entities"
Cohesion: 0.17
Nodes (11): AllArgsConstructor, Builder, Entity, Getter, Integer, Long, NoArgsConstructor, Setter (+3 more)

### Community 21 - "Brand Visual Assets"
Cohesion: 0.29
Nodes (11): Brand Color - Accent Blue (#47bfff), Brand Color - Primary Purple (#863bff), EduSync Favicon Logo (Lightning Bolt / Spark Icon), Bluesky Social Media Icon, Brand Color - Icon Accent Purple (#aa3bff), Discord Social Media Icon, Documentation Icon (Code/Book Symbol), GitHub Icon (+3 more)

### Community 22 - "Spring Boot Entry Point"
Cohesion: 0.43
Nodes (5): String, DemoApplication, EnableConfigurationProperties, EnableJpaAuditing, SpringBootApplication

### Community 23 - "JPA Repository Layer"
Cohesion: 0.38
Nodes (5): Long, Long, JpaRepository, CampusRepository, StaffRepository

### Community 24 - "ClassRoom Repository"
Cohesion: 0.40
Nodes (4): Integer, List, Long, ClassRoomRepository

### Community 25 - "Unit Tests"
Cohesion: 0.60
Nodes (3): DemoApplicationTests, SpringBootTest, Test

## Knowledge Gaps
- **59 isolated node(s):** `com.example:demo`, `name`, `private`, `version`, `type` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UserRepository` connect `Attendance & Scheduling Entities` to `Academic & Student REST API`, `JPA Repository Layer`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `Student` connect `Analytics & Performance Entities` to `Finance & Fees REST API`, `Staff & Campus Entities`, `Fee & Financial Entities`, `Payment Record Entities`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Subject` connect `Fee & Financial Entities` to `Academic & Student REST API`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `com.example:demo`, `name`, `private` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Service Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.06169772256728778 - nodes in this community are weakly interconnected._
- **Should `Finance & Fees REST API` be split into smaller, more focused modules?**
  _Cohesion score 0.07294117647058823 - nodes in this community are weakly interconnected._
- **Should `Academic & Student REST API` be split into smaller, more focused modules?**
  _Cohesion score 0.07738095238095238 - nodes in this community are weakly interconnected._