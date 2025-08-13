package com.devtrack.config;

import com.devtrack.model.User;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String username = oAuth2User.getAttribute("login");

        // Save user if not exists
        userRepository.findByUsername(username)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(username);
                    return userRepository.save(newUser);
                });


        String token = jwtUtil.generateToken(username);

        // Redirect with token as query param
         response.sendRedirect("http://localhost:5173?token=" + token + "&username=" + username);
//        response.sendRedirect("https://devtrack-nine.vercel.app?token=" + token + "&username=" + username);

    }
}