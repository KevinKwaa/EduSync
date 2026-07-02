package com.edusync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "subjects")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Subject {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 255)
    private String name;

    @Size(max = 100)
    private String formApplicability;
}
