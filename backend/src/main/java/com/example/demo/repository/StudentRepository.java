package com.example.demo.repository;

import com.example.demo.entity.Student;
import com.example.demo.entity.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByDeletedAtIsNull();
    List<Student> findByFormAndDeletedAtIsNull(Integer form);
    List<Student> findByStatusAndDeletedAtIsNull(StudentStatus status);
    long countByDeletedAtIsNull();
    long countByStatusAndDeletedAtIsNull(StudentStatus status);
}
