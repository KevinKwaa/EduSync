# Spring Boot — Personal Reference Guide
> How it works, mapped to EduSync code

---

## 1. The Big Picture

Spring Boot is a framework that lets you build a backend API without configuring almost anything manually. You write classes with annotations, and Spring wires everything together at startup.

**Request lifecycle:**
```
HTTP Request
  → JwtAuthFilter (security check, inject user identity)
  → DispatcherServlet (Spring's front controller)
  → AuthController / DashboardController (your @RestController)
  → AuthService / DashboardService (your @Service — business logic)
  → UserRepository / StudentRepository (your @Repository — DB queries)
  → PostgreSQL
  → Response flows back up
```

Every layer is just a class. Spring manages instantiation — you never write `new AuthService()`.

---

## 2. Key Annotations (Plain English)

### Application Level
| Annotation | What it does |
|---|---|
| `@SpringBootApplication` | Marks the entry point. Tells Spring to scan all classes in the same package and below for components. |
| `@EnableJpaAuditing` | Enables automatic `createdAt`/`updatedAt` timestamps on entities. |

### Controller
| Annotation | What it does |
|---|---|
| `@RestController` | Marks a class as a REST endpoint handler. Automatically serialises return values to JSON. |
| `@RequestMapping("/api/v1/auth")` | Base URL prefix for all methods in the class. |
| `@GetMapping("/summary")` | Maps HTTP GET `/api/v1/dashboard/summary` to this method. Same pattern: `@PostMapping`, `@PutMapping`, `@DeleteMapping`. |
| `@RequestBody` | Deserialise the request JSON body into a Java object. |
| `@PathVariable` | Extract `{id}` from the URL path. |
| `@RequestParam` | Extract `?form=5` query params. |
| `@Valid` | Run validation annotations (e.g. `@NotBlank`) on the object. Returns 400 automatically if invalid. |

### Service & Repository
| Annotation | What it does |
|---|---|
| `@Service` | Marks a class as a business logic component. Spring manages its lifecycle. |
| `@Repository` | Marks a class as a DB component. Usually you just extend `JpaRepository` — no annotation needed. |
| `@Transactional` | Wraps the method in a DB transaction. Rolls back on exception. |

### Dependency Injection
| Annotation | What it does |
|---|---|
| `@Autowired` | Inject a dependency (constructor injection is preferred — see EduSync code). |
| `@Component` | Generic Spring-managed bean. |
| `@Bean` | Defines a method that returns an object Spring should manage (used in `@Configuration` classes). |
| `@Configuration` | Marks a class as a source of `@Bean` definitions. |

### Security
| Annotation | What it does |
|---|---|
| `@EnableWebSecurity` | Activates Spring Security config. |
| `@EnableMethodSecurity` | Enables `@PreAuthorize` on controller methods. |
| `@PreAuthorize("hasRole('PRINCIPAL')")` | Block the method if the logged-in user doesn't have that role. |

### JPA / Entities
| Annotation | What it does |
|---|---|
| `@Entity` | Marks a class as a DB table. |
| `@Table(name = "students")` | Explicit table name (default: class name snake_cased). |
| `@Id` | Primary key field. |
| `@GeneratedValue(strategy = IDENTITY)` | Auto-increment in PostgreSQL (maps to `BIGSERIAL`). |
| `@Column(unique = true)` | Unique constraint. `nullable = false` → NOT NULL. |
| `@Enumerated(EnumType.STRING)` | Store enum as its name string, not ordinal number. |
| `@ManyToOne` | Foreign key relationship. "Many students → one classroom." |
| `@JoinColumn(name = "student_id")` | The FK column name in the DB. |
| `@CreatedDate` / `@LastModifiedDate` | Auto-populated by `@EnableJpaAuditing`. |

---

## 3. Dependency Injection — How It Works

You never instantiate services manually. Spring builds a "container" of objects (called beans) and injects them where needed.

```java
// BAD — manual, Spring can't manage it
AuthService authService = new AuthService(new UserRepository(), ...);

// GOOD — constructor injection (EduSync style)
@Service
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {  // Spring injects this
        this.authService = authService;
    }
}
```

Why constructor injection? Easier to test (you can pass mocks), fields are final (immutable after construction).

---

## 4. Spring Data JPA — How DB Queries Work

You define an interface extending `JpaRepository<Entity, ID>`. Spring generates SQL at runtime from the method name.

```java
// Spring reads the method name and writes the SQL for you
List<Student> findByFormAndDeletedAtIsNull(Integer form);
// → SELECT * FROM students WHERE form = ? AND deleted_at IS NULL

long countByStatusAndDeletedAtIsNull(StudentStatus status);
// → SELECT COUNT(*) FROM students WHERE status = ? AND deleted_at IS NULL
```

**Method name keywords:** `findBy`, `countBy`, `deleteBy` + field names + `And`/`Or` + conditions like `IsNull`, `IsNotNull`, `Between`, `OrderBy`.

**Custom JPQL query:**
```java
@Query("SELECT SUM(f.amount) FROM FeeRecord f WHERE f.status = 'PAID'")
BigDecimal sumCollected();
```

JPQL operates on entity class names and field names (not table/column names).

---

## 5. Spring Security Flow in EduSync

```
POST /api/v1/auth/login
  → AuthController.login()
  → AuthService.login()
     → load user from DB by email
     → compare password with BCrypt hash
     → generate JWT access token (15 min)
     → set refresh token in HttpOnly cookie (7 days)
  → return { accessToken, role, name }

GET /api/v1/dashboard/kpis  (needs token)
  → JwtAuthFilter runs first
     → extract "Bearer <token>" from Authorization header
     → validate JWT signature + expiry
     → load user from DB, set Spring Security context
  → DashboardController.kpis()
     → Spring checks @PreAuthorize("isAuthenticated()")
     → calls DashboardService.getKpis()
```

**Why HttpOnly cookie for refresh token?**
JavaScript can't read it — XSS attacks can't steal it. The access token lives in JS memory (not localStorage).

---

## 6. application.properties vs application-local.properties

| File | Committed? | Purpose |
|---|---|---|
| `application.properties` | Yes | Production config, uses `${ENV_VAR}` placeholders |
| `application-local.properties` | **No (gitignored)** | Your local dev values — DB password, JWT secret |

To activate local profile, run with:
```
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```
Or set env var. Spring merges both files, local values override.

---

## 7. Flyway — DB Migrations

Never use `ddl-auto=create` in production — it drops and recreates tables on startup.

Flyway runs SQL files in order on startup:
```
src/main/resources/db/migration/
  V1__init.sql        ← runs first (creates all tables)
  V2__add_column.sql  ← runs second (when you add it later)
  V3__...
```

**Rules:**
- Filename format: `V{number}__{description}.sql`
- Never edit a migration that has already run — add a new one
- Flyway tracks what ran in the `flyway_schema_history` table

---

## 8. Lombok — Less Boilerplate

Lombok generates code at compile time from annotations:

```java
@Getter @Setter          // generates getters/setters for all fields
@Builder                 // generates Student.builder().name("Ali").form(5).build()
@NoArgsConstructor       // generates Student()
@AllArgsConstructor      // generates Student(id, name, form, ...)
```

Why not `@Data`? It generates `equals`/`hashCode` based on all fields, which causes infinite loops with JPA lazy-loaded relationships. `@Getter @Setter` is safer for entities.

---

## 9. Records (Java 21)

EduSync uses Java records for DTOs — immutable data carriers, no boilerplate:

```java
// This replaces ~40 lines of class + getters + constructor
public record LoginRequest(
    @NotBlank @Email String email,
    @NotBlank String password
) {}

// Usage
String email = request.email();   // accessor, not getEmail()
```

Records can't be JPA entities (they're immutable, Hibernate needs no-arg constructors). Use them for DTOs only.

---

## 10. How to Run

**Prerequisites:**
1. Java 21 installed
2. PostgreSQL 18 running at `localhost:5432`
3. Create DB: `CREATE DATABASE edusync;`
4. Fill in `application-local.properties` with your actual DB password + JWT secret

**Start:**
```bash
cd backend
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

Flyway runs `V1__init.sql` on first startup — all tables created automatically.

**Test auth:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edusync.my","password":"Admin@123"}'
```

Returns `{ accessToken, tokenType, role, name }`.

**Test dashboard (with token):**
```bash
curl http://localhost:8080/api/v1/dashboard/kpis \
  -H "Authorization: Bearer <accessToken>"
```

---

## 11. EduSync Package Structure

```
com./
  DemoApplication.java         ← entry point, @SpringBootApplication
  entity/                      ← JPA entities + enums (DB table classes)
  repository/                  ← JpaRepository interfaces (DB queries)
  service/                     ← business logic (@Service)
  controller/                  ← REST endpoints (@RestController)
  dto/                         ← request/response shapes (records)
  security/                    ← JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
  config/                      ← SecurityConfig, JwtProperties
  exception/                   ← GlobalExceptionHandler
```

---

## 12. Common Error Messages Decoded

| Error | Cause | Fix |
|---|---|---|
| `Failed to configure DataSource` | No DB connection config | Fill `application-local.properties` |
| `FlywayException: Validate failed` | Entity fields don't match SQL schema | Add new migration file |
| `No qualifying bean of type ...` | Spring can't find a component | Check `@Service`/`@Component` annotation |
| `401 Unauthorized` | Missing/invalid JWT | Login first, pass `Authorization: Bearer <token>` |
| `403 Forbidden` | Authenticated but wrong role | Check `@PreAuthorize` on the endpoint |
| `LazyInitializationException` | Accessed lazy relation outside transaction | Add `@Transactional` to service method or use `FetchType.EAGER` |
