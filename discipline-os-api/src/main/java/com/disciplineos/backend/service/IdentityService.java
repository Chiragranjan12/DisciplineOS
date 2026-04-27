package com.disciplineos.backend.service;

import com.disciplineos.backend.dto.IdentityDTO;
import com.disciplineos.backend.entity.Identity;
import com.disciplineos.backend.entity.User;
import com.disciplineos.backend.repository.IdentityRepository;
import com.disciplineos.backend.repository.UserRepository;
import com.disciplineos.backend.util.LifeArea;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IdentityService {

    private final IdentityRepository repository;
    private final UserRepository userRepository;

    public IdentityDTO getMyIdentity() {
        User user = getCurrentUser();
        if (user.getIdentity() == null) {
            return null;
        }
        return mapToDTO(user.getIdentity());
    }

    @Transactional
    public IdentityDTO updateIdentity(IdentityDTO dto) {
        User user = getCurrentUser();
        Identity identity = user.getIdentity();

        if (identity == null) {
            identity = new Identity();
        }

        identity.setTitle(dto.getTitle());
        identity.setDescription(dto.getDescription());
        identity.setHealthWeight(dto.getHealthWeight());
        identity.setSkillsWeight(dto.getSkillsWeight());
        identity.setCareerWeight(dto.getCareerWeight());
        identity.setFinanceWeight(dto.getFinanceWeight());
        identity.setRelationshipsWeight(dto.getRelationshipsWeight());
        identity.setMindsetWeight(dto.getMindsetWeight());
        identity.setTargetDate(dto.getTargetDate());
        identity.setProgressPercent(dto.getProgressPercent());
        identity.setLinkedHabitIds(
                dto.getLinkedHabitIds() != null ? dto.getLinkedHabitIds() : new java.util.ArrayList<>());
        identity.setLinkedTaskIds(
                dto.getLinkedTaskIds() != null ? dto.getLinkedTaskIds() : new java.util.ArrayList<>());

        identity = repository.save(identity);

        if (user.getIdentity() == null) {
            user.setIdentity(identity);
            userRepository.save(user);
        }

        return mapToDTO(identity);
    }

    public Map<LifeArea, Double> getWeightsForUser(User user) {
        Identity identity = user.getIdentity();
        Map<LifeArea, Double> weights = new HashMap<>();

        if (identity == null) {
            for (LifeArea area : LifeArea.values()) {
                weights.put(area, 1.0);
            }
            return weights;
        }

        // Null-safe: default to 1.0 for any weight that was never set in the DB
        weights.put(LifeArea.Health,        coalesce(identity.getHealthWeight(),        1.0));
        weights.put(LifeArea.Skills,        coalesce(identity.getSkillsWeight(),        1.0));
        weights.put(LifeArea.Career,        coalesce(identity.getCareerWeight(),        1.0));
        weights.put(LifeArea.Finance,       coalesce(identity.getFinanceWeight(),       1.0));
        weights.put(LifeArea.Relationships, coalesce(identity.getRelationshipsWeight(), 1.0));
        weights.put(LifeArea.Mindset,       coalesce(identity.getMindsetWeight(),       1.0));

        return weights;
    }

    private static Double coalesce(Double value, Double fallback) {
        return value != null ? value : fallback;
    }

    public Map<LifeArea, Double> getNormalizedWeights(User user) {
        Map<LifeArea, Double> rawWeights = getWeightsForUser(user);
        double sum = rawWeights.values().stream().mapToDouble(Double::doubleValue).sum();

        if (sum == 0) {
            Map<LifeArea, Double> equalWeights = new HashMap<>();
            for (LifeArea area : LifeArea.values())
                equalWeights.put(area, 1.0);
            return equalWeights;
        }

        double factor = (double) LifeArea.values().length / sum;
        Map<LifeArea, Double> normalized = new HashMap<>();
        for (Map.Entry<LifeArea, Double> entry : rawWeights.entrySet()) {
            normalized.put(entry.getKey(), entry.getValue() * factor);
        }
        return normalized;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private IdentityDTO mapToDTO(Identity identity) {
        return IdentityDTO.builder()
                .id(identity.getId())
                .title(identity.getTitle())
                .description(identity.getDescription())
                .healthWeight(identity.getHealthWeight())
                .skillsWeight(identity.getSkillsWeight())
                .careerWeight(identity.getCareerWeight())
                .financeWeight(identity.getFinanceWeight())
                .relationshipsWeight(identity.getRelationshipsWeight())
                .mindsetWeight(identity.getMindsetWeight())
                .targetDate(identity.getTargetDate())
                .progressPercent(identity.getProgressPercent())
                .linkedHabitIds(identity.getLinkedHabitIds() != null ? identity.getLinkedHabitIds()
                        : new java.util.ArrayList<>())
                .linkedTaskIds(
                        identity.getLinkedTaskIds() != null ? identity.getLinkedTaskIds() : new java.util.ArrayList<>())
                .createdAt(identity.getCreatedAt())
                .build();
    }
}
