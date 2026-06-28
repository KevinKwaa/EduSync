package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bursaries")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Bursary {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private String type;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private BursaryStatus status;
}
