package com.edusync.service;

import com.edusync.dto.response.ExaminationResponse;
import com.edusync.entity.Exam;
import com.edusync.entity.ExamStatus;
import com.edusync.repository.ExamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Exam schedule reporting (upcoming / marking / results) from the Exam entity. */
@Service
@Transactional(readOnly = true)
public class ExaminationService {

    private static final DateTimeFormatter LONG_DATE = DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH);
    private static final DateTimeFormatter SHORT_DATE = DateTimeFormatter.ofPattern("MMM d", Locale.ENGLISH);

    private final ExamRepository examRepository;

    public ExaminationService(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    public ExaminationResponse getPage() {
        return new ExaminationResponse(upcoming(), marking(), results());
    }

    private List<ExaminationResponse.Upcoming> upcoming() {
        LocalDate today = LocalDate.now();
        return examRepository.findByStatusOrderByDateAsc(ExamStatus.SCHEDULED).stream()
                .map(e -> new ExaminationResponse.Upcoming(
                        e.getId(), e.getName(), fmt(e.getDate(), LONG_DATE), e.getForm(),
                        nz(e.getSubjectsCount()),
                        e.getDate() == null ? 0 : Math.max(0, ChronoUnit.DAYS.between(today, e.getDate()))))
                .toList();
    }

    private List<ExaminationResponse.Marking> marking() {
        return examRepository.findByStatus(ExamStatus.MARKING).stream()
                .map(e -> new ExaminationResponse.Marking(
                        e.getId(), e.getName(), e.getForm(), nz(e.getSubjectsCount()),
                        nz(e.getSubmitted()), nz(e.getTotal()),
                        fmt(e.getMarkingDeadline(), LONG_DATE), e.getMarker()))
                .toList();
    }

    /** Completed exams with a per-form trend/delta vs the previous sitting; newest first. */
    private List<ExaminationResponse.Result> results() {
        Map<String, Integer> prevAvgByForm = new HashMap<>();
        List<ExaminationResponse.Result> ascending = new ArrayList<>();

        for (Exam e : examRepository.findByStatusOrderByDateAsc(ExamStatus.COMPLETED)) {
            int avg = e.getAvgScore() == null ? 0 : (int) Math.round(e.getAvgScore());
            Integer prev = prevAvgByForm.put(e.getForm(), avg);

            String trend = "flat";
            String delta = "0";
            if (prev != null) {
                int diff = avg - prev;
                trend = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
                delta = diff == 0 ? "0" : (diff > 0 ? "+" : "−") + Math.abs(diff);
            }
            ascending.add(new ExaminationResponse.Result(
                    e.getId(), e.getName(), e.getForm(), avg, fmt(e.getDate(), SHORT_DATE), trend, delta));
        }
        Collections.reverse(ascending);
        return ascending;
    }

    private static int nz(Integer value) {
        return value == null ? 0 : value;
    }

    private static String fmt(LocalDate date, DateTimeFormatter formatter) {
        return date == null ? "—" : date.format(formatter);
    }
}
