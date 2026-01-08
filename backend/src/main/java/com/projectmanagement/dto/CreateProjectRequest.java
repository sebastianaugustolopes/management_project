package com.projectmanagement.dto;

import com.projectmanagement.model.enums.Priority;
import com.projectmanagement.model.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateProjectRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    private ProjectStatus status = ProjectStatus.PLANNING;
    private Priority priority = Priority.MEDIUM;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String teamLead;
    @NotBlank(message = "Workspace ID is required")
    private String workspaceId;
    private Integer progress = 0;
    private List<String> teamMembers;
}
