package com.edusync.service;

import com.edusync.dto.request.AttendanceSubmitRequest;
import com.edusync.dto.response.AttendancePageResponse;
import com.edusync.dto.response.AttendanceRecordResponse;
import com.edusync.entity.AttendanceRecord;
import com.edusync.entity.AttendanceStatus;
import com.edusync.entity.Student;
import com.edusync.exception.DuplicateResourceException;
import com.edusync.exception.ResourceNotFoundException;
import com.edusync.repository.AttendanceRecordRepository;
import com.edusync.repository.StudentRepository;
import com.edusync.util.DisplayMapper;
import com.edusync.util.Months;
import com.edusync.util.Numbers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Attendance reporting (today / week / month / per-form) and roll-call submission. */
@Service
@Transactional(readOnly = true)
public class AttendanceService {

    private static final DateTimeFormatter TODAY_FMT = DateTimeFormatter.ofPattern("EEE, d MMM yyyy");

    private final AttendanceRecordRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final AuditService auditService;

    public AttendanceService(AttendanceRecordRepository attendanceRepository,
                             StudentRepository studentRepository,
                             AuditService auditService) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.auditService = auditService;
    }

    /** Full page aggregate. */
    public AttendancePageResponse getPage() {
        return new AttendancePageResponse(
                getToday(),
                getWeekTrend(),
                getByForm(LocalDate.now()),
                getAbsentToday(),
                getMonthly());
    }

    /** Today's headline numbers. */
    public AttendancePageResponse.Today getToday() {
        LocalDate today = LocalDate.now();
        long present = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.PRESENT);
        long absent = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.ABSENT);
        long late = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.LATE);
        long total = attendanceRepository.countByDate(today);
        double rate = Numbers.pct(present, total);
        return new AttendancePageResponse.Today(today.format(TODAY_FMT), rate, present, absent, late);
    }

    /** Mon–Fri attendance rate for the current week. */
    public List<AttendancePageResponse.DayRate> getWeekTrend() {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        List<AttendancePageResponse.DayRate> days = new ArrayList<>();
        for (int i = 0; i <= 4; i++) {
            LocalDate day = monday.plusDays(i);
            long present = attendanceRepository.countByDateAndStatus(day, AttendanceStatus.PRESENT);
            long total = attendanceRepository.countByDate(day);
            double rate = Numbers.pct(present, total);
            days.add(new AttendancePageResponse.DayRate(
                    day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    String.valueOf(day.getDayOfMonth()),
                    rate));
        }
        return days;
    }

    /** Attendance rate per month for the trailing 6 months. */
    public List<AttendancePageResponse.MonthRate> getMonthly() {
        return Months.trailing(6).stream()
                .map(m -> {
                    long present = attendanceRepository.countByDateBetweenAndStatus(
                            m.start(), m.end(), AttendanceStatus.PRESENT);
                    long total = attendanceRepository.countByDateBetween(m.start(), m.end());
                    return new AttendancePageResponse.MonthRate(m.label(), Numbers.pct(present, total));
                })
                .toList();
    }

    /** Per-form present/total/rate for a given day. */
    public List<AttendancePageResponse.FormAttendance> getByForm(LocalDate date) {
        // form -> [present, total]
        Map<Integer, long[]> byForm = new LinkedHashMap<>();
        for (Object[] row : attendanceRepository.countByFormAndStatusOnDate(date)) {
            Integer form = (Integer) row[0];
            AttendanceStatus status = (AttendanceStatus) row[1];
            long count = (Long) row[2];
            long[] agg = byForm.computeIfAbsent(form, k -> new long[2]);
            agg[1] += count;
            if (status == AttendanceStatus.PRESENT) agg[0] += count;
        }
        return byForm.entrySet().stream()
                .sorted((a, b) -> Integer.compare(
                        b.getKey() == null ? -1 : b.getKey(),
                        a.getKey() == null ? -1 : a.getKey()))
                .map(e -> {
                    long present = e.getValue()[0];
                    long total = e.getValue()[1];
                    double rate = Numbers.pct(present, total);
                    return new AttendancePageResponse.FormAttendance(
                            DisplayMapper.formLabel(e.getKey()), present, total, rate);
                })
                .toList();
    }

    /** Students absent today, with a 7-day recent-absence count as the streak. */
    public List<AttendancePageResponse.AbsentStudent> getAbsentToday() {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);
        return attendanceRepository.findByDateAndStatus(today, AttendanceStatus.ABSENT).stream()
                .map(AttendanceRecord::getStudent)
                .map(s -> new AttendancePageResponse.AbsentStudent(
                        DisplayMapper.initials(s.getName()),
                        s.getName(),
                        s.getClassName(),
                        attendanceRepository.countByStudentIdAndStatusAndDateBetween(
                                s.getId(), AttendanceStatus.ABSENT, weekAgo, today)))
                .toList();
    }

    /** Persist a single roll-call entry. Rejects a second record for the same student/day. */
    @Transactional
    public AttendanceRecordResponse submit(AttendanceSubmitRequest req) {
        Student student = studentRepository.findByIdAndDeletedAtIsNull(req.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", req.studentId()));

        if (attendanceRepository.existsByStudentIdAndDate(req.studentId(), req.date())) {
            throw new DuplicateResourceException(
                    "Attendance already recorded for student " + req.studentId() + " on " + req.date());
        }

        AttendanceRecord record = AttendanceRecord.builder()
                .student(student)
                .date(req.date())
                .status(req.status())
                .build();
        AttendanceRecord saved = attendanceRepository.save(record);
        auditService.record("AttendanceRecord", saved.getId(), "CREATE",
                "studentId=" + student.getId() + ", date=" + saved.getDate() + ", status=" + saved.getStatus());

        return new AttendanceRecordResponse(
                saved.getId(), student.getId(), student.getName(), saved.getDate(), saved.getStatus().name());
    }
}
