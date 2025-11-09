package dev.baotrinh.personal_site_api.controller;

import dev.baotrinh.personal_site_api.dto.VisitRequest;
import dev.baotrinh.personal_site_api.dto.VisitResponse;
import dev.baotrinh.personal_site_api.service.VisitorCounterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for local development.
 * Provides HTTP endpoints that mirror the Lambda function behavior.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5176"}) // Allow React dev server
public class VisitorCounterController {
    
    private final VisitorCounterService visitorCounterService;
    
    /**
     * POST /visit endpoint for local development
     */
    @PostMapping("/visit")
    public VisitResponse visit(@RequestBody(required = false) VisitRequest request) {
        try {
            log.info("Processing visit request via REST controller");
            
            // Increment visitor counter and get new count
            Long newCount = visitorCounterService.incrementAndGetCount();
            
            log.info("Successfully processed visit request. New count: {}", newCount);
            return VisitResponse.success(newCount);
            
        } catch (Exception e) {
            log.error("Failed to process visit request - Error: {}", e.getMessage(), e);
            return VisitResponse.failure();
        }
    }
    
    /**
     * GET /visit endpoint for easy testing
     */
    @GetMapping("/visit")
    public VisitResponse getVisitCount() {
        try {
            log.info("Getting current visit count via REST controller");
            
            Long currentCount = visitorCounterService.getCurrentCount();
            
            log.info("Current visit count: {}", currentCount);
            return VisitResponse.success(currentCount);
            
        } catch (Exception e) {
            log.error("Failed to get visit count - Error: {}", e.getMessage(), e);
            return VisitResponse.failure();
        }
    }
}