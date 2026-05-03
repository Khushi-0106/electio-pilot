package com.electiopilot.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Handles CORS for Railway deployment and local dev
public class AIController {

    private final ChatClient chatClient;

    public AIController(ChatClient.Builder chatClientBuilder) {
        // We set up a system prompt to guide the AI as the Professional 2026 Election Guide.
        this.chatClient = chatClientBuilder
                .defaultSystem("You are a Professional 2026 Election Guide for the Election Commission of India. " +
                        "Your role is to help citizens understand the election process, voting timelines (especially the ongoing 2026 Lok Sabha elections where Phase 1 and 2 are complete and counting is on May 4), " +
                        "voter ID requirements, polling booth locations, and voter eligibility. " +
                        "Provide concise, accurate, and professional answers. Do not make up rules outside of standard ECI guidelines.")
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                .build();
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
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
            e.printStackTrace();
            return Map.of("response", "I'm currently offline or facing an issue reaching the election servers. Please try again later.");
        }
    }
}
