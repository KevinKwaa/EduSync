package com.edusync.service;

import com.edusync.dto.response.LeaveResponse;
import com.edusync.dto.response.StaffResponse;
import com.edusync.entity.LeaveRequest;
import com.edusync.entity.LeaveStatus;
import com.edusync.entity.Staff;
import com.edusync.exception.ResourceNotFoundException;
import com.edusync.repository.ClassRoomRepository;
import com.edusync.repository.LeaveRequestRepository;
import com.edusync.repository.StaffRepository;
import com.edusync.util.DisplayMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/** Staff directory and leave-management read logic. */
@Service
@Transactional(readOnly = true)
public class StaffService {

    /** A full weekly teaching load, used to express workload as a percentage. */
    private static final double FULL_LOAD_HOURS = 28.0;

    private final StaffRepository staffRepository;
    private final ClassRoomRepository classRoomRepository;
    private final LeaveRequestRepository leaveRepository;

    public StaffService(StaffRepository staffRepository,
                        ClassRoomRepository classRoomRepository,
                        LeaveRequestRepository leaveRepository) {
        this.staffRepository = staffRepository;
        this.classRoomRepository = classRoomRepository;
        this.leaveRepository = leaveRepository;
    }

    /** Full teaching/support staff directory. */
    public List<StaffResponse> getDirectory() {
        return staffRepository.findAll().stream().map(this::toStaff).toList();
    }

    /** Single staff member by id; 404 if missing. */
    public StaffResponse getById(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", id));
        return toStaff(staff);
    }

    /** Leave requests awaiting principal approval. */
    public List<LeaveResponse.LeaveItem> getPendingLeave() {
        return leaveRepository.findByStatus(LeaveStatus.PENDING).stream()
                .map(this::toLeaveItem)
                .toList();
    }

    /** Full leave overview used by the leave page. */
    public LeaveResponse getLeaveOverview() {
        LocalDate today = LocalDate.now();

        List<LeaveResponse.LeaveItem> pending = leaveRepository.findByStatus(LeaveStatus.PENDING)
                .stream().map(this::toLeaveItem).toList();

        List<LeaveResponse.LeaveItem> approved = leaveRepository.findByStatus(LeaveStatus.APPROVED)
                .stream().map(this::toLeaveItem).toList();

        List<LeaveResponse.OnLeaveToday> onLeaveToday = leaveRepository
                .findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        LeaveStatus.APPROVED, today, today)
                .stream()
                .map(lr -> new LeaveResponse.OnLeaveToday(
                        DisplayMapper.initials(lr.getStaff().getName()),
                        lr.getStaff().getName(),
                        lr.getStaff().getSubjects(),
                        lr.getEndDate() == null ? "—"
                                : lr.getEndDate().plusDays(1).format(
                                        java.time.format.DateTimeFormatter.ofPattern("d MMM yyyy"))))
                .toList();

        return new LeaveResponse(pending, approved, onLeaveToday);
    }

    // --- mappers -------------------------------------------------------------

    private StaffResponse toStaff(Staff s) {
        List<String> subjects = (s.getSubjects() == null || s.getSubjects().isBlank())
                ? List.of()
                : Arrays.stream(s.getSubjects().split(",")).map(String::trim).filter(x -> !x.isEmpty()).toList();

        long classes = classRoomRepository.countByHomeTeacherId(s.getId());
        double hours = s.getWorkloadHours() == null ? 0 : s.getWorkloadHours();
        int load = (int) Math.min(100, Math.round(hours / FULL_LOAD_HOURS * 100));
        String status = (s.getLeaveStatus() != null && s.getLeaveStatus().toLowerCase().contains("leave"))
                ? "on-leave" : "active";

        return new StaffResponse(
                s.getId(),
                DisplayMapper.initials(s.getName()),
                s.getName(),
                s.getRole(),
                subjects,
                classes,
                s.getWorkloadHours(),
                load,
                status
        );
    }

    private LeaveResponse.LeaveItem toLeaveItem(LeaveRequest lr) {
        Staff staff = lr.getStaff();
        return new LeaveResponse.LeaveItem(
                lr.getId(),
                staff.getId(),
                DisplayMapper.initials(staff.getName()),
                staff.getName(),
                lr.getType(),
                dateRange(lr.getStartDate(), lr.getEndDate()),
                dayCount(lr.getStartDate(), lr.getEndDate()),
                DisplayMapper.kebab(lr.getStatus())
        );
    }

    /** "20–22 Jun" when same month, else "20 Jun – 2 Jul"; single day if no end. */
    private static String dateRange(LocalDate start, LocalDate end) {
        if (start == null) return "—";
        String startMonth = start.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        if (end == null || end.equals(start)) {
            return start.getDayOfMonth() + " " + startMonth;
        }
        if (start.getMonth() == end.getMonth()) {
            return start.getDayOfMonth() + "–" + end.getDayOfMonth() + " " + startMonth;
        }
        String endMonth = end.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        return start.getDayOfMonth() + " " + startMonth + " – " + end.getDayOfMonth() + " " + endMonth;
    }

    private static long dayCount(LocalDate start, LocalDate end) {
        if (start == null) return 0;
        if (end == null) return 1;
        return ChronoUnit.DAYS.between(start, end) + 1;
    }
}
