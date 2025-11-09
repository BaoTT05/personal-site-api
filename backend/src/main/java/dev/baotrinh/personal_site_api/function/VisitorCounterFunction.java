package dev.baotrinh.personal_site_api.function;

import dev.baotrinh.personal_site_api.dto.VisitRequest;
import dev.baotrinh.personal_site_api.dto.VisitResponse;
import dev.baotrinh.personal_site_api.service.VisitorCounterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Function;

/**
 * Spring Cloud Function implementation for the visitor counter Lambda.
 * Provides a single function bean that handles POST /visit requests.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class VisitorCounterFunction {
    
    private final VisitorCounterService visitorCounterService;
    
    /**
     * Main function bean for handling visitor counter requests.
     * This function will be exposed as a Lambda function via Spring Cloud Function.
     *
     * @return Function that processes visit requests and returns visit responses
     */
    @Bean
    public Function<VisitRequest, VisitResponse> visit() {
        return request -> {
            try {
                log.info("Processing visit request for page: {}", request.getPage());
                
                // Increment visitor counter and get new count
                Long newCount = visitorCounterService.incrementAndGetCount();
                
                log.info("Successfully processed visit request. New count: {}", newCount);
                return VisitResponse.success(newCount);
                
            } catch (Exception e) {
                log.error("Failed to process visit request for page: {} - Error: {}", 
                    request.getPage(), e.getMessage(), e);
                return VisitResponse.failure();
            }
        };
    }
}
