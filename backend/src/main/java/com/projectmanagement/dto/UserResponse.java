package com.projectmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
