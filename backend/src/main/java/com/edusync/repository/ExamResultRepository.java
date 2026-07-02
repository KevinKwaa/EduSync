package com.edusync.repository;

import com.edusync.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByStudentId(Long studentId);
    List<ExamResult> findByScoreLessThanOrderByScoreAsc(Double score);

    @Query("SELECT r.subject.name, AVG(r.score) FROM ExamResult r GROUP BY r.subject.name ORDER BY AVG(r.score) DESC")
    List<Object[]> avgScoreBySubject();

    @Query("SELECT AVG(r.score) FROM ExamResult r")
    Double overallAverage();

    /** Rows of [subjectName, form, avg(score)] to pivot into the per-form subject grid. */
    @Query("SELECT r.subject.name, r.student.form, AVG(r.score) FROM ExamResult r GROUP BY r.subject.name, r.student.form")
    List<Object[]> avgBySubjectAndForm();

    /** Rows of [examType, form, avg(score), count] for the exam results summary. */
    @Query("SELECT r.examType, r.student.form, AVG(r.score), COUNT(r) FROM ExamResult r GROUP BY r.examType, r.student.form ORDER BY r.examType")
    List<Object[]> avgByExamTypeAndForm();

    /** Rows of [subjectName, form, date, avg(score)] for period-over-period movers. */
    @Query("SELECT r.subject.name, r.student.form, r.date, AVG(r.score) FROM ExamResult r WHERE r.date IS NOT NULL GROUP BY r.subject.name, r.student.form, r.date ORDER BY r.subject.name, r.student.form, r.date")
    List<Object[]> avgBySubjectFormAndDate();
}
