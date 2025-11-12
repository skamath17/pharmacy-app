package com.pharmacy.auth.dto;

import com.pharmacy.auth.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private UserDto user;
    private String token;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private String id;
        private String email;
        private String role;
        private String firstName;
        private String lastName;
    }
}


