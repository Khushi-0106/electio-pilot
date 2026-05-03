package com.electiopilot.controller;

import org.springframework.ai.chat.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final ChatClient chatClient;

    @Autowired
    public AIController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @PostMapping("/chat")
    public Map<String, String> askGemini(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        
        // Innovation: System Instruction for non-partisan guidance
        String systemInstruction = "Context: You are Electio-Pilot AI. " +
            "Guideline: Provide non-partisan, accurate information about the 2026 Indian Elections. " +
            "Tone: Professional and concise.";

        try {
            String fullPrompt = systemInstruction + "\nUser Query: " + userMessage;
            String aiResponse = chatClient.call(fullPrompt);
            return Map.of("response", aiResponse);
        } catch (Exception e) {
            return Map.of("response", "System recalibrating. Please check GEMINI_API_KEY.");
        }
    }
}