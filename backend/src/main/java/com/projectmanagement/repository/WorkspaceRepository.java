package com.projectmanagement.repository;

import com.projectmanagement.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, String> {
    Optional<Workspace> findBySlug(String slug);
    List<Workspace> findByOwnerId(String ownerId);
    boolean existsBySlug(String slug);
}
