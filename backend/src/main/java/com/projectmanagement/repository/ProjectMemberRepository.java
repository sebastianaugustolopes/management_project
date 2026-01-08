package com.projectmanagement.repository;

import com.projectmanagement.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, String> {
    List<ProjectMember> findByProjectId(String projectId);
    List<ProjectMember> findByUserId(String userId);
    boolean existsByUserIdAndProjectId(String userId, String projectId);
}
