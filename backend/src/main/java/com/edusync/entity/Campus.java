package com.edusync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "campuses")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Campus {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 255)
    private String name;

    private Integer studentCount;
    private Integer classroomCount;

    @Size(max = 100)
    private String operationalStatus;
}
