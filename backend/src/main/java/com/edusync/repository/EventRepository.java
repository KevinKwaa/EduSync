package com.edusync.repository;

import com.edusync.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDateBetweenOrderByDate(LocalDate start, LocalDate end);
    List<Event> findByDateGreaterThanEqualOrderByDate(LocalDate from);
}
