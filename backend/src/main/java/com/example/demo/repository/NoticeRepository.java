package com.example.demo.repository;

import com.example.demo.entity.Notice;
import com.example.demo.entity.NoticeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByStatusOrderByCreatedAtDesc(NoticeStatus status);
}
