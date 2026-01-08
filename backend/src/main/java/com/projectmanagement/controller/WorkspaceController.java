package com.projectmanagement.controller;

import com.projectmanagement.dto.CreateWorkspaceRequest;
import com.projectmanagement.dto.InviteMemberRequest;
import com.projectmanagement.model.Workspace;
import com.projectmanagement.model.WorkspaceMember;
import com.projectmanagement.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {
    
    private final WorkspaceService workspaceService;
    
    @GetMapping
    public ResponseEntity<List<Workspace>> getAllWorkspaces(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(workspaceService.findByUserId(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Workspace> getWorkspaceById(@PathVariable String id) {
        return workspaceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Workspace> createWorkspace(
            @Valid @RequestBody CreateWorkspaceRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        Workspace created = workspaceService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Workspace> updateWorkspace(
            @PathVariable String id, 
            @Valid @RequestBody CreateWorkspaceRequest request) {
        return workspaceService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable String id) {
        workspaceService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{workspaceId}/members")
    public ResponseEntity<WorkspaceMember> addMember(
            @PathVariable String workspaceId,
            @Valid @RequestBody InviteMemberRequest request) {
        try {
            WorkspaceMember member = workspaceService.addMember(workspaceId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(member);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
