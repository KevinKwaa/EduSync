package com.edusync.service;

import com.edusync.dto.request.EventRequest;
import com.edusync.dto.response.EventResponse;
import com.edusync.entity.Event;
import com.edusync.exception.ResourceNotFoundException;
import com.edusync.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

/** Calendar event CRUD and lookups (by month or upcoming). */
@Service
@Transactional(readOnly = true)
public class EventService {

    /** How many upcoming events the dashboard widget shows. */
    private static final int UPCOMING_LIMIT = 6;

    private final EventRepository eventRepository;
    private final AuditService auditService;

    public EventService(EventRepository eventRepository, AuditService auditService) {
        this.eventRepository = eventRepository;
        this.auditService = auditService;
    }

    /**
     * Events for a given {@code year}/{@code month} (1–12) when both are supplied,
     * otherwise upcoming events from today.
     */
    public List<EventResponse> list(Integer year, Integer month) {
        List<Event> events;
        if (year != null && month != null) {
            LocalDate first = LocalDate.of(year, month, 1);
            LocalDate last = first.withDayOfMonth(first.lengthOfMonth());
            events = eventRepository.findByDateBetweenOrderByDate(first, last);
        } else {
            events = eventRepository.findByDateGreaterThanEqualOrderByDate(LocalDate.now());
        }
        return events.stream().map(this::toResponse).toList();
    }

    /** The next few upcoming events for the dashboard widget. */
    public List<EventResponse> upcoming() {
        return eventRepository.findByDateGreaterThanEqualOrderByDate(LocalDate.now()).stream()
                .limit(UPCOMING_LIMIT)
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EventResponse create(EventRequest req) {
        Event event = Event.builder()
                .title(req.title())
                .date(req.date())
                .location(req.location())
                .type(req.type())
                .build();
        Event saved = eventRepository.save(event);
        auditService.record("Event", saved.getId(), "CREATE", "title=" + saved.getTitle());
        return toResponse(saved);
    }

    @Transactional
    public EventResponse update(Long id, EventRequest req) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id));
        event.setTitle(req.title());
        event.setDate(req.date());
        event.setLocation(req.location());
        event.setType(req.type());
        Event saved = eventRepository.save(event);
        auditService.record("Event", saved.getId(), "UPDATE", "title=" + saved.getTitle());
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event", id);
        }
        eventRepository.deleteById(id);
        auditService.record("Event", id, "DELETE", null);
    }

    private EventResponse toResponse(Event e) {
        LocalDate date = e.getDate();
        int day = date == null ? 0 : date.getDayOfMonth();
        String month = date == null ? ""
                : date.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toUpperCase();
        return new EventResponse(
                e.getId(), e.getTitle(), date, day, month, e.getLocation(), e.getType(), e.getLocation());
    }
}
