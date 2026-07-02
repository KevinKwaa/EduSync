package com.edusync.service;

import com.edusync.dto.response.PeopleResponse;
import com.edusync.entity.AuditLog;
import com.edusync.entity.Role;
import com.edusync.entity.User;
import com.edusync.repository.AuditLogRepository;
import com.edusync.repository.StaffRepository;
import com.edusync.repository.UserRepository;
import com.edusync.repository.StudentRepository;
import com.edusync.util.DisplayMapper;
import com.edusync.util.Numbers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Cross-role people overview. Headcount comes from the domain repositories,
 * recent activity from the audit log, and the watchlist reuses the at-risk
 * student logic plus on-leave staff.
 */
@Service
@Transactional(readOnly = true)
public class PeopleService {

    private static final int MAX_WATCH_STUDENTS = 3;
    private static final int MAX_WATCH_STAFF = 2;

    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final StudentService studentService;

    public PeopleService(StudentRepository studentRepository,
                         StaffRepository staffRepository,
                         UserRepository userRepository,
                         AuditLogRepository auditLogRepository,
                         StudentService studentService) {
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.studentService = studentService;
    }

    public PeopleResponse getPeople() {
        long students = studentRepository.countByDeletedAtIsNull();
        long staff = staffRepository.count();
        long admins = userRepository.count();
        long total = students + staff + admins;

        List<PeopleResponse.Segment> segments = List.of(
                new PeopleResponse.Segment("Students", students, Numbers.pct(students, total)),
                new PeopleResponse.Segment("Teaching Staff", staff, Numbers.pct(staff, total)),
                new PeopleResponse.Segment("Admin & Leadership", admins, Numbers.pct(admins, total)));

        return new PeopleResponse(total, segments, recentActivity(), watchlist());
    }

    // --- recent activity (from the audit log) --------------------------------

    private List<PeopleResponse.Activity> recentActivity() {
        Map<String, User> usersByEmail = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getEmail, Function.identity(), (a, b) -> a));

        return auditLogRepository.findTop8ByOrderByChangedAtDesc().stream()
                .map(log -> {
                    User actor = usersByEmail.get(log.getPerformedBy());
                    String name = actor != null ? actor.getName()
                            : (log.getPerformedBy() != null ? log.getPerformedBy() : "System");
                    String role = actor != null ? roleLabel(actor.getRole()) : "";
                    return new PeopleResponse.Activity(
                            DisplayMapper.initials(name), name, role, actionText(log),
                            DisplayMapper.relativeTime(log.getChangedAt()));
                })
                .toList();
    }

    private static String actionText(AuditLog log) {
        String verb = switch (log.getAction() == null ? "" : log.getAction()) {
            case "CREATE" -> "Created";
            case "UPDATE" -> "Updated";
            case "DELETE" -> "Deleted";
            default -> log.getAction();
        };
        String subject = log.getEntityType() == null ? "record" : log.getEntityType();
        String id = log.getEntityId() != null ? " #" + log.getEntityId() : "";
        return verb + " " + subject + id;
    }

    // --- watchlist -----------------------------------------------------------

    private List<PeopleResponse.WatchItem> watchlist() {
        List<PeopleResponse.WatchItem> watch = new ArrayList<>();

        studentService.getAtRisk().students().stream().limit(MAX_WATCH_STUDENTS).forEach(s ->
                watch.add(new PeopleResponse.WatchItem(
                        s.initials(), s.name(), "Student", s.reason(), s.level().toLowerCase())));

        staffRepository.findAll().stream()
                .filter(st -> st.getLeaveStatus() != null && st.getLeaveStatus().toLowerCase().contains("leave"))
                .limit(MAX_WATCH_STAFF)
                .forEach(st -> watch.add(new PeopleResponse.WatchItem(
                        DisplayMapper.initials(st.getName()), st.getName(), "Teacher", "On leave", "medium")));

        return watch;
    }

    // --- helpers -------------------------------------------------------------

    private static String roleLabel(Role role) {
        if (role == null) return "";
        return switch (role) {
            case PRINCIPAL -> "Principal";
            case HOD -> "HOD";
            case TEACHER -> "Teacher";
            case ADMIN -> "Admin";
        };
    }
}
