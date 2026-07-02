package com.edusync.service;

import com.edusync.dto.response.FeePageResponse;
import com.edusync.entity.FeeRecord;
import com.edusync.entity.FeeStatus;
import com.edusync.repository.BursaryRepository;
import com.edusync.repository.FeeRecordRepository;
import com.edusync.util.DisplayMapper;
import com.edusync.util.Money;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Fee collection reporting and bursary listing. */
@Service
@Transactional(readOnly = true)
public class FeeService {

    private final FeeRecordRepository feeRepository;
    private final BursaryRepository bursaryRepository;

    public FeeService(FeeRecordRepository feeRepository, BursaryRepository bursaryRepository) {
        this.feeRepository = feeRepository;
        this.bursaryRepository = bursaryRepository;
    }

    /** Full fees page aggregate. */
    public FeePageResponse getPage() {
        return new FeePageResponse(getSummary(), getByForm(), getOverdue(), getBursaries());
    }

    /** Collected vs target vs outstanding across the school. */
    public FeePageResponse.Summary getSummary() {
        BigDecimal collected = Money.nz(feeRepository.sumCollected());
        BigDecimal target = Money.nz(feeRepository.sumTotal());
        BigDecimal outstanding = target.subtract(collected).max(BigDecimal.ZERO);
        return new FeePageResponse.Summary(collected, outstanding, target, Money.pct(collected, target));
    }

    /** Collected/outstanding per form. */
    public List<FeePageResponse.ByForm> getByForm() {
        // form -> [collected, total]
        Map<Integer, BigDecimal[]> byForm = new LinkedHashMap<>();
        for (Object[] row : feeRepository.sumByFormAndStatus()) {
            Integer form = (Integer) row[0];
            FeeStatus status = (FeeStatus) row[1];
            BigDecimal amount = Money.nz((BigDecimal) row[2]);
            BigDecimal[] agg = byForm.computeIfAbsent(form, k -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            agg[1] = agg[1].add(amount);
            if (status == FeeStatus.PAID) agg[0] = agg[0].add(amount);
        }
        List<FeePageResponse.ByForm> result = new ArrayList<>();
        byForm.entrySet().stream()
                .sorted((a, b) -> Integer.compare(
                        b.getKey() == null ? -1 : b.getKey(),
                        a.getKey() == null ? -1 : a.getKey()))
                .forEach(e -> {
                    BigDecimal collected = e.getValue()[0];
                    BigDecimal total = e.getValue()[1];
                    BigDecimal outstanding = total.subtract(collected).max(BigDecimal.ZERO);
                    result.add(new FeePageResponse.ByForm(
                            DisplayMapper.formLabel(e.getKey()), collected, outstanding, Money.pct(collected, total)));
                });
        return result;
    }

    /** Overdue fee records with a derived urgency band. */
    public List<FeePageResponse.Overdue> getOverdue() {
        LocalDate today = LocalDate.now();
        return feeRepository.findByStatus(FeeStatus.OVERDUE).stream()
                .map(f -> new FeePageResponse.Overdue(
                        f.getId(),
                        DisplayMapper.initials(f.getStudent().getName()),
                        f.getStudent().getName(),
                        Money.nz(f.getAmount()),
                        urgency(f, today)))
                .toList();
    }

    /** All bursary awards/applications. */
    public List<FeePageResponse.Bursary> getBursaries() {
        return bursaryRepository.findAll().stream()
                .map(b -> new FeePageResponse.Bursary(
                        b.getId(),
                        b.getStudent().getName(),
                        b.getStudent().getClassName(),
                        b.getType(),
                        DisplayMapper.kebab(b.getStatus()),
                        Money.nz(b.getAmount())))
                .toList();
    }

    private static String urgency(FeeRecord fee, LocalDate today) {
        if (fee.getDueDate() == null) return "low";
        long daysOverdue = ChronoUnit.DAYS.between(fee.getDueDate(), today);
        if (daysOverdue > 30) return "high";
        if (daysOverdue > 7) return "medium";
        return "low";
    }
}
