package com.projectmanagement.service;

import com.projectmanagement.dto.CreateWorkspaceRequest;
import com.projectmanagement.dto.InviteMemberRequest;
import com.projectmanagement.model.User;
import com.projectmanagement.model.Workspace;
import com.projectmanagement.model.WorkspaceMember;
import com.projectmanagement.model.enums.WorkspaceRole;
import com.projectmanagement.repository.UserRepository;
import com.projectmanagement.repository.WorkspaceMemberRepository;
import com.projectmanagement.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceService {
    
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final UserRepository userRepository;
    
    public List<Workspace> findAll() {
        return workspaceRepository.findAll();
    }
    
    public Optional<Workspace> findById(String id) {
        return workspaceRepository.findById(id);
    }
    
    @Transactional
    public Workspace create(CreateWorkspaceRequest request, String ownerId) {
        Workspace workspace = new Workspace();
        workspace.setId(UUID.randomUUID().toString());
        workspace.setName(request.getName());
        workspace.setDescription(request.getDescription());
        workspace.setOwnerId(ownerId);
        workspace.setImageUrl(request.getImageUrl() != null ? request.getImageUrl() : "");
        workspace.setSettings(new HashMap<>());
        
        // Generate slug
        String slug = request.getName()
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        
        String baseSlug = slug;
        int counter = 1;
        while (workspaceRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        workspace.setSlug(slug);
        
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        
        // Add owner as admin member
        WorkspaceMember ownerMember = new WorkspaceMember();
        ownerMember.setId(UUID.randomUUID().toString());
        ownerMember.setUserId(ownerId);
        ownerMember.setWorkspaceId(savedWorkspace.getId());
        ownerMember.setRole(WorkspaceRole.ADMIN);
        ownerMember.setMessage("");
        workspaceMemberRepository.save(ownerMember);
        
        return savedWorkspace;
    }
    
    @Transactional
    public Optional<Workspace> update(String id, CreateWorkspaceRequest request) {
        return workspaceRepository.findById(id)
                .map(workspace -> {
                    workspace.setName(request.getName());
                    workspace.setDescription(request.getDescription());
                    if (request.getImageUrl() != null) {
                        workspace.setImageUrl(request.getImageUrl());
                    }
                    return workspaceRepository.save(workspace);
                });
    }
    
    @Transactional
    public void delete(String id) {
        workspaceRepository.deleteById(id);
    }
    
    public List<Workspace> findByUserId(String userId) {
        // Get workspaces where user is owner or member
        List<Workspace> owned = workspaceRepository.findByOwnerId(userId);
        List<WorkspaceMember> memberships = workspaceMemberRepository.findByUserId(userId);
        
        List<Workspace> memberWorkspaces = memberships.stream()
                .map(m -> workspaceRepository.findById(m.getWorkspaceId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
        
        // Combine and remove duplicates
        return java.util.stream.Stream.concat(owned.stream(), memberWorkspaces.stream())
                .distinct()
                .toList();
    }
    
    @Transactional
    public WorkspaceMember addMember(String workspaceId, InviteMemberRequest request) {
        // Check if workspace exists
        if (!workspaceRepository.existsById(workspaceId)) {
            throw new RuntimeException("Workspace not found");
        }
        
        // Find or create user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    // Create user if doesn't exist
                    User newUser = new User();
                    newUser.setId(UUID.randomUUID().toString());
                    newUser.setName(request.getEmail().split("@")[0]);
                    newUser.setEmail(request.getEmail());
                    newUser.setImage("");
                    return userRepository.save(newUser);
                });
        
        // Check if user is already a member
        if (workspaceMemberRepository.existsByUserIdAndWorkspaceId(user.getId(), workspaceId)) {
            throw new RuntimeException("User is already a member of this workspace");
        }
        
        // Create workspace member
        WorkspaceMember member = new WorkspaceMember();
        member.setId(UUID.randomUUID().toString());
        member.setUserId(user.getId());
        member.setWorkspaceId(workspaceId);
        member.setRole(request.getRole() != null ? request.getRole() : WorkspaceRole.MEMBER);
        member.setMessage("");
        
        return workspaceMemberRepository.save(member);
    }
}
