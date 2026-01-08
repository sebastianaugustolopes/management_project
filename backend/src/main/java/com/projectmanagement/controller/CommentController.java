package com.projectmanagement.controller;

import com.projectmanagement.dto.CreateCommentRequest;
import com.projectmanagement.model.Comment;
import com.projectmanagement.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    
    private final CommentService commentService;
    
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Comment>> getCommentsByTask(@PathVariable String taskId) {
        return ResponseEntity.ok(commentService.findByTaskId(taskId));
    }
    
    @PostMapping("/task/{taskId}")
    public ResponseEntity<Comment> createComment(
            @PathVariable String taskId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        try {
            String userId = authentication.getName();
            Comment comment = commentService.create(taskId, userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
