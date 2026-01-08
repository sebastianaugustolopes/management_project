package com.projectmanagement.repository;

import com.projectmanagement.model.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, String> {
    List<WorkspaceMember> findByWorkspaceId(String workspaceId);
    List<WorkspaceMember> findByUserId(String userId);
    Optional<WorkspaceMember> findByUserIdAndWorkspaceId(String userId, String workspaceId);
    boolean existsByUserIdAndWorkspaceId(String userId, String workspaceId);
}
