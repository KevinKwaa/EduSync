package com.edusync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "events")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Event {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 255)
    private String title;

    private LocalDate date;

    @Size(max = 255)
    private String location;

    @Size(max = 100)
    private String type;
}
