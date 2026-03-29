package com.steganography.backend.controller;

import com.steganography.backend.service.StegoService;
import com.steganography.backend.model.StegoData;
import com.steganography.backend.repository.UserRepository;
import com.steganography.backend.model.User;
import com.steganography.backend.util.StegoDetect;
import com.steganography.backend.repository.StegoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.io.File;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/stego")
@CrossOrigin(origins = "https://stego-front.onrender.com") // allow React sfrontend

public class StegoController {

    @Autowired
    private StegoService service;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private StegoRepository stegoRepo;
    
    

    // =========================
    // 🔐 ENCODE API
    // =========================
    @PostMapping("/encode")
    public @ResponseBody byte[] encode(
            @RequestParam("file") MultipartFile file,
            @RequestParam("message") String message,
            @RequestParam("password") String password,
            @RequestParam("username") String username
            
    ) throws Exception {
    	System.out.println("USERNAME: " + username);
    	
        User user = userRepo.findByUsername(username);
        System.out.println("USER OBJECT: " + user);
        return service.encode(file, message, password , user);
    }

    // =========================
    // 🔓 DECODE API
    // =========================
    @PostMapping("/decode")
    public String decode(
        @RequestParam("file") MultipartFile file,
        @RequestParam("password") String password,
        @RequestParam("username") String username
    ) throws Exception {

        System.out.println("🔥 CONTROLLER HIT: /decode API");

        System.out.println("DECODE USERNAME: " + username);

        User user = userRepo.findByUsername(username);

        System.out.println("DECODE USER OBJECT: " + user);

        String result = "";

        try {
            result = service.decode(file, password, user);
            System.out.println("🚀 AFTER SERVICE CALL");

            // SAVE ACTIVITY
            StegoData data = new StegoData();
            data.setUser(user);
            data.setFileName(file.getOriginalFilename());
            data.setType("DECODE");
            data.setTimestamp(LocalDateTime.now());

            System.out.println("💾 SAVING DECODE SUCCESS");
            

        } catch (Exception e) {

            System.out.println("❌ SAVING DECODE FAILED");

            StegoData data = new StegoData();
            data.setUser(user);
            data.setFileName(file.getOriginalFilename());
            data.setType("DECODE_FAILED");
            data.setTimestamp(LocalDateTime.now());

            stegoRepo.save(data);

            throw e;
        }

        return result;
    }

    // =========================
    // 📊 HISTORY API (Dashboard)
    // =========================
    @GetMapping("/history")
    public List<StegoData> getHistory(@RequestParam String username) {
        User user = userRepo.findByUsername(username);
        return service.getByUser(user);
    }

    // =========================
    // 🔍 OPTIONAL: DETECT HIDDEN DATA
    // =========================
    @PostMapping("/ai-detect")
    public String detectAI(@RequestParam("file") MultipartFile file) throws Exception {

        File temp = File.createTempFile("detect", ".png");
        file.transferTo(temp);

        boolean result = StegoDetect.hasHiddenData(temp.getAbsolutePath());

        temp.delete();

        return result
                ? "🤖 AI: Hidden Data Detected 🔐"
                : "🤖 AI: No Hidden Data Found ❌";
    }
    @GetMapping("/dashboard")
    public Map<String, Long> getDashboard(@RequestParam String username) {

        // DEBUG
        System.out.println("DASHBOARD USERNAME: " + username);

        User user = userRepo.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found!");
        }

        System.out.println("DASHBOARD USER OBJECT: " + user);

        Map<String, Long> data = new HashMap<>();

        data.put("encoded", service.getEncodedCount(user));
        data.put("decoded", service.getDecodedCount(user));
        data.put("secure", service.getEncodedCount(user)); // optional

        return data;
    }
}