package com.edusync.repository;

import com.edusync.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    /** Best-effort lookup of a teacher whose comma-separated subjects include the given one. */
    Optional<Staff> findFirstBySubjectsContainingIgnoreCase(String subject);
}
