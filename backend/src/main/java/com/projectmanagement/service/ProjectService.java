package com.projectmanagement.service;

import com.projectmanagement.dto.CreateProjectRequest;
import com.projectmanagement.model.Project;
import com.projectmanagement.model.ProjectMember;
import com.projectmanagement.model.User;
import com.projectmanagement.repository.ProjectMemberRepository;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    
    public List<Project> findAll() {
        return projectRepository.findAll();
    }
    
    public Optional<Project> findById(String id) {
        return projectRepository.findById(id);
    }
    
    @Transactional
    public Project create(CreateProjectRequest request, String currentUserId) {
        Project project = new Project();
        project.setId(UUID.randomUUID().toString());
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(request.getStatus());
        project.setPriority(request.getPriority());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setProgress(request.getProgress() != null ? request.getProgress() : 0);
        project.setWorkspaceId(request.getWorkspaceId());
        
        // Set team lead (default to current user if not provided)
        String teamLead = request.getTeamLead() != null && !request.getTeamLead().isEmpty() 
            ? request.getTeamLead() 
            : currentUserId;
        project.setTeamLead(teamLead);
        
        Project savedProject = projectRepository.save(project);
        
        // Add team members
        List<String> membersToAdd = new ArrayList<>();
        if (request.getTeamMembers() != null) {
            membersToAdd.addAll(request.getTeamMembers());
        }
        
        // Add team lead as member if not already included
        if (!membersToAdd.contains(teamLead)) {
            membersToAdd.add(teamLead);
        }
        
        for (String userId : membersToAdd) {
            if (userRepository.existsById(userId)) {
                ProjectMember member = new ProjectMember();
                member.setId(UUID.randomUUID().toString());
                member.setUserId(userId);
                member.setProjectId(savedProject.getId());
                projectMemberRepository.save(member);
            }
        }
        
        return savedProject;
    }
    
    @Transactional
    public Optional<Project> update(String id, CreateProjectRequest request) {
        return projectRepository.findById(id)
                .map(project -> {
                    project.setName(request.getName());
                    project.setDescription(request.getDescription());
                    project.setStatus(request.getStatus());
                    project.setPriority(request.getPriority());
                    project.setStartDate(request.getStartDate());
                    project.setEndDate(request.getEndDate());
                    project.setProgress(request.getProgress() != null ? request.getProgress() : project.getProgress());
                    if (request.getTeamLead() != null && !request.getTeamLead().isEmpty()) {
                        project.setTeamLead(request.getTeamLead());
                    }
                    return projectRepository.save(project);
                });
    }
    
    @Transactional
    public void delete(String id) {
        projectRepository.deleteById(id);
    }
    
    public List<Project> findByWorkspaceId(String workspaceId) {
        return projectRepository.findByWorkspaceId(workspaceId);
    }
    
    public List<Project> findByUserId(String userId) {
        // Get projects where user is team lead or member
        List<Project> ledProjects = projectRepository.findByTeamLead(userId);
        List<ProjectMember> memberships = projectMemberRepository.findByUserId(userId);
        
        List<Project> memberProjects = memberships.stream()
                .map(m -> projectRepository.findById(m.getProjectId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
        
        // Combine and remove duplicates
        return java.util.stream.Stream.concat(ledProjects.stream(), memberProjects.stream())
                .distinct()
                .toList();
    }
    
    @Transactional
    public ProjectMember addMember(String projectId, String email) {
        // Check if project exists
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found");
        }
        
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Check if user is already a member
        if (projectMemberRepository.existsByUserIdAndProjectId(user.getId(), projectId)) {
            throw new RuntimeException("User is already a member of this project");
        }
        
        // Create project member
        ProjectMember member = new ProjectMember();
        member.setId(UUID.randomUUID().toString());
        member.setUserId(user.getId());
        member.setProjectId(projectId);
        
        return projectMemberRepository.save(member);
    }
}
