package com.edusync.repository;

import com.edusync.entity.LeaveRequest;
import com.edusync.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStatus(LeaveStatus status);
    List<LeaveRequest> findByStaffId(Long staffId);

    /** Approved leave overlapping a given day — i.e. staff "on leave today". */
    List<LeaveRequest> findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LeaveStatus status, LocalDate onOrBefore, LocalDate onOrAfter);
}
