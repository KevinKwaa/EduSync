package com.edusync.service;

import com.edusync.dto.response.AtRiskResponse;
import com.edusync.dto.response.StudentRosterResponse;
import com.edusync.dto.response.StudentSummary;
import com.edusync.entity.AttendanceStatus;
import com.edusync.entity.Student;
import com.edusync.entity.StudentStatus;
import com.edusync.exception.ResourceNotFoundException;
import com.edusync.repository.AttendanceRecordRepository;
import com.edusync.repository.StudentRepository;
import com.edusync.util.DisplayMapper;
import com.edusync.util.Numbers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Read-side business logic for the student roster, at-risk widget and detail view.
 * Soft-deleted students (deletedAt set) are excluded everywhere.
 */
@Service
@Transactional(readOnly = true)
public class StudentService {

    /** Students enrolled within this window count as "new this term". */
    private static final int NEW_THIS_TERM_DAYS = 120;

    private final StudentRepository studentRepository;
    private final AttendanceRecordRepository attendanceRepository;

    public StudentService(StudentRepository studentRepository,
                          AttendanceRecordRepository attendanceRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    /** Roster with optional {@code form} (1-6) and {@code status} (display band) filters. */
    public StudentRosterResponse getRoster(Integer form, String status) {
        List<StudentSummary> rows = studentRepository.findByDeletedAtIsNull().stream()
                .map(this::toSummary)
                .filter(s -> form == null || s.form().equals(DisplayMapper.formLabel(form)))
                .filter(s -> status == null || s.status().equalsIgnoreCase(status))
                .toList();

        long total = studentRepository.countByDeletedAtIsNull();
        long atRisk = studentRepository.countByStatusAndDeletedAtIsNull(StudentStatus.AT_RISK);
        long absentToday = attendanceRepository.countByDateAndStatus(LocalDate.now(), AttendanceStatus.ABSENT);
        long honourRoll = studentRepository.countByAvgScoreGreaterThanEqualAndDeletedAtIsNull(85.0);
        long newThisTerm = studentRepository.countByCreatedAtAfterAndDeletedAtIsNull(
                LocalDateTime.now().minusDays(NEW_THIS_TERM_DAYS));

        var stats = new StudentRosterResponse.RosterStats(atRisk, absentToday, honourRoll, newThisTerm);
        return new StudentRosterResponse(total, stats, rows);
    }

    /** Students flagged AT_RISK, with a derived reason and severity level. */
    public AtRiskResponse getAtRisk() {
        List<AtRiskResponse.AtRiskStudent> flagged = studentRepository
                .findByStatusAndDeletedAtIsNull(StudentStatus.AT_RISK).stream()
                .map(this::toAtRisk)
                .toList();
        return new AtRiskResponse(flagged.size(), flagged);
    }

    /** Single student by id; 404 if missing or soft-deleted. */
    public StudentSummary getById(Long id) {
        Student student = studentRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
        return toSummary(student);
    }

    // --- mappers -------------------------------------------------------------

    private StudentSummary toSummary(Student s) {
        return new StudentSummary(
                s.getId(),
                DisplayMapper.initials(s.getName()),
                s.getName(),
                DisplayMapper.formLabel(s.getForm()),
                s.getClassName(),
                Numbers.roundToInt(s.getAttendancePct()),
                Numbers.roundToInt(s.getAvgScore()),
                DisplayMapper.studentDisplayStatus(s.getStatus(), s.getAvgScore())
        );
    }

    private AtRiskResponse.AtRiskStudent toAtRisk(Student s) {
        double attendance = s.getAttendancePct() == null ? 100 : s.getAttendancePct();
        double score = s.getAvgScore() == null ? 100 : s.getAvgScore();

        String reason;
        if (attendance < 75) {
            reason = "Attendance " + Numbers.roundToInt(attendance) + "%";
        } else if (score < 50) {
            reason = "Score stalled at " + Numbers.roundToInt(score) + "%";
        } else {
            reason = "Flagged for review";
        }
        String level = (attendance < 70 || score < 45) ? "HIGH" : "MEDIUM";

        return new AtRiskResponse.AtRiskStudent(
                s.getId(),
                DisplayMapper.initials(s.getName()),
                s.getName(),
                s.getClassName(),
                reason,
                level
        );
    }
}
