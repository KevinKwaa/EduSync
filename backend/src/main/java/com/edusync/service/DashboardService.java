package com.edusync.service;

import com.edusync.dto.response.AttendanceWeekDto;
import com.edusync.dto.response.DashboardSummaryDto;
import com.edusync.dto.response.FeeCollectionDto;
import com.edusync.dto.response.KpiDto;
import com.edusync.dto.response.SubjectPerformanceDto;
import com.edusync.entity.AttendanceStatus;
import com.edusync.entity.StudentStatus;
import com.edusync.repository.AttendanceRecordRepository;
import com.edusync.repository.ExamResultRepository;
import com.edusync.repository.FeeRecordRepository;
import com.edusync.repository.StaffRepository;
import com.edusync.repository.StudentRepository;
import com.edusync.repository.UserRepository;
import com.edusync.util.Money;
import com.edusync.util.Numbers;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private static final DateTimeFormatter TERM_DATE_FMT =
            DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", Locale.ENGLISH);

    private final StudentRepository studentRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final FeeRecordRepository feeRepository;
    private final ExamResultRepository examRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    public DashboardService(StudentRepository studentRepository,
                            AttendanceRecordRepository attendanceRepository,
                            FeeRecordRepository feeRepository,
                            ExamResultRepository examRepository,
                            StaffRepository staffRepository,
                            UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.feeRepository = feeRepository;
        this.examRepository = examRepository;
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
    }

    /** Greeting personalised to the signed-in user, with today's date as term context. */
    public DashboardSummaryDto getSummary() {
        String firstName = currentUserFirstName();
        String greeting = timeOfDayGreeting() + (firstName != null ? ", " + firstName : "");
        // Term/week is not modelled yet — use the live date as the scannable context line.
        String term = "Term 2, 2026 · " + LocalDate.now().format(TERM_DATE_FMT);
        return new DashboardSummaryDto(greeting, term, "SMK Bandar Utama");
    }

    public KpiDto getKpis() {
        long total = studentRepository.countByDeletedAtIsNull();
        long atRisk = studentRepository.countByStatusAndDeletedAtIsNull(StudentStatus.AT_RISK);

        LocalDate today = LocalDate.now();
        long presentToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.PRESENT);
        double attendancePct = total > 0 ? (presentToday * 100.0 / total) : 0.0;

        double feePct = Money.pct(feeRepository.sumCollected(), feeRepository.sumTotal());
        long teachingStaff = staffRepository.count();

        return new KpiDto(total, atRisk, Numbers.round1(attendancePct), feePct, teachingStaff);
    }

    public AttendanceWeekDto getWeeklyAttendance() {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        long totalStudents = studentRepository.countByDeletedAtIsNull();

        List<AttendanceWeekDto.DayAttendance> days = new ArrayList<>();
        for (int i = 0; i <= 4; i++) {
            LocalDate day = monday.plusDays(i);
            long present = attendanceRepository.countByDateAndStatus(day, AttendanceStatus.PRESENT);
            long absent = totalStudents > present ? totalStudents - present : 0;
            String label = day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            days.add(new AttendanceWeekDto.DayAttendance(label, present, absent));
        }

        return new AttendanceWeekDto(days);
    }

    /** Collected percentage plus pre-formatted RM labels for the fee donut. */
    public FeeCollectionDto getFeeCollection() {
        BigDecimal collected = Money.nz(feeRepository.sumCollected());
        BigDecimal total = Money.nz(feeRepository.sumTotal());
        BigDecimal outstanding = total.subtract(collected).max(BigDecimal.ZERO);
        return new FeeCollectionDto(Money.pct(collected, total), Money.format(collected), Money.format(outstanding));
    }

    /** Average score per subject, weakest subject highlighted. */
    public List<SubjectPerformanceDto> getSubjectPerformance() {
        List<Object[]> rows = examRepository.avgScoreBySubject(); // ordered by avg desc
        List<SubjectPerformanceDto> result = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            Object[] row = rows.get(i);
            String subject = (String) row[0];
            Double avg = (Double) row[1];
            boolean highlight = (i == rows.size() - 1); // lowest scorer
            result.add(new SubjectPerformanceDto(subject, Numbers.roundToInt(avg), highlight));
        }
        return result;
    }

    private static String timeOfDayGreeting() {
        int hour = LocalTime.now().getHour();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }

    private String currentUserFirstName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userRepository.findByEmail(auth.getName())
                .map(u -> u.getName())
                .filter(n -> n != null && !n.isBlank())
                .map(n -> n.trim().split("\\s+")[0])
                .orElse(null);
    }
}
