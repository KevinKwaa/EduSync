package com.edusync.service;

import com.edusync.dto.response.FeePageResponse;
import com.edusync.dto.response.FinanceResponse;
import com.edusync.repository.FeeRecordRepository;
import com.edusync.util.Money;
import com.edusync.util.Months;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Finance reporting. Reuses {@link FeeService} for the collection summary and
 * per-form breakdown, and computes real monthly collected totals.
 */
@Service
@Transactional(readOnly = true)
public class FinanceService {

    private static final int MONTHS = 6;

    private final FeeService feeService;
    private final FeeRecordRepository feeRepository;

    public FinanceService(FeeService feeService, FeeRecordRepository feeRepository) {
        this.feeService = feeService;
        this.feeRepository = feeRepository;
    }

    public FinanceResponse getPage() {
        FeePageResponse.Summary s = feeService.getSummary();
        FinanceResponse.Summary summary =
                new FinanceResponse.Summary(s.collected(), s.outstanding(), s.target(), s.pct());

        List<FinanceResponse.Category> categories = feeService.getByForm().stream()
                .map(f -> new FinanceResponse.Category(
                        f.form(), f.collected(), f.collected().add(f.outstanding()), f.pct()))
                .toList();

        return new FinanceResponse(summary, monthly(), categories);
    }

    /** Collected amount and % of billed per month for the trailing 6 months. */
    private List<FinanceResponse.MonthPoint> monthly() {
        return Months.trailing(MONTHS).stream()
                .map(m -> {
                    BigDecimal billed = Money.nz(feeRepository.sumDueBetween(m.start(), m.end()));
                    BigDecimal paid = Money.nz(feeRepository.sumPaidDueBetween(m.start(), m.end()));
                    return new FinanceResponse.MonthPoint(m.label(), paid, Money.pct(paid, billed));
                })
                .toList();
    }
}
