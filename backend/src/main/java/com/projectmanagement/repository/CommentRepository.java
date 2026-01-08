package com.projectmanagement.repository;

import com.projectmanagement.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByTaskIdOrderByCreatedAtDesc(String taskId);
}
