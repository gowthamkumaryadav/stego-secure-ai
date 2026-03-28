package com.steganography.backend.util;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

public class StegoDetect {

    public static boolean hasHiddenData(String path) throws Exception {

        BufferedImage img = ImageIO.read(new File(path));

        if (img == null) {
            throw new RuntimeException("Invalid image!");
        }

        int totalPixels = img.getWidth() * img.getHeight();
        int ones = 0;
        int zeros = 0;

        // 🔍 Analyze LSB pattern (AI-style heuristic)
        for (int y = 0; y < img.getHeight(); y++) {
            for (int x = 0; x < img.getWidth(); x++) {

                int pixel = img.getRGB(x, y);
                int lsb = pixel & 1;

                if (lsb == 1) {
                    ones++;
                } else {
                    zeros++;
                }
            }
        }

        // 📊 Calculate ratio difference
        double ratio = (double) ones / totalPixels;

        // 🎯 AI-like decision:
        // Natural images → random LSB (~0.5)
        // Stego images → biased pattern
        boolean suspiciousPattern = (ratio < 0.45 || ratio > 0.55);

        // 🔐 EXTRA CHECK (REAL STEGO VALIDATION)
        String hiddenData = null;
        try {
            hiddenData = SteganographyUtil.decode(path);
        } catch (Exception e) {
            // ignore decode error
        }

        boolean actualDataFound =
                hiddenData != null &&
                hiddenData.contains("###END###");

        // 🧠 FINAL AI DECISION
        return suspiciousPattern || actualDataFound;
    }
}