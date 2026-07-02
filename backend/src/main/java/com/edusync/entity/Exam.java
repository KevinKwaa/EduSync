package com.edusync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A scheduled exam across its lifecycle (SCHEDULED → MARKING → COMPLETED).
 * {@code form} is a display label ("Form 5", "All Forms") since an exam may
 * span forms. Marking fields apply while MARKING; {@code avgScore} once COMPLETED.
 */
@Entity
@Table(name = "exams")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Exam {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    private ExamType examType;

    @Size(max = 50)
    private String form;

    private LocalDate date;

    private Integer subjectsCount;

    @Enumerated(EnumType.STRING)
    private ExamStatus status;

    private Integer submitted;
    private Integer total;
    private LocalDate markingDeadline;

    @Size(max = 255)
    private String marker;

    private Double avgScore;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
