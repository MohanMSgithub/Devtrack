package com.devtrack.controller;

import com.devtrack.dto.LoginResponseDto;
import com.devtrack.security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/login-success")
    public LoginResponseDto loginSuccess(@AuthenticationPrincipal OAuth2User principal,
                                         HttpServletResponse response) {
        String username = principal.getAttribute("login"); // GitHub username
        String token = jwtUtil.generateToken(username);
        return new LoginResponseDto(token, username);
    }
}
