package com.disciplineos.backend.repository;

import com.disciplineos.backend.entity.Identity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface IdentityRepository extends JpaRepository<Identity, UUID> {
}
