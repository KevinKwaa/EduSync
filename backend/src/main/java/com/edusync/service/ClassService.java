package com.edusync.service;

import com.edusync.dto.response.ClassGroupResponse;
import com.edusync.entity.ClassRoom;
import com.edusync.entity.Student;
import com.edusync.repository.ClassRoomRepository;
import com.edusync.repository.StudentRepository;
import com.edusync.util.DisplayMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Class listing grouped by form, with per-class stats aggregated from students. */
@Service
@Transactional(readOnly = true)
public class ClassService {

    private final ClassRoomRepository classRoomRepository;
    private final StudentRepository studentRepository;

    public ClassService(ClassRoomRepository classRoomRepository, StudentRepository studentRepository) {
        this.classRoomRepository = classRoomRepository;
        this.studentRepository = studentRepository;
    }

    public List<ClassGroupResponse> getClassGroups() {
        Map<String, List<Student>> studentsByClass = studentRepository.findByDeletedAtIsNull().stream()
                .filter(s -> s.getClassName() != null)
                .collect(Collectors.groupingBy(Student::getClassName));

        // form -> list of class rows (classrooms already ordered form desc, name asc)
        Map<Integer, List<ClassGroupResponse.ClassInfo>> byForm = new LinkedHashMap<>();
        for (ClassRoom room : classRoomRepository.findAllByOrderByFormDescNameAsc()) {
            byForm.computeIfAbsent(room.getForm(), k -> new ArrayList<>()).add(toClassInfo(room, studentsByClass));
        }

        List<ClassGroupResponse> groups = new ArrayList<>();
        byForm.forEach((form, classes) ->
                groups.add(new ClassGroupResponse(DisplayMapper.formLabel(form), classes.size(), classes)));
        return groups;
    }

    private ClassGroupResponse.ClassInfo toClassInfo(ClassRoom room, Map<String, List<Student>> studentsByClass) {
        List<Student> students = studentsByClass.getOrDefault(room.getName(), List.of());
        int size = students.isEmpty() ? (room.getSize() == null ? 0 : room.getSize()) : students.size();
        int attendance = (int) Math.round(students.stream()
                .filter(s -> s.getAttendancePct() != null).mapToDouble(Student::getAttendancePct).average().orElse(0));
        int avgScore = (int) Math.round(students.stream()
                .filter(s -> s.getAvgScore() != null).mapToDouble(Student::getAvgScore).average().orElse(0));
        String teacher = room.getHomeTeacher() != null ? room.getHomeTeacher().getName() : "Unassigned";
        String status = avgScore >= 80 ? "high-perform" : avgScore < 70 ? "needs-support" : "on-track";

        return new ClassGroupResponse.ClassInfo(
                room.getId(), room.getName(), teacher, size, attendance, avgScore, status);
    }
}
