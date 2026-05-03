package com.electiopilot.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final ChatClient chatClient;

    public AIController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem("Context: You are Electio-Pilot AI. " +
                    "Guideline: Provide non-partisan, accurate information about the 2026 Indian Elections. " +
                    "Tone: Professional and concise.")
                .build();
    }

    @PostMapping("/chat")
    public Map<String, String> askGemini(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return Map.of("response", "Please provide a valid question.");
        }

        try {
            String aiResponse = this.chatClient.prompt()
                    .user(userMessage)
                    .call()
                    .content();
            return Map.of("response", aiResponse);
        } catch (Exception e) {
            return Map.of("response", "System recalibrating. Please try again later.");
        }
    }
}
