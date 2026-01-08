package com.projectmanagement.service;

import com.projectmanagement.dto.CreateTaskRequest;
import com.projectmanagement.model.Task;
import com.projectmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    
    public List<Task> findAll() {
        return taskRepository.findAll();
    }
    
    public Optional<Task> findById(String id) {
        return taskRepository.findById(id);
    }
    
    @Transactional
    public Task create(CreateTaskRequest request, String currentUserId) {
        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
        task.setProjectId(request.getProjectId());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setType(request.getType());
        task.setPriority(request.getPriority());
        
        // Set assignee (default to current user if not provided)
        String assigneeId = request.getAssigneeId() != null && !request.getAssigneeId().isEmpty()
            ? request.getAssigneeId()
            : currentUserId;
        task.setAssigneeId(assigneeId);
        
        task.setDueDate(request.getDueDate() != null 
            ? request.getDueDate() 
            : java.time.LocalDateTime.now().plusDays(7));
        
        return taskRepository.save(task);
    }
    
    @Transactional
    public Optional<Task> update(String id, CreateTaskRequest request) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(request.getTitle());
                    task.setDescription(request.getDescription());
                    task.setStatus(request.getStatus());
                    task.setType(request.getType());
                    task.setPriority(request.getPriority());
                    if (request.getAssigneeId() != null && !request.getAssigneeId().isEmpty()) {
                        task.setAssigneeId(request.getAssigneeId());
                    }
                    if (request.getDueDate() != null) {
                        task.setDueDate(request.getDueDate());
                    }
                    return taskRepository.save(task);
                });
    }
    
    @Transactional
    public void delete(String id) {
        taskRepository.deleteById(id);
    }
    
    public List<Task> findByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    
    public List<Task> findByAssigneeId(String assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId);
    }
}
