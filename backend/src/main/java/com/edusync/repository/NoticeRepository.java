package com.edusync.repository;

import com.edusync.entity.Notice;
import com.edusync.entity.NoticeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByStatusOrderByCreatedAtDesc(NoticeStatus status);
    List<Notice> findAllByOrderByCreatedAtDesc();
}
