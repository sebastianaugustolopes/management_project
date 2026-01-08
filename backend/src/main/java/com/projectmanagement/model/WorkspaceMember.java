package com.projectmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectmanagement.model.enums.WorkspaceRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workspace_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "workspace_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "workspace_id", nullable = false)
    private String workspaceId;
    
    @Column(columnDefinition = "TEXT DEFAULT ''")
    private String message = "";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkspaceRole role = WorkspaceRole.MEMBER;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"workspaces", "ownedWorkspaces", "projects", "tasks", "comments", "projectMembers"})
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"members", "projects", "owner", "settings"})
    private Workspace workspace;
}
