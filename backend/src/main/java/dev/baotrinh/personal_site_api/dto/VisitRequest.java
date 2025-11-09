package dev.baotrinh.personal_site_api.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

/**
 * Request DTO for visitor counter endpoint.
 * Currently no additional data is required, but this provides extensibility.
 */
@Value
public class VisitRequest {
    
    String page;
    String userAgent;
    
    @JsonCreator
    public VisitRequest(
        @JsonProperty("page") String page,
        @JsonProperty("userAgent") String userAgent
    ) {
        this.page = page != null ? page : "home";
        this.userAgent = userAgent;
    }
    
    public VisitRequest() {
        this("home", null);
    }
}