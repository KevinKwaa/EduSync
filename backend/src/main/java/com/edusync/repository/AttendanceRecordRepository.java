package com.edusync.repository;

import com.edusync.entity.AttendanceRecord;
import com.edusync.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByDate(LocalDate date);
    List<AttendanceRecord> findByDateBetween(LocalDate start, LocalDate end);
    List<AttendanceRecord> findByDateAndStatus(LocalDate date, AttendanceStatus status);
    long countByDate(LocalDate date);
    long countByDateAndStatus(LocalDate date, AttendanceStatus status);
    long countByDateBetween(LocalDate start, LocalDate end);
    long countByDateBetweenAndStatus(LocalDate start, LocalDate end, AttendanceStatus status);
    long countByStudentIdAndStatusAndDateBetween(Long studentId, AttendanceStatus status, LocalDate start, LocalDate end);
    boolean existsByStudentIdAndDate(Long studentId, LocalDate date);

    @Query("SELECT a.date, COUNT(a) FROM AttendanceRecord a WHERE a.date BETWEEN :start AND :end AND a.status = 'PRESENT' GROUP BY a.date ORDER BY a.date")
    List<Object[]> countPresentByDateBetween(LocalDate start, LocalDate end);

    /** Rows of [form, status, count] for a single day — used to build per-form rates. */
    @Query("SELECT a.student.form, a.status, COUNT(a) FROM AttendanceRecord a WHERE a.date = :date GROUP BY a.student.form, a.status")
    List<Object[]> countByFormAndStatusOnDate(LocalDate date);
}
