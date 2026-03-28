package com.steganography.backend.service;

import com.steganography.backend.util.AESUtil;
import com.steganography.backend.util.SteganographyUtil;
import com.steganography.backend.repository.StegoRepository;
import com.steganography.backend.model.StegoData;
import com.steganography.backend.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.util.List;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.time.LocalDateTime;

@Service
public class StegoService {

    @Autowired
    private StegoRepository repo;

    // =========================
    // 🔐 ENCODE
    // =========================
    public byte[] encode(MultipartFile file, String message, String password , User user) throws Exception {

    	// Convert ANY image → PNG properly
    	BufferedImage image = ImageIO.read(file.getInputStream());

    	if (image == null) {
    	    throw new RuntimeException("Invalid image file!");
    	}

    	File inputFile = File.createTempFile("input", ".png");
    	ImageIO.write(image, "png", inputFile);

        // Output file
        File outputFile = File.createTempFile("output", ".png");

        // Encrypt message
        String encrypted = AESUtil.encrypt(message, password);

        // Encode into image
        SteganographyUtil.encode(
                inputFile.getAbsolutePath(),
                outputFile.getAbsolutePath(),
                encrypted
        );

        // Save to DB
        StegoData data = new StegoData();
        data.setFileName("encoded_" + System.currentTimeMillis() + ".png");
        data.setMessage(message);
        data.setType("ENCODE");
        data.setUser(user);
        data.setTimestamp(LocalDateTime.now());
        repo.save(data);

        // Convert output image → byte[]
        byte[] imageBytes = Files.readAllBytes(outputFile.toPath());

        // Cleanup
        inputFile.delete();
        outputFile.delete();

        return imageBytes;
    }

    // =========================
    // 🔓 DECODE
    // =========================
    public String decode(MultipartFile file, String password, User user) throws Exception {

        System.out.println("🚀 SERVICE DECODE STARTED");

        BufferedImage image = ImageIO.read(file.getInputStream());

        if (image == null) {
            throw new RuntimeException("Invalid image file");
        }

        File inputFile = File.createTempFile("decode", ".png");
        ImageIO.write(image, "png", inputFile);

        // Extract hidden text
        String encrypted = SteganographyUtil.decode(inputFile.getAbsolutePath());
        System.out.println("📦 EXTRACTED DATA: " + encrypted);

        if (encrypted == null || encrypted.trim().isEmpty()) {
            throw new RuntimeException("No hidden data found or invalid image!");
        }

        String message;

        try {
            message = AESUtil.decrypt(encrypted, password);
            System.out.println("🔓 DECRYPTED MESSAGE: " + message);
        } catch (Exception e) {
            System.out.println("❌ WRONG PASSWORD");
            throw new RuntimeException("Wrong password!");
        }

        // SAVE EVENT
        StegoData data = new StegoData();
        data.setFileName("decoded_" + System.currentTimeMillis() + ".png");
        data.setMessage(message);
        data.setType("DECODE");
        data.setUser(user);
        data.setTimestamp(LocalDateTime.now());

        System.out.println("💾 SAVING DECODE TO DB");
        repo.save(data);

        inputFile.delete();

        return message;
    }

    // =========================
    // 📊 HISTORY
    // =========================
    public List<StegoData> getAll() {
        return repo.findAll();
    }

    // =========================
    // 🔍 DETECT
    // =========================
    public boolean detect(MultipartFile file) throws Exception {

        File temp = File.createTempFile("detect", ".png");
        file.transferTo(temp);

        String data = SteganographyUtil.decode(temp.getAbsolutePath());

        temp.delete();

        return data != null && !data.isEmpty();
    }
    public long getEncodedCount(User user) {
        return repo.countByTypeAndUser("ENCODE", user);
    }

    public long getDecodedCount(User user) {
        return repo.countByTypeAndUser("DECODE", user);
    }

    public List<StegoData> getRecent(User user) {
        return repo.findTop10ByUserOrderByIdDesc(user);
    }
    public List<StegoData> getByUser(User user) {
        return repo.findByUser(user);
    }

	public Object datacleardata(User user) {
		// TODO Auto-generated method stub
		return null;
	}
}
