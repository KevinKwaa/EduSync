package com.example.demo.repository;

import com.example.demo.entity.AttendanceRecord;
import com.example.demo.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByDate(LocalDate date);
    List<AttendanceRecord> findByDateBetween(LocalDate start, LocalDate end);
    long countByDateAndStatus(LocalDate date, AttendanceStatus status);

    @Query("SELECT a.date, COUNT(a) FROM AttendanceRecord a WHERE a.date BETWEEN :start AND :end AND a.status = 'PRESENT' GROUP BY a.date ORDER BY a.date")
    List<Object[]> countPresentByDateBetween(LocalDate start, LocalDate end);
}
