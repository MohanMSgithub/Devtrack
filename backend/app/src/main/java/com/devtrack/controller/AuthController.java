package com.devtrack.controller;

import com.devtrack.dto.LoginResponseDto;
import com.devtrack.model.User;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.CustomUserDetails;
import com.devtrack.security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }


    public AuthController(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @GetMapping("/login-success")
    public LoginResponseDto loginSuccess(@AuthenticationPrincipal OAuth2User principal,
                                         HttpServletResponse response) {

        String githubId = principal.getAttribute("id");       // GitHub ID
        String username = principal.getAttribute("login");    // GitHub username
        String email = principal.getAttribute("email");       // GitHub email (can be null)

        // fallback for private email
        if (email == null || email.isEmpty()) {
            email = "not-provided";
        }

        // Check if user exists or create new
        Optional<User> optionalUser = userRepository.findByGithubId(githubId);
        User user = optionalUser.orElseGet(User::new);
        user.setGithubId(githubId);
        user.setUsername(username);
        user.setEmail(email);

        userRepository.save(user);

        // Generate token
        String token = jwtUtil.generateToken(username);

        return new LoginResponseDto(token, username);
    }
}
