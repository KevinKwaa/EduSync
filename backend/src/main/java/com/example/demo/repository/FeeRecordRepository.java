package com.example.demo.repository;

import com.example.demo.entity.FeeRecord;
import com.example.demo.entity.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface FeeRecordRepository extends JpaRepository<FeeRecord, Long> {
    List<FeeRecord> findByStatus(FeeStatus status);
    List<FeeRecord> findByStudentId(Long studentId);

    @Query("SELECT SUM(f.amount) FROM FeeRecord f WHERE f.status = 'PAID'")
    BigDecimal sumCollected();

    @Query("SELECT SUM(f.amount) FROM FeeRecord f")
    BigDecimal sumTotal();
}
