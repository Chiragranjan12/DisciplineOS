package com.disciplineos.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "identities")
public class Identity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String description;
    private LocalDate targetDate;
    private Double progressPercent;

    @ElementCollection
    @CollectionTable(name = "identity_habit_ids", joinColumns = @JoinColumn(name = "identity_id"))
    @Column(name = "habit_id")
    private List<UUID> linkedHabitIds;

    @ElementCollection
    @CollectionTable(name = "identity_task_ids", joinColumns = @JoinColumn(name = "identity_id"))
    @Column(name = "task_id")
    private List<UUID> linkedTaskIds;

    private LocalDateTime createdAt;

    // Weights for each LifeArea (Default: 1.0)
    private Double healthWeight;
    private Double skillsWeight;
    private Double careerWeight;
    private Double financeWeight;
    private Double relationshipsWeight;
    private Double mindsetWeight;

    @OneToOne(mappedBy = "identity")
    private User user;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null)
            createdAt = LocalDateTime.now();
        if (progressPercent == null)
            progressPercent = 0.0;
        if (targetDate == null)
            targetDate = LocalDate.now().plusMonths(3); // Default target 3 months out

        if (healthWeight == null)
            healthWeight = 1.0;
        if (skillsWeight == null)
            skillsWeight = 1.0;
        if (careerWeight == null)
            careerWeight = 1.0;
        if (financeWeight == null)
            financeWeight = 1.0;
        if (relationshipsWeight == null)
            relationshipsWeight = 1.0;
        if (mindsetWeight == null)
            mindsetWeight = 1.0;
    }
}
