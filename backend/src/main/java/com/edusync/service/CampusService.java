package com.edusync.service;

import com.edusync.dto.response.CampusResponse;
import com.edusync.repository.CampusRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Campus/site listing. */
@Service
@Transactional(readOnly = true)
public class CampusService {

    private final CampusRepository campusRepository;

    public CampusService(CampusRepository campusRepository) {
        this.campusRepository = campusRepository;
    }

    public List<CampusResponse> getAll() {
        return campusRepository.findAll().stream()
                .map(c -> new CampusResponse(
                        c.getId(),
                        c.getName(),
                        c.getStudentCount(),
                        c.getClassroomCount(),
                        c.getOperationalStatus() == null ? null
                                : c.getOperationalStatus().toLowerCase().replace(' ', '-')))
                .toList();
    }
}
