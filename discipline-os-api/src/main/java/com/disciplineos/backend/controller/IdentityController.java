package com.disciplineos.backend.controller;

import com.disciplineos.backend.dto.IdentityDTO;
import com.disciplineos.backend.service.IdentityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/identity")
@RequiredArgsConstructor
public class IdentityController {

    private final IdentityService service;

    @GetMapping
    public ResponseEntity<IdentityDTO> getIdentity() {
        IdentityDTO identity = service.getMyIdentity();
        if (identity == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(identity);
    }

    @PatchMapping
    public ResponseEntity<IdentityDTO> updateIdentity(@RequestBody IdentityDTO dto) {
        return ResponseEntity.ok(service.updateIdentity(dto));
    }
}
