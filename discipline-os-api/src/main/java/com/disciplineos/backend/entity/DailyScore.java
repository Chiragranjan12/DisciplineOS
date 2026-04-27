package com.disciplineos.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "daily_scores", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "date" })
})
public class DailyScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Integer score;

    private Integer taskCompletionPercent;
    private Integer habitCompletionPercent;
    private Integer planningAccuracy;
    private Boolean reflectionCompleted;

    // Historical Weight Snapshots
    private Double healthWeight;
    private Double skillsWeight;
    private Double careerWeight;
    private Double financeWeight;
    private Double relationshipsWeight;
    private Double mindsetWeight;

    private Double penaltyApplied;
}
