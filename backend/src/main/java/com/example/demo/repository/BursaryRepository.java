package com.example.demo.repository;

import com.example.demo.entity.Bursary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BursaryRepository extends JpaRepository<Bursary, Long> {
    List<Bursary> findByStudentId(Long studentId);
}
