package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.IdentityDTO;
import com.disciplineos.backend.service.IdentityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/identity")
@RequiredArgsConstructor
@Tag(name = "Identity", description = "User identity and goal setting endpoints")
public class IdentityController {

    private final IdentityService service;

    @GetMapping
    @Operation(summary = "Get identity", description = "Retrieves the current user's identity (their north star)")
    public ResponseEntity<IdentityDTO> getIdentity() {
        IdentityDTO identity = service.getMyIdentity();
        if (identity == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(identity);
    }

    @PatchMapping
    @Operation(summary = "Update identity", description = "Creates or updates the user's identity")
    public ResponseEntity<IdentityDTO> updateIdentity(@Valid @RequestBody IdentityDTO dto) {
        return ResponseEntity.ok(service.updateIdentity(dto));
    }
}
