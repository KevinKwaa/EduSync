package com.edusync.repository;

import com.edusync.entity.FeeRecord;
import com.edusync.entity.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface FeeRecordRepository extends JpaRepository<FeeRecord, Long> {
    List<FeeRecord> findByStatus(FeeStatus status);
    List<FeeRecord> findByStudentId(Long studentId);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FeeRecord f WHERE f.status = 'PAID'")
    BigDecimal sumCollected();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FeeRecord f")
    BigDecimal sumTotal();

    /** Rows of [form, status, sum(amount)] for per-form collection breakdowns. */
    @Query("SELECT f.student.form, f.status, COALESCE(SUM(f.amount), 0) FROM FeeRecord f GROUP BY f.student.form, f.status")
    List<Object[]> sumByFormAndStatus();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FeeRecord f WHERE f.dueDate BETWEEN :start AND :end")
    BigDecimal sumDueBetween(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FeeRecord f WHERE f.status = 'PAID' AND f.dueDate BETWEEN :start AND :end")
    BigDecimal sumPaidDueBetween(LocalDate start, LocalDate end);
}
