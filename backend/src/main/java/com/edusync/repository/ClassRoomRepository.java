package com.edusync.repository;

import com.edusync.entity.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    List<ClassRoom> findByForm(Integer form);
    List<ClassRoom> findAllByOrderByFormDescNameAsc();
    long countByHomeTeacherId(Long staffId);
}
