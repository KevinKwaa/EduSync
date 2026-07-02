package com.edusync.service;

import com.edusync.dto.response.AnalyticsResponse;
import com.edusync.dto.response.AttendancePageResponse;
import com.edusync.entity.StudentStatus;
import com.edusync.repository.ExamResultRepository;
import com.edusync.repository.FeeRecordRepository;
import com.edusync.repository.StudentRepository;
import com.edusync.util.Money;
import com.edusync.util.Months;
import com.edusync.util.Numbers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Cross-domain analytics: headline signals, monthly trends, and subject movers. */
@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final StudentRepository studentRepository;
    private final ExamResultRepository examRepository;
    private final FeeRecordRepository feeRepository;
    private final AttendanceService attendanceService;
    private final FeeService feeService;

    public AnalyticsService(StudentRepository studentRepository,
                            ExamResultRepository examRepository,
                            FeeRecordRepository feeRepository,
                            AttendanceService attendanceService,
                            FeeService feeService) {
        this.studentRepository = studentRepository;
        this.examRepository = examRepository;
        this.feeRepository = feeRepository;
        this.attendanceService = attendanceService;
        this.feeService = feeService;
    }

    /** Full analytics aggregate. */
    public AnalyticsResponse getAll() {
        return new AnalyticsResponse(getSignals(), getMonthly(), getMovers());
    }

    /** Headline signals computed live from attendance, fees, at-risk and exams. */
    public List<AnalyticsResponse.Signal> getSignals() {
        List<AnalyticsResponse.Signal> signals = new ArrayList<>();

        double attRate = attendanceService.getToday().rate();
        signals.add(new AnalyticsResponse.Signal(1L, "Attendance today",
                fmt(attRate) + "%", "flat",
                attRate >= 95 ? "Above target" : "Below 95% target",
                attRate >= 95 ? "good" : attRate >= 90 ? "warning" : "danger"));

        double feePct = feeService.getSummary().pct();
        signals.add(new AnalyticsResponse.Signal(2L, "Fee compliance",
                fmt(feePct) + "%", "flat",
                feePct >= 85 ? "On track" : "Below 85% school target",
                feePct >= 85 ? "good" : feePct >= 70 ? "warning" : "danger"));

        long atRisk = studentRepository.countByStatusAndDeletedAtIsNull(StudentStatus.AT_RISK);
        signals.add(new AnalyticsResponse.Signal(3L, "At-risk cohort",
                String.valueOf(atRisk), "flat",
                atRisk == 0 ? "No students flagged" : "Needs principal intervention",
                atRisk == 0 ? "good" : atRisk <= 10 ? "warning" : "danger"));

        List<Object[]> bySubject = examRepository.avgScoreBySubject();
        if (!bySubject.isEmpty()) {
            Object[] lowest = bySubject.get(bySubject.size() - 1); // ordered desc
            String subject = (String) lowest[0];
            double avg = lowest[1] == null ? 0 : (Double) lowest[1];
            signals.add(new AnalyticsResponse.Signal(4L, subject + " average",
                    String.valueOf((int) Math.round(avg)), "flat",
                    "Lowest subject across all forms",
                    avg >= 75 ? "good" : avg >= 65 ? "warning" : "danger"));
        }
        return signals;
    }

    /** Monthly attendance rate and fee-collection percentage for the trailing 6 months. */
    public List<AnalyticsResponse.MonthPoint> getMonthly() {
        List<AttendancePageResponse.MonthRate> attendance = attendanceService.getMonthly();
        List<Months.Window> windows = Months.trailing(attendance.size());

        List<AnalyticsResponse.MonthPoint> points = new ArrayList<>();
        for (int i = 0; i < attendance.size(); i++) {
            Months.Window w = windows.get(i);
            BigDecimal due = Money.nz(feeRepository.sumDueBetween(w.start(), w.end()));
            BigDecimal paid = Money.nz(feeRepository.sumPaidDueBetween(w.start(), w.end()));
            points.add(new AnalyticsResponse.MonthPoint(
                    attendance.get(i).month(), attendance.get(i).rate(), Money.pct(paid, due)));
        }
        return points;
    }

    /** Biggest subject/form score changes between the two most recent exam dates. */
    public List<AnalyticsResponse.Mover> getMovers() {
        // "subject|form" -> ordered list of period averages
        Map<String, List<int[]>> series = new LinkedHashMap<>();
        Map<String, String[]> labels = new LinkedHashMap<>();
        for (Object[] row : examRepository.avgBySubjectFormAndDate()) {
            String subject = (String) row[0];
            Integer form = (Integer) row[1];
            Double avg = (Double) row[3];
            if (subject == null || avg == null) continue;
            String key = subject + "|" + form;
            series.computeIfAbsent(key, k -> new ArrayList<>()).add(new int[]{(int) Math.round(avg)});
            labels.putIfAbsent(key, new String[]{subject,
                    form == null ? "All forms" : "Form " + form});
        }

        List<AnalyticsResponse.Mover> movers = new ArrayList<>();
        for (Map.Entry<String, List<int[]>> e : series.entrySet()) {
            List<int[]> vals = e.getValue();
            if (vals.size() < 2) continue;
            int last = vals.get(vals.size() - 1)[0];
            int prev = vals.get(vals.size() - 2)[0];
            int delta = last - prev;
            if (delta == 0) continue;
            String[] label = labels.get(e.getKey());
            String change = (delta > 0 ? "+" : "−") + Math.abs(delta) + " pts";
            movers.add(new AnalyticsResponse.Mover(label[0], label[1], change, delta > 0 ? "up" : "down"));
        }
        movers.sort((a, b) -> Integer.compare(absPts(b.change()), absPts(a.change())));
        return movers.size() > 6 ? movers.subList(0, 6) : movers;
    }

    private static int absPts(String change) {
        // change looks like "+6 pts" / "−3 pts"
        String digits = change.replaceAll("[^0-9]", "");
        return digits.isEmpty() ? 0 : Integer.parseInt(digits);
    }

    private static String fmt(double value) {
        return String.valueOf(Numbers.round1(value));
    }
}
