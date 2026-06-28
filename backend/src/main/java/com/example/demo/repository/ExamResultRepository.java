package com.example.demo.repository;

import com.example.demo.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByStudentId(Long studentId);

    @Query("SELECT r.subject.name, AVG(r.score) FROM ExamResult r GROUP BY r.subject.name ORDER BY AVG(r.score) DESC")
    List<Object[]> avgScoreBySubject();
}
