package com.projectmanagement.controller;

import com.projectmanagement.dto.CreateTaskRequest;
import com.projectmanagement.model.Task;
import com.projectmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    
    private final TaskService taskService;
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(taskService.findByAssigneeId(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        return taskService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        Task created = taskService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable String id, 
            @Valid @RequestBody CreateTaskRequest request) {
        return taskService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(taskService.findByProjectId(projectId));
    }
}
