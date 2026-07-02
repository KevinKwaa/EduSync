package com.edusync.repository;

import com.edusync.entity.Student;
import com.edusync.entity.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByDeletedAtIsNull();
    List<Student> findByFormAndDeletedAtIsNull(Integer form);
    List<Student> findByStatusAndDeletedAtIsNull(StudentStatus status);
    Optional<Student> findByIdAndDeletedAtIsNull(Long id);
    long countByDeletedAtIsNull();
    long countByStatusAndDeletedAtIsNull(StudentStatus status);
    long countByAvgScoreGreaterThanEqualAndDeletedAtIsNull(Double score);
    long countByCreatedAtAfterAndDeletedAtIsNull(LocalDateTime since);
}
