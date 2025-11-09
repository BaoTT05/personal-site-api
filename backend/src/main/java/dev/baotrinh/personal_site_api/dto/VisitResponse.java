package dev.baotrinh.personal_site_api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

import java.time.Instant;

/**
 * Response DTO for visitor counter endpoint.
 */
@Value
public class VisitResponse {
    
    @JsonProperty("count")
    Long count;
    
    @JsonProperty("timestamp")
    Instant timestamp;
    
    @JsonProperty("success")
    boolean success;
    
    public static VisitResponse success(Long count) {
        return new VisitResponse(count, Instant.now(), true);
    }
    
    public static VisitResponse failure() {
        return new VisitResponse(0L, Instant.now(), false);
    }
}