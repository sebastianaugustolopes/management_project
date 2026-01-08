package com.projectmanagement.service;

import com.projectmanagement.dto.CreateCommentRequest;
import com.projectmanagement.model.Comment;
import com.projectmanagement.repository.CommentRepository;
import com.projectmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    
    public List<Comment> findByTaskId(String taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }
    
    @Transactional
    public Comment create(String taskId, String userId, CreateCommentRequest request) {
        // Check if task exists
        if (!taskRepository.existsById(taskId)) {
            throw new RuntimeException("Task not found");
        }
        
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setTaskId(taskId);
        comment.setUserId(userId);
        comment.setContent(request.getContent());
        
        return commentRepository.save(comment);
    }
    
    @Transactional
    public void delete(String id) {
        commentRepository.deleteById(id);
    }
}
