package com.edusync.service;

import com.edusync.dto.response.AcademicsResponse;
import com.edusync.dto.response.ExamResultsResponse;
import com.edusync.entity.ExamResult;
import com.edusync.entity.ExamType;
import com.edusync.repository.ExamResultRepository;
import com.edusync.repository.StaffRepository;
import com.edusync.util.DisplayMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/** Academic attainment analytics, intervention candidates, and exam result summaries. */
@Service
@Transactional(readOnly = true)
public class AcademicsService {

    /** Exam score below this flags a student for intervention. */
    private static final double INTERVENTION_THRESHOLD = 50.0;

    private final ExamResultRepository examRepository;
    private final StaffRepository staffRepository;

    public AcademicsService(ExamResultRepository examRepository, StaffRepository staffRepository) {
        this.examRepository = examRepository;
        this.staffRepository = staffRepository;
    }

    /** Full academics page aggregate. */
    public AcademicsResponse getPage() {
        Double overall = examRepository.overallAverage();
        int overallAttainment = overall == null ? 0 : (int) Math.round(overall);
        return new AcademicsResponse(overallAttainment, getSubjectPerformance(), getInterventions());
    }

    /** Per-subject average scores pivoted across forms 1–5, with a coarse trend. */
    public List<AcademicsResponse.SubjectPerformance> getSubjectPerformance() {
        // subjectName -> (form -> avg)
        Map<String, Map<Integer, Integer>> bySubject = new LinkedHashMap<>();
        for (Object[] row : examRepository.avgBySubjectAndForm()) {
            String subject = (String) row[0];
            Integer form = (Integer) row[1];
            Double avg = (Double) row[2];
            if (subject == null || form == null || avg == null) continue;
            bySubject.computeIfAbsent(subject, k -> new TreeMap<>())
                    .put(form, (int) Math.round(avg));
        }

        List<AcademicsResponse.SubjectPerformance> result = new ArrayList<>();
        for (Map.Entry<String, Map<Integer, Integer>> e : bySubject.entrySet()) {
            Map<Integer, Integer> forms = e.getValue();
            result.add(new AcademicsResponse.SubjectPerformance(
                    e.getKey(),
                    forms.get(1), forms.get(2), forms.get(3), forms.get(4), forms.get(5),
                    trend(forms)));
        }
        return result;
    }

    /** Students with at least one exam score below the intervention threshold. */
    public List<AcademicsResponse.Intervention> getInterventions() {
        return examRepository.findByScoreLessThanOrderByScoreAsc(INTERVENTION_THRESHOLD).stream()
                .map(this::toIntervention)
                .toList();
    }

    /** Exam result summary grouped by exam type and form. Upcoming/marking are empty (see DTO note). */
    public ExamResultsResponse getExams() {
        List<ExamResultsResponse.ResultRow> results = new ArrayList<>();
        for (Object[] row : examRepository.avgByExamTypeAndForm()) {
            ExamType type = (ExamType) row[0];
            Integer form = (Integer) row[1];
            Double avg = (Double) row[2];
            long count = (Long) row[3];
            results.add(new ExamResultsResponse.ResultRow(
                    examTypeLabel(type),
                    DisplayMapper.formLabel(form),
                    avg == null ? 0 : (int) Math.round(avg),
                    count,
                    "flat"));
        }
        return new ExamResultsResponse(List.of(), List.of(), results);
    }

    // --- mappers / helpers ---------------------------------------------------

    private AcademicsResponse.Intervention toIntervention(ExamResult r) {
        String subject = r.getSubject().getName();
        String teacher = staffRepository.findFirstBySubjectsContainingIgnoreCase(subject)
                .map(s -> s.getName())
                .orElse("Unassigned");
        return new AcademicsResponse.Intervention(
                DisplayMapper.initials(r.getStudent().getName()),
                r.getStudent().getName(),
                r.getStudent().getClassName(),
                subject,
                r.getScore() == null ? 0 : (int) Math.round(r.getScore()),
                teacher,
                "active");
    }

    /** Compares the lowest and highest available form scores. */
    private static String trend(Map<Integer, Integer> forms) {
        if (forms.size() < 2) return "flat";
        List<Integer> keys = new ArrayList<>(forms.keySet());
        int first = forms.get(keys.get(0));
        int last = forms.get(keys.get(keys.size() - 1));
        if (last > first + 1) return "up";
        if (last < first - 1) return "down";
        return "flat";
    }

    private static String examTypeLabel(ExamType type) {
        if (type == null) return "Assessment";
        return switch (type) {
            case MONTHLY -> "Monthly Test";
            case MID_TERM -> "Mid-Term Exam";
            case FINAL -> "Final Exam";
            case TRIAL -> "Trial Exam";
        };
    }
}
