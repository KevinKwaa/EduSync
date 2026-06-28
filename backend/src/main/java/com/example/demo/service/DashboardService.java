package com.example.demo.service;

import com.example.demo.dto.AttendanceWeekDto;
import com.example.demo.dto.DashboardSummaryDto;
import com.example.demo.dto.KpiDto;
import com.example.demo.entity.AttendanceStatus;
import com.example.demo.entity.StudentStatus;
import com.example.demo.repository.AttendanceRecordRepository;
import com.example.demo.repository.FeeRecordRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final FeeRecordRepository feeRepository;

    public DashboardService(StudentRepository studentRepository,
                            AttendanceRecordRepository attendanceRepository,
                            FeeRecordRepository feeRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.feeRepository = feeRepository;
    }

    public DashboardSummaryDto getSummary() {
        return new DashboardSummaryDto(
            "Welcome back",
            "Term 2, 2026",
            "SMK EduSync"
        );
    }

    public KpiDto getKpis() {
        long total = studentRepository.countByDeletedAtIsNull();
        long atRisk = studentRepository.countByStatusAndDeletedAtIsNull(StudentStatus.AT_RISK);

        LocalDate today = LocalDate.now();
        long presentToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.PRESENT);
        double attendancePct = total > 0 ? (presentToday * 100.0 / total) : 0.0;

        BigDecimal collected = feeRepository.sumCollected();
        BigDecimal totalFees = feeRepository.sumTotal();
        double feePct = (totalFees != null && totalFees.compareTo(BigDecimal.ZERO) > 0)
            ? collected.doubleValue() / totalFees.doubleValue() * 100.0
            : 0.0;

        return new KpiDto(total, atRisk, Math.round(attendancePct * 10) / 10.0, Math.round(feePct * 10) / 10.0);
    }

    public AttendanceWeekDto getWeeklyAttendance() {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(DayOfWeek.MONDAY);
        LocalDate friday = monday.plusDays(4);

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
}
