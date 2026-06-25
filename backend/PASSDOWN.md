# EduSync Backend — Senior SWE Passdown

## 1. System Context

**Product:** EduSync — administrative LMS for Malaysian secondary schools (SMK level)
**Primary users:** School principals and senior admins
**Stack:**
- Backend: Spring Boot 4.1.0, Java 21, Spring Security, Spring Data JPA, Lombok, PostgreSQL 18
- Frontend: React + Vite (currently all data mocked — first job is replacing those mocks)

**Current state of backend:** Skeleton only. `DemoApplication.java` exists, zero controllers/entities/repositories. `application.properties` has only `spring.application.name=demo`.

---

## 2. API Design Decision: REST, Not GraphQL

**Use REST.**

GraphQL is the wrong tool here.

| Factor | Verdict |
|--------|---------|
| Client type | Single frontend (not multiple consumers) |
| Data shape | Flat dashboard aggregates, not a deep object graph |
| Security surface | REST is easier to rate-limit and audit per endpoint |
| Team expertise | Spring Boot REST is the obvious path |
| Over-fetching concern | Low — each page has a clear, bounded data need |

GraphQL adds schema overhead, N+1 problem risk, and a harder security story (you can't rate-limit a single `/graphql` POST cleanly). Keep REST.

**Versioning:** Prefix all routes `/api/v1/...` from day one. Changing this later is painful.

---

## 3. Domain Entities to Build

| Entity | Key fields |
|--------|-----------|
| `User` | id, name, email, role (PRINCIPAL / HOD / TEACHER / ADMIN), passwordHash |
| `Student` | id, name, form, className, attendancePct, avgScore, status |
| `Staff` | id, name, role, subjects, workloadHours, leaveStatus |
| `ClassRoom` | id, name, form, homeTeacherId, size |
| `Subject` | id, name, formApplicability |
| `AttendanceRecord` | id, studentId, date, status (PRESENT / ABSENT / LATE) |
| `ExamResult` | id, studentId, subjectId, score, examType, date |
| `FeeRecord` | id, studentId, amount, status (PAID / OUTSTANDING / OVERDUE), dueDate |
| `Bursary` | id, studentId, type, amount, status |
| `Notice` | id, authorId, title, body, audience, status (DRAFT / PUBLISHED / ARCHIVED), publishedAt |
| `Event` | id, title, date, location, type |
| `LeaveRequest` | id, staffId, type, startDate, endDate, status (PENDING / APPROVED / REJECTED) |
| `Campus` | id, name, studentCount, classroomCount, operationalStatus |

---

## 4. API Endpoint Map

```
# Auth
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh

# Dashboard (aggregated — heavy computed endpoints)
GET    /api/v1/dashboard/summary          # greeting, term context
GET    /api/v1/dashboard/kpis             # 4 KPI cards
GET    /api/v1/dashboard/attendance/week  # Mon–Fri bar chart
GET    /api/v1/dashboard/fees/collection  # collected vs target
GET    /api/v1/dashboard/subjects/performance

# Students
GET    /api/v1/students                   # roster with filters: ?form=5&status=at-risk
GET    /api/v1/students/at-risk           # dashboard widget shortcut
GET    /api/v1/students/{id}

# Staff
GET    /api/v1/staff
GET    /api/v1/staff/{id}
GET    /api/v1/staff/leave/pending

# Attendance
GET    /api/v1/attendance/today
GET    /api/v1/attendance/weekly
GET    /api/v1/attendance/monthly
POST   /api/v1/attendance                 # teacher submits roll call

# Fees
GET    /api/v1/fees/summary
GET    /api/v1/fees/by-form
GET    /api/v1/fees/overdue
GET    /api/v1/fees/bursaries

# Academics
GET    /api/v1/academics/subjects
GET    /api/v1/academics/interventions
GET    /api/v1/exams                      # upcoming, marking, results

# Notices
GET    /api/v1/notices                    # ?status=published|draft|archive
POST   /api/v1/notices
PUT    /api/v1/notices/{id}
DELETE /api/v1/notices/{id}

# Events / Calendar
GET    /api/v1/events?year=2026&month=6
POST   /api/v1/events
PUT    /api/v1/events/{id}
DELETE /api/v1/events/{id}

# Analytics
GET    /api/v1/analytics/signals
GET    /api/v1/analytics/monthly
GET    /api/v1/analytics/movers

# Campus
GET    /api/v1/campus
```

---

## 5. Security Practices — Non-Negotiable

### 5.1 Authentication: JWT (not session cookies)

Use stateless JWT. Spring Security already in pom.xml — wire it up:

```
Access token:  15-minute expiry
Refresh token: 7-day expiry, stored in HttpOnly cookie (not localStorage)
```

Never store access tokens in localStorage. XSS can steal them. Use `HttpOnly` + `SameSite=Strict` for refresh tokens.

Add `io.jsonwebtoken:jjwt-api` to pom.xml.

### 5.2 Role-Based Access Control (RBAC)

Four roles minimum:

| Role | Access |
|------|--------|
| `PRINCIPAL` | Full read + write on everything |
| `HOD` | Read all; write own-department data only |
| `TEACHER` | Read own classes; write attendance for own classes |
| `ADMIN` | Read all; write fees, notices, events |

Use Spring Security `@PreAuthorize("hasRole('PRINCIPAL')")` at the controller/service layer. Never enforce roles only in the frontend.

### 5.3 Rate Limiting

Add **Bucket4j** (`com.bucket4j:bucket4j-core`) with Spring:

```
/api/v1/auth/login   → 5 requests / 15 min per IP  (brute-force guard)
/api/v1/**           → 200 requests / min per authenticated user
/api/v1/dashboard/** → cache + rate limit together (these are expensive aggregates)
```

Without this, any device on the school network that goes haywire hammers PostgreSQL.

### 5.4 Input Validation

Already have `spring-boot-starter-validation` — use it:

```java
// On every request DTO:
@NotBlank
@Size(max = 255)
@Email
```

Validate at the controller boundary with `@Valid`. Return `400` with field-level error messages.

### 5.5 CORS

Restrict to your frontend origin. In `SecurityConfig`:

```java
config.setAllowedOrigins(List.of("https://edusync.yourdomain.my"));
config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
config.setAllowCredentials(true);  // required for HttpOnly cookie refresh token
```

During dev, restrict to `http://localhost:5173`. Never use `*` in production.

### 5.6 SQL Injection Prevention

Spring Data JPA with parameterized queries handles this automatically. Rules:
- Never concatenate strings into JPQL/HQL
- If you write native queries, use `@Query(nativeQuery=true)` with `:param` named parameters only
- No `EntityManager.createNativeQuery("SELECT ... WHERE id = " + id)`

### 5.7 PDPA Compliance (Malaysia — Personal Data Protection Act 2010)

Student and staff data is regulated. Mandatory:

- Log every access to PII (student names, ICs, contact details, academic records)
- Don't expose IC numbers (MyKad) in API responses unless strictly required
- Implement soft-delete — don't hard-delete student records
- Encrypt PII columns at rest for IC numbers and contact details (PostgreSQL `pgcrypto` extension or column-level encryption)
- API responses for `/students` must not return IC/NRIC unless the endpoint is explicitly for identity verification

### 5.8 Security Headers

Add these in Spring Security config (or via a `OncePerRequestFilter`):

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
Referrer-Policy: no-referrer
```

Spring Security adds some by default — verify they're on with a security header checker before going live.

### 5.9 HTTPS Only

TLS 1.2 minimum. TLS 1.3 preferred. Terminate SSL at the load balancer/reverse proxy (Nginx), not in Spring Boot. Redirect all HTTP → HTTPS at Nginx level.

### 5.10 Secrets Management

Never commit credentials. Replace `application.properties` with:

```properties
# application.properties (committed — safe values only)
spring.application.name=edusync

# application-local.properties (gitignored)
spring.datasource.url=...
spring.datasource.username=...
spring.datasource.password=...
jwt.secret=...
```

In production, use environment variables injected by your deployment platform. Add `application-local.properties` to `.gitignore` immediately.

### 5.11 Audit Logging

Every mutating operation (create, update, delete) on student/fee/notice data must log: who did it, what changed, when. Use Spring Data's `@CreatedBy` / `@LastModifiedBy` + `AuditorAware`. Store in a separate `audit_log` table.

### 5.12 Error Responses

Never expose stack traces or internal messages to the client. Use a global `@ControllerAdvice` exception handler. All errors return:

```json
{
  "error": "VALIDATION_FAILED",
  "message": "Fee amount must be positive",
  "timestamp": "2026-06-25T08:00:00Z"
}
```

---

## 6. application.properties — What to Fill In

```properties
spring.application.name=edusync

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=validate   # use Flyway for migrations, not auto DDL
spring.jpa.show-sql=false                # true in dev only
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.secret=${JWT_SECRET}
jwt.access-token-expiry=900              # 15 min in seconds
jwt.refresh-token-expiry=604800          # 7 days

server.port=8080
```

**Add Flyway** for DB migrations. Never use `ddl-auto=create` or `update` in production — it silently destroys your schema.

---

## 7. Additional Dependencies to Add to pom.xml

```xml
<!-- JWT -->
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.12.6</version>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-impl</artifactId>
  <version>0.12.6</version>
  <scope>runtime</scope>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-jackson</artifactId>
  <version>0.12.6</version>
  <scope>runtime</scope>
</dependency>

<!-- Rate limiting -->
<dependency>
  <groupId>com.bucket4j</groupId>
  <artifactId>bucket4j-core</artifactId>
  <version>8.10.1</version>
</dependency>

<!-- DB migrations -->
<dependency>
  <groupId>org.flywaydb</groupId>
  <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
  <groupId>org.flywaydb</groupId>
  <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

---

## 8. Build Order

1. `application.properties` config + environment variable wiring
2. Flyway migration: create all tables (`src/main/resources/db/migration/V1__init.sql`)
3. JPA entities + repositories
4. Spring Security config (JWT filter, RBAC, CORS, headers)
5. Auth endpoints (`/auth/login`, `/auth/refresh`, `/auth/logout`)
6. Service layer per domain — **start with Dashboard**, it unblocks the frontend immediately
7. Controllers per domain
8. Rate limiting filter
9. Global `@ControllerAdvice` exception handler
10. Audit logging

Frontend can swap mocks for real endpoints as each domain is done. Start with Dashboard KPIs and Attendance — those are on the landing screen and validate the full auth → API → DB pipeline.
