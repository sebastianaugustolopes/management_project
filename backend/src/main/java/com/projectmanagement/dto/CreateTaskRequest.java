package com.projectmanagement.dto;

import com.projectmanagement.model.enums.Priority;
import com.projectmanagement.model.enums.TaskStatus;
import com.projectmanagement.model.enums.TaskType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTaskRequest {
    @NotBlank(message = "Project ID is required")
    private String projectId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    private TaskStatus status = TaskStatus.TODO;
    private TaskType type = TaskType.TASK;
    private Priority priority = Priority.MEDIUM;
    @NotBlank(message = "Assignee ID is required")
    private String assigneeId;
    private LocalDateTime dueDate;
}
