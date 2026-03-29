package com.steganography.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.steganography.backend.model.User;
import com.steganography.backend.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "https://stego-front.onrender.com")
public class AuthController {

    @Autowired
    private UserRepository repo;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        repo.save(user);
        return "User registered!";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User existing = repo.findByUsername(user.getUsername());

        if (existing != null && existing.getPassword().equals(user.getPassword())) {
            return "Login Success";
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}