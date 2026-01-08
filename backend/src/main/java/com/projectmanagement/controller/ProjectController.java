package com.projectmanagement.controller;

import com.projectmanagement.dto.AddProjectMemberRequest;
import com.projectmanagement.dto.CreateProjectRequest;
import com.projectmanagement.model.Project;
import com.projectmanagement.model.ProjectMember;
import com.projectmanagement.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    
    private final ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(projectService.findByUserId(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return projectService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Project> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        Project created = projectService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable String id, 
            @Valid @RequestBody CreateProjectRequest request) {
        return projectService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<Project>> getProjectsByWorkspace(@PathVariable String workspaceId) {
        return ResponseEntity.ok(projectService.findByWorkspaceId(workspaceId));
    }
    
    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMember> addMember(
            @PathVariable String projectId,
            @Valid @RequestBody AddProjectMemberRequest request) {
        try {
            ProjectMember member = projectService.addMember(projectId, request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(member);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
