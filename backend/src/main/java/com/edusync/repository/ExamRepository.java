package com.edusync.repository;

import com.edusync.entity.Exam;
import com.edusync.entity.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByStatusOrderByDateAsc(ExamStatus status);
    List<Exam> findByStatus(ExamStatus status);
}
