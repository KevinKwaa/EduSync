package com.edusync.repository;

import com.edusync.entity.Bursary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BursaryRepository extends JpaRepository<Bursary, Long> {
    List<Bursary> findByStudentId(Long studentId);
}
