package com.example.demo.repository;

import com.example.demo.entity.LeaveRequest;
import com.example.demo.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStatus(LeaveStatus status);
    List<LeaveRequest> findByStaffId(Long staffId);
}
